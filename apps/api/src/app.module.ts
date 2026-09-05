import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorModule } from './modules/instructors/instructor.module';
import { StudentModule } from './modules/students/student.module';
import { LessonModule } from './modules/lessons/lesson.module';
import { Instructor } from './modules/instructors/instructor.entity';
import { Student } from './modules/students/student.entity';
import { Lesson } from './modules/lessons/lesson.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'auto_ecole',
      entities: [Instructor, Student, Lesson],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    InstructorModule,
    StudentModule,
    LessonModule,
  ],
})
export class AppModule {}
