import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/services/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { InstructorModule } from '@/modules/instructors/instructor.module';
import { StudentModule } from '@/modules/students/student.module';
import { LessonModule } from '@/modules/lessons/lesson.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    InstructorModule,
    StudentModule,
    LessonModule,
  ],
})
export class AppModule {}
