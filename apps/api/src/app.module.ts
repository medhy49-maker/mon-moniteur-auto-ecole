import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/services/prisma.service';
import { InstructorModule } from '@/modules/instructors/instructor.module';
import { StudentModule } from '@/modules/students/student.module';
import { LessonModule } from '@/modules/lessons/lesson.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    InstructorModule,
    StudentModule,
    LessonModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
