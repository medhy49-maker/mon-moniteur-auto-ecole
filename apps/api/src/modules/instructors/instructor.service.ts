import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
    const instructor = this.instructorRepository.create(createInstructorDto);
    return await this.instructorRepository.save(instructor);
  }

  async findAll(): Promise<Instructor[]> {
    return await this.instructorRepository.find({
      relations: ['lessons'],
    });
  }

  async findOne(id: string): Promise<Instructor> {
    const instructor = await this.instructorRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return instructor;
  }

  async findByEmail(email: string): Promise<Instructor> {
    const instructor = await this.instructorRepository.findOne({
      where: { email },
    });
    if (!instructor) {
      throw new NotFoundException(`Instructor with email ${email} not found`);
    }
    return instructor;
  }

  async update(id: string, updateInstructorDto: UpdateInstructorDto): Promise<Instructor> {
    await this.instructorRepository.update(id, updateInstructorDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const instructor = await this.findOne(id);
    await this.instructorRepository.remove(instructor);
  }
}
