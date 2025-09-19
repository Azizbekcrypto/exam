import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SendDeadlineDto {
  @ApiProperty({
    type: 'string',
    example: '0117579b-a66d-4e02-8132-d6ca61e4813c',
    description: 'Borrow ID',
  })
  @IsNotEmpty()
  borrowId: string;
}
