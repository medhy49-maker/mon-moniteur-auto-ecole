import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/services/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InstructorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInstructorDto: CreateInstructorDto) {
    try {
      return await this.prisma.instructor.create({
        data: createInstructorDto,
        include: { lessons: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          const field = target?.[0] ?? 'field';
          throw new ConflictException(
            `Instructor with ${field} already exists`,
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.instructor.findMany({
      include: { lessons: true },
    });
  }

  async findOne(id: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { id },
      include: { lessons: true },
    });
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return instructor;
  }

  async findByEmail(email: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { email },
      include: { lessons: true },
    });
    if (!instructor) {
      throw new NotFoundException(`Instructor with email ${email} not found`);
    }
    return instructor;
  }

  async findByStatus(status: string) {
    return await this.prisma.instructor.findMany({
      where: { status },
      include: { lessons: true },
    });
  }

  async update(id: string, updateInstructorDto: UpdateInstructorDto) {
    try {
      return await this.prisma.instructor.update({
        where: { id },
        data: updateInstructorDto,
        include: { lessons: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Instructor with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          const field = target?.[0] ?? 'field';
          throw new ConflictException(
            `Instructor with ${field} already exists`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.instructor.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Instructor with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
