import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Instructor } from '../instructors/instructor.entity';
import { Student } from '../students/student.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @Column({ type: 'int', default: 0 })
  duration: number; // in minutes

  @Column({ type: 'varchar', length: 20 })
  type: string; // 'theory', 'practice', 'exam'

  @Column({ type: 'enum', enum: ['scheduled', 'in_progress', 'completed', 'cancelled'] })
  status: string;

  @Column({ type: 'int', nullable: true })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'uuid' })
  instructorId: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @ManyToOne(() => Instructor, (instructor) => instructor.lessons)
  @JoinColumn({ name: 'instructorId' })
  instructor: Instructor;

  @ManyToOne(() => Student, (student) => student.lessons)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
