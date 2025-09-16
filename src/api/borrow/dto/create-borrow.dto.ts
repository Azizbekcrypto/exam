import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsUUID } from "class-validator";

export class CreateBorrowDto {
    @ApiProperty({
        type: 'string',
        example: '2023-12-25T10:30:00',
      })
      @IsDateString()
      @IsNotEmpty()
      borrowDate: Date;
    
      @ApiProperty({
        type: 'string',
        example: '2023-12-31T10:30:00',
      })
      @IsDateString()
      @IsNotEmpty()
      dueDate: Date;
    
      @ApiProperty({
        type: 'string',
        example: '2024-01-02:30:00',
      })
      @IsDateString()
      @IsNotEmpty()
      returnDate: Date;
    
      @ApiProperty({
        type: 'boolean',
        example: true,
      })
      @IsBoolean()
      @IsNotEmpty()
      overdue: boolean;
    
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
