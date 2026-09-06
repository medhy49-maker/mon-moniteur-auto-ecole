import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/services/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      return await this.prisma.student.create({
        data: createStudentDto,
        include: { lessons: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          const field = target?.[0] ?? 'field';
          throw new ConflictException(`Student with ${field} already exists`);
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.student.findMany({
      include: { lessons: true },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { lessons: true },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async findByEmail(email: string) {
    const student = await this.prisma.student.findUnique({
      where: { email },
      include: { lessons: true },
    });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    return student;
  }

  async findByLevel(level: string) {
    return await this.prisma.student.findMany({
      where: { level },
      include: { lessons: true },
    });
  }

  async findByStatus(status: string) {
    return await this.prisma.student.findMany({
      where: { status },
      include: { lessons: true },
    });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      return await this.prisma.student.update({
        where: { id },
        data: updateStudentDto,
        include: { lessons: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Student with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          const field = target?.[0] ?? 'field';
          throw new ConflictException(`Student with ${field} already exists`);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.student.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Student with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async incrementHours(id: string, hours: number) {
    try {
      return await this.prisma.student.update({
        where: { id },
        data: {
          hoursCompleted: {
            increment: hours,
          },
        },
        include: { lessons: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Student with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
