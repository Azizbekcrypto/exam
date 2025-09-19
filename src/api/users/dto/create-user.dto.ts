import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserSRole } from "src/common/enum/users.enum";

export class CreateUserDto {

  @ApiProperty({
    type: 'string',
    description: 'user full name',
    example: 'Toshmat Eshmatov',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    type: 'string',
    description: 'user email address',
    example: 'toshmet@gmail.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'user password',
    example: 'Developer1!',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserSRole)
  @IsOptional()
  role?: UserSRole;
}

