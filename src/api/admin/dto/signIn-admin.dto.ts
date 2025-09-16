import { OmitType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';

export class SignInDto extends OmitType(CreateAdminDto, [
  'full_name',
] as const) {}
