import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class RegistrDto extends OmitType(CreateUserDto, ['role']) {}