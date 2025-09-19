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
    example: 'Eshmat',
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

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'Password for admin',
    example: 'Eshmat123!',
  })
  @IsStrongPassword()
  password: string;
}
