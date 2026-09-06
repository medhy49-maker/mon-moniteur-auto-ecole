import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '@/services/prisma.service';
import { AuthenticatedUser } from './types/authenticated-user.interface';
import { JwtPayload } from './types/jwt-payload.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface StoredRefreshToken {
  token: string;
  record: RefreshToken;
}

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenTtlSeconds: number;
  private readonly refreshTokenTtlSeconds: number;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    const accessTokenSecret = configService.get<string>('JWT_ACCESS_SECRET');
    if (!accessTokenSecret) {
      throw new Error('JWT_ACCESS_SECRET must be configured');
    }
    this.accessTokenSecret = accessTokenSecret;
    this.accessTokenTtlSeconds = this.getPositiveInteger(
      configService.get<string>('JWT_ACCESS_TTL_SECONDS'),
      900,
      'JWT_ACCESS_TTL_SECONDS',
    );
    this.refreshTokenTtlSeconds = this.getPositiveInteger(
      configService.get<string>('JWT_REFRESH_TTL_SECONDS'),
      2_592_000,
      'JWT_REFRESH_TTL_SECONDS',
    );
    const refreshTokenSecret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshTokenSecret) {
      throw new Error('JWT_REFRESH_SECRET must be configured');
    }
    this.refreshTokenSecret = refreshTokenSecret;
  }

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        status: true,
      },
    });
    if (
      !user ||
      user.status !== UserStatus.ACTIVE ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { id: user.id, email: user.email, role: user.role };
  }

  async login(user: AuthenticatedUser): Promise<TokenPair> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return this.issueTokenPair(user);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashRefreshToken(refreshToken) },
      include: {
        user: {
          select: { id: true, email: true, role: true, status: true },
        },
      },
    });
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (
      storedToken.revokedAt ||
      storedToken.expiresAt <= new Date() ||
      storedToken.user.status !== UserStatus.ACTIVE
    ) {
      await this.revokeTokenFamily(storedToken.familyId);
      throw new UnauthorizedException('Refresh token is no longer valid');
    }

    const rotated = await this.rotateRefreshToken(storedToken);
    if (!rotated) {
      await this.revokeTokenFamily(storedToken.familyId);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const user = {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    };
    return {
      accessToken: await this.createAccessToken(user),
      refreshToken: rotated.token,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        tokenHash: this.hashRefreshToken(refreshToken),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  async logoutAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueTokenPair(user: AuthenticatedUser): Promise<TokenPair> {
    const refreshToken = await this.createRefreshToken(user.id);
    return {
      accessToken: await this.createAccessToken(user),
      refreshToken: refreshToken.token,
    };
  }

  private async createAccessToken(user: AuthenticatedUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };
    return this.jwtService.signAsync(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenTtlSeconds,
    });
  }

  private async createRefreshToken(
    userId: string,
    familyId = this.generateRandomToken(16),
    parentTokenId?: string,
  ): Promise<StoredRefreshToken> {
    const token = this.generateRandomToken(48);
    const record = await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hashRefreshToken(token),
        familyId,
        parentTokenId,
        expiresAt: new Date(Date.now() + this.refreshTokenTtlSeconds * 1000),
        userId,
      },
    });
    return { token, record };
  }

  private async rotateRefreshToken(
    currentToken: RefreshToken & {
      user: AuthenticatedUser & { status: UserStatus };
    },
  ): Promise<StoredRefreshToken | null> {
    const replacement = this.generateRandomToken(48);
    const now = new Date();
    const result = await this.prisma.$transaction(async (transaction) => {
      const revoked = await transaction.refreshToken.updateMany({
        where: {
          id: currentToken.id,
          tokenHash: currentToken.tokenHash,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: { revokedAt: now },
      });
      if (revoked.count !== 1) {
        return null;
      }

      const record = await transaction.refreshToken.create({
        data: {
          tokenHash: this.hashRefreshToken(replacement),
          familyId: currentToken.familyId,
          parentTokenId: currentToken.id,
          expiresAt: new Date(Date.now() + this.refreshTokenTtlSeconds * 1000),
          userId: currentToken.userId,
        },
      });
      return { token: replacement, record };
    });
    return result;
  }

  private async revokeTokenFamily(familyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private hashRefreshToken(token: string): string {
    return createHash('sha256')
      .update(`${this.refreshTokenSecret}:${token}`)
      .digest('hex');
  }

  private generateRandomToken(size: number): string {
    return randomBytes(size).toString('base64url');
  }

  private getPositiveInteger(
    value: string | undefined,
    defaultValue: number,
    name: string,
  ): number {
    if (!value) {
      return defaultValue;
    }
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      throw new Error(`${name} must be a positive integer`);
    }
    return parsed;
  }
}
