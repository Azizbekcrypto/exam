import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export enum HistoryAction {
  BORROW = 'borrow',
  RETURN = 'return',
}

export class CreateBookHistoryDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  bookId: string;

  @IsEnum(HistoryAction)
  @IsNotEmpty()
  action: HistoryAction;
}
