import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This hoagie looks delicious!' })
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: '60d21b4667d0d8992e610c85' })
  @IsMongoId()
  hoagie: string;
}
