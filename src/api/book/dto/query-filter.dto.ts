
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({
    description: 'Qidiriladigan qiymat',
    example: 'Aziz',
  })
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({
    description: 'Qaysi field bo‘yicha qidirish (email, fullName, role)',
    example: 'email',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
