import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MembershipStatus, SchoolRole, UserRole } from '@prisma/client';
import { Request } from 'express';
import { isUUID } from 'class-validator';
import { PrismaService } from '@/services/prisma.service';
import { SCHOOL_ROLES_KEY } from '../decorators/school-roles.decorator';

@Injectable()
export class SchoolRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<SchoolRole[]>(
      SCHOOL_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const schoolId = request.header('x-school-id');
    if (!schoolId || !isUUID(schoolId, '4')) {
      throw new ForbiddenException('A valid X-School-Id header is required');
    }

    const membership = await this.prisma.schoolMembership.findFirst({
      where: {
        userId: user.id,
        schoolId,
        status: MembershipStatus.ACTIVE,
        role: { in: roles },
      },
      select: {
        id: true,
        schoolId: true,
        role: true,
      },
    });
    if (!membership) {
      throw new ForbiddenException(
        'An active school membership with the required role is required',
      );
    }

    request.schoolMembership = membership;
    return true;
  }
}
