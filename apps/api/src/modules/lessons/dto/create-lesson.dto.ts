import { IsString, IsOptional, IsEnum, IsInt, IsUUID, IsDate, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @ApiProperty({ description: 'Titre de la leçon', example: 'Code de la route - Module 1' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Description de la leçon',
    example: 'Introduction aux règles de circulation',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Date et heure planifiée', example: '2026-09-10T14:00:00Z' })
  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;

  @ApiProperty({
    description: 'Durée en minutes',
    example: 60,
  })
  @IsInt()
  @Min(15)
  duration: number;

  @ApiProperty({
    description: 'Type de leçon',
    enum: ['theory', 'practice', 'exam'],
    example: 'practice',
  })
  @IsEnum(['theory', 'practice', 'exam'])
  type: string;

  @ApiProperty({
    description: 'ID de l\'instructeur',
    example: 'uuid-string',
  })
  @IsUUID()
  instructorId: string;

  @ApiProperty({
    description: 'ID de l\'étudiant',
    example: 'uuid-string',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Lieu de la leçon',
    example: 'Parking de la gare',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;
}
