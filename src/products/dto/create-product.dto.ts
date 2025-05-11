import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';
import { Material } from 'src/commom/enum/material.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  //@IsNumber()
  //@IsNotEmpty()
  categoryId?: number;

  @ApiProperty({ type: Number, nullable: false, required: true})
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: String, nullable: true, required: false})
  @IsString()
  @MaxLength(140)
  description?: string;

  @ApiProperty({ type: [String], required: false})
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  imageUrl?: string[];

  @ApiProperty({ type: [String], nullable: true, required: false})
  @IsArray()
  material?: Material[];
}
