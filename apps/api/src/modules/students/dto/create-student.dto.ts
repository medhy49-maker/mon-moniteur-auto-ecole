import {
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsDate,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ApiProperty({ description: "Prénom de l'étudiant", example: 'Marie' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: "Nom de l'étudiant", example: 'Martin' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Email unique',
    example: 'marie.martin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Numéro de téléphone', example: '+33612345678' })
  @IsPhoneNumber('FR')
  phone: string;

  @ApiProperty({ description: 'Date de naissance', example: '2000-01-15' })
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({ description: 'Numéro de permis unique', example: 'P123456' })
  @IsString()
  @MaxLength(20)
  licenseNumber: string;

  @ApiProperty({
    description: 'Niveau',
    enum: ['beginner', 'intermediate', 'advanced', 'completed'],
    example: 'beginner',
  })
  @IsEnum(['beginner', 'intermediate', 'advanced', 'completed'])
  level: string;

  @ApiProperty({
    description: 'Statut',
    enum: ['active', 'inactive', 'suspended'],
    example: 'active',
  })
  @IsEnum(['active', 'inactive', 'suspended'])
  status: string;

  @ApiProperty({
    description: 'URL de la photo de profil',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
