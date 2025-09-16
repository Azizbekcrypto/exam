import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsNotEmpty()
    @IsNumber()
    year?: number;

    @IsOptional()
    @IsBoolean()
    available?: boolean;
}
