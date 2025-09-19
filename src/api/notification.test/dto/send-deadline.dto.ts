import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SendDeadlineDto {
  @ApiProperty({
    type: 'string',
    example: '8f5a8b4d-3c1b-4b87-a0d3-d4a6e62b8bcd',
    description: 'Borrow ID',
  })
  @IsNotEmpty()
  borrowId: string;
}
