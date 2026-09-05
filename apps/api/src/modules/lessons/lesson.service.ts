import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const lesson = this.lessonRepository.create(createLessonDto);
    lesson.status = 'scheduled';
    return await this.lessonRepository.save(lesson);
  }

  async findAll(): Promise<Lesson[]> {
    return await this.lessonRepository.find({
      relations: ['instructor', 'student'],
    });
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['instructor', 'student'],
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async findByStudent(studentId: string): Promise<Lesson[]> {
    return await this.lessonRepository.find({
      where: { studentId },
      relations: ['instructor', 'student'],
    });
  }

  async findByInstructor(instructorId: string): Promise<Lesson[]> {
    return await this.lessonRepository.find({
      where: { instructorId },
      relations: ['instructor', 'student'],
    });
  }

  async findByStatus(status: string): Promise<Lesson[]> {
    return await this.lessonRepository.find({
      where: { status },
      relations: ['instructor', 'student'],
    });
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    await this.lessonRepository.update(id, updateLessonDto);
    return this.findOne(id);
  }

  async startLesson(id: string): Promise<Lesson> {
    const lesson = await this.findOne(id);
    if (lesson.status !== 'scheduled') {
      throw new BadRequestException('Only scheduled lessons can be started');
    }
    lesson.status = 'in_progress';
    lesson.startedAt = new Date();
    return await this.lessonRepository.save(lesson);
  }

  async completeLesson(id: string, rating?: number, feedback?: string): Promise<Lesson> {
    const lesson = await this.findOne(id);
    if (lesson.status !== 'in_progress') {
      throw new BadRequestException('Only in-progress lessons can be completed');
    }
    lesson.status = 'completed';
    lesson.endedAt = new Date();
    if (lesson.startedAt) {
      lesson.duration = Math.round(
        (lesson.endedAt.getTime() - lesson.startedAt.getTime()) / 60000,
      );
    }
    if (rating) {
      lesson.rating = rating;
    }
    if (feedback) {
      lesson.feedback = feedback;
    }
    return await this.lessonRepository.save(lesson);
  }

  async cancelLesson(id: string): Promise<Lesson> {
    const lesson = await this.findOne(id);
    lesson.status = 'cancelled';
    return await this.lessonRepository.save(lesson);
  }

  async remove(id: string): Promise<void> {
    const lesson = await this.findOne(id);
    await this.lessonRepository.remove(lesson);
  }
}
