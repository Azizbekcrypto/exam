import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class SendLateDto {
    @ApiProperty({
      description: "Order ID (uuid)",
      example: "70fec080-d4a7-4e2e-8d0b-46754054ff59",
    })
    @IsNotEmpty()
    @IsUUID()
    orderId: string;
  }