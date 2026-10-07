import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class IngredientDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  quantity: string;
}

export class CreateHoagieDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsArray()
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @IsOptional()
  @ApiProperty()
  pictureUrl?: string;
}
