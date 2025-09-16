import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserSRole } from "src/common/enum/users.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    full_name: string;
  
    @IsEmail()
    @IsString()
    email: string;
  
    @IsNotEmpty()
    @MinLength(6)
    password: string;
  
    @IsEnum(UserSRole)
    role: UserSRole; // faqat admin user yaratishda berishi mumkin
  }
  
