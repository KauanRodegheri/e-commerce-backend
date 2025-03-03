import { IsNumber, IsOptional, Max } from 'class-validator';

export class PaginationDto {
  @Max(50)
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  setOff?: number;
}
