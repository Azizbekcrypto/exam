import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    type: 'string',
    description: 'user_name for admin',
    example: 'developer',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'full name for admin',
    example: 'Azizbek Xayrullayev',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    type: 'string',
    description: 'email for admin',
    example: 'khayrullayevbinance@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Password for admin',
    example: 'Developer1!',
  })
  @IsStrongPassword()
  password: string;
}
