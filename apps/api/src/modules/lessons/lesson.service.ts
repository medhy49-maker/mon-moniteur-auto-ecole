import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/services/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto) {
    try {
      return await this.prisma.lesson.create({
        data: {
          ...createLessonDto,
          status: 'scheduled',
        },
        include: { instructor: true, student: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ConflictException('Instructor or Student not found');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.lesson.findMany({
      include: { instructor: true, student: true },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { instructor: true, student: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async findByStudent(studentId: string) {
    return await this.prisma.lesson.findMany({
      where: { studentId },
      include: { instructor: true, student: true },
    });
  }

  async findByInstructor(instructorId: string) {
    return await this.prisma.lesson.findMany({
      where: { instructorId },
      include: { instructor: true, student: true },
    });
  }

  async findByStatus(status: string) {
    return await this.prisma.lesson.findMany({
      where: { status },
      include: { instructor: true, student: true },
    });
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    try {
      return await this.prisma.lesson.update({
        where: { id },
        data: updateLessonDto,
        include: { instructor: true, student: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async startLesson(id: string) {
    const lesson = await this.findOne(id);
    if (lesson.status !== 'scheduled') {
      throw new BadRequestException('Only scheduled lessons can be started');
    }
    return await this.prisma.lesson.update({
      where: { id },
      data: {
        status: 'in_progress',
        startedAt: new Date(),
      },
      include: { instructor: true, student: true },
    });
  }

  async completeLesson(id: string, rating?: number, feedback?: string) {
    const lesson = await this.findOne(id);
    if (lesson.status !== 'in_progress') {
      throw new BadRequestException(
        'Only in-progress lessons can be completed',
      );
    }
    const endedAt = new Date();
    let duration = lesson.duration;
    if (lesson.startedAt) {
      duration = Math.round(
        (endedAt.getTime() - lesson.startedAt.getTime()) / 60000,
      );
    }
    return await this.prisma.lesson.update({
      where: { id },
      data: {
        status: 'completed',
        endedAt,
        duration,
        rating,
        feedback,
      },
      include: { instructor: true, student: true },
    });
  }

  async cancelLesson(id: string) {
    await this.findOne(id);
    return await this.prisma.lesson.update({
      where: { id },
      data: { status: 'cancelled' },
      include: { instructor: true, student: true },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.lesson.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
