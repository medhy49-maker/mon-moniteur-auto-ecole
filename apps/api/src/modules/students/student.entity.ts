import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Lesson } from '../lessons/lesson.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 20, unique: true })
  licenseNumber: string;

  @Column({ type: 'enum', enum: ['beginner', 'intermediate', 'advanced', 'completed'] })
  level: string;

  @Column({ type: 'int', default: 0 })
  hoursCompleted: number;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'suspended'] })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePicture: string;

  @OneToMany(() => Lesson, (lesson) => lesson.student)
  lessons: Lesson[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
