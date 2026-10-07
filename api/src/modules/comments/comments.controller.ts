import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from 'src/common/helpers/pagination.helper';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return this.commentService.create(createCommentDto, req.user.id);
  }

  @Get('hoagie/:hoagieId')
  @ApiOperation({ summary: 'Get comments for a specific hoagie' })
  @ApiParam({ name: 'hoagieId', description: 'The ID of the hoagie' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findByHoagie(
    @Param('hoagieId') hoagieId: string,
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return this.commentService.findByHoagie(
      hoagieId,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get('count/hoagie/:hoagieId')
  @ApiOperation({ summary: 'Get comment count for a hoagie' })
  @ApiParam({ name: 'hoagieId', description: 'The ID of the hoagie' })
  async countByHoagie(@Param('hoagieId') hoagieId: string) {
    const count = await this.commentService.countByHoagie(hoagieId);
    return { count };
  }
}
