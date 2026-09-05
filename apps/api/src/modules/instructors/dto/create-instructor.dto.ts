import { IsEmail, IsPhoneNumber, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstructorDto {
  @ApiProperty({ description: 'Prénom de l\'instructeur', example: 'Jean' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Nom de l\'instructeur', example: 'Dupont' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ description: 'Email unique', example: 'jean.dupont@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Numéro de téléphone', example: '+33612345678' })
  @IsPhoneNumber('FR')
  phone: string;

  @ApiProperty({ description: 'Numéro de permis unique', example: 'DL123456' })
  @IsString()
  @MaxLength(20)
  licenseNumber: string;

  @ApiProperty({
    description: 'Statut',
    enum: ['active', 'inactive', 'suspended'],
    example: 'active',
  })
  @IsEnum(['active', 'inactive', 'suspended'])
  status: string;

  @ApiProperty({
    description: 'Biographie',
    example: '10 ans d\'expérience en enseignement de conduite',
    required: false,
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty({
    description: 'URL de la photo de profil',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
