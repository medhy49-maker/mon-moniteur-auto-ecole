import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(createStudentDto);
    return await this.studentRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: ['lessons'],
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async findByEmail(email: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { email },
    });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    return student;
  }

  async findByLevel(level: string): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { level },
    });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    await this.studentRepository.update(id, updateStudentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  async incrementHours(id: string, hours: number): Promise<Student> {
    const student = await this.findOne(id);
    student.hoursCompleted += hours;
    return await this.studentRepository.save(student);
  }
}
