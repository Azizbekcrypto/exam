import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsNotEmpty()
    @IsNumber()
    published_year?: number;

    @IsOptional()
    @IsBoolean()
    available?: boolean;
}
