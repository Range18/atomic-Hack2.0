import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFileDto {
  @IsBoolean()
  @Transform(({ value }) => value == 'true')
  @IsOptional()
  isDocument?: boolean;

  @IsString()
  @IsOptional()
  search?: string;
}
