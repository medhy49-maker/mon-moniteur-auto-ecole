import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'marie.martin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'a-strong-password' })
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password: string;
}
