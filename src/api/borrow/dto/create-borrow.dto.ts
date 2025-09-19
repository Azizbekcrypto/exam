import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateBorrowDto {
  @ApiProperty({
    type: 'string',
    example: '2023-12-25T10:30:00',
  })

  @ApiProperty({
    type: 'string',
    description: 'borrow date default date now  ',
    example: '19.09.2025',
  })
  @IsDateString()
  @IsNotEmpty()
  borrowDate: Date;    // Kitobni olgan sana

  @ApiProperty({
    type: 'string',
    example: '2023-12-31T10:30:00',
  })
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;  // Kitob olayotganda qaytaraman degan sana


  @IsDateString()
  @IsOptional()
  returnDate?: Date;  // Foydalanuvchi haqiqatdan ham qaytargan sanasi {Optional}

  @IsBoolean()
  @IsOptional()
  overdue?: boolean; // agar foydalanuvchi due_datedan keyin qaytarsa true.

  @ApiProperty({
    type: 'string',
    example: '2622b57c-16b7-444e-87d0-a9a8f57bfdab',
  })
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({
    type: 'string',
    example: 'be35f553-8473-4486-a96f-a9ce120ec9ae',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
