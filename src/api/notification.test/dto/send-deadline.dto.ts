import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SendDeadlineDto {
  @ApiProperty({
    description: 'Order ID (uuid yoki number)',
    example: '1',
  })
  @IsNotEmpty()
  orderId: string;
}
