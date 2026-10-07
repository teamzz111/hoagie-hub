import { PartialType } from '@nestjs/mapped-types';
import { CreateHoagieDto } from './create-hoagie.dto';

export class UpdateHoagieDto extends PartialType(CreateHoagieDto) {}
