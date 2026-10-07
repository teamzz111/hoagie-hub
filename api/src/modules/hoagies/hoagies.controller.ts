import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  HttpStatus,
  HttpCode,
  UseGuards,
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
import { HoagieService } from './hoagies.service';
import { PaginationDto } from 'src/common/helpers/pagination.helper';
import { UpdateHoagieDto } from './dto/update-hoagie.dto';
import { CreateHoagieDto } from './dto/create-hoagie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('hoagies')
@Controller('hoagies')
export class HoagiesController {
  constructor(private readonly hoagieService: HoagieService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new hoagie' })
  @ApiResponse({
    status: 201,
    description: 'The hoagie has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createHoagieDto: CreateHoagieDto, @Req() req) {
    return this.hoagieService.create(createHoagieDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all hoagies with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starting from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, description: 'Return the hoagies.' })
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return this.hoagieService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get hoagies created by a specific user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({ status: 200, description: 'Return the hoagies.' })
  findByCreator(
    @Param('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.hoagieService.findByCreator(
      userId,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get('collaborations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get hoagies where the current user is a collaborator',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({ status: 200, description: 'Return the hoagies.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findByCollaborator(@Req() req, @Query() paginationDto: PaginationDto) {
    return this.hoagieService.findByCollaborator(
      req.user.id,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hoagie by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the hoagie' })
  @ApiResponse({ status: 200, description: 'Return the hoagie.' })
  @ApiResponse({ status: 404, description: 'Hoagie not found.' })
  findOne(@Param('id') id: string) {
    return this.hoagieService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a hoagie' })
  @ApiParam({ name: 'id', description: 'The ID of the hoagie' })
  @ApiResponse({
    status: 200,
    description: 'The hoagie has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Hoagie not found.' })
  update(
    @Param('id') id: string,
    @Body() updateHoagieDto: UpdateHoagieDto,
    @Req() req,
  ) {
    return this.hoagieService.update(id, updateHoagieDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a hoagie' })
  @ApiParam({ name: 'id', description: 'The ID of the hoagie' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'The hoagie has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Hoagie not found.' })
  async remove(@Param('id') id: string, @Req() req) {
    await this.hoagieService.remove(id, req.user.id);
    return;
  }

  @Post(':id/collaborators/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add a collaborator to a hoagie' })
  @ApiParam({ name: 'id', description: 'The ID of the hoagie' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to add as collaborator',
  })
  @ApiResponse({
    status: 200,
    description: 'The collaborator has been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Hoagie not found.' })
  addCollaborator(
    @Param('id') id: string,
    @Param('userId') collaboratorId: string,
    @Req() req,
  ) {
    return this.hoagieService.addCollaborator(id, collaboratorId, req.user.id);
  }

  @Delete(':id/collaborators/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove a collaborator from a hoagie' })
  @ApiParam({ name: 'id', description: 'The ID of the hoagie' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to remove as collaborator',
  })
  @ApiResponse({
    status: 200,
    description: 'The collaborator has been successfully removed.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Hoagie not found.' })
  removeCollaborator(
    @Param('id') id: string,
    @Param('userId') collaboratorId: string,
    @Req() req,
  ) {
    return this.hoagieService.removeCollaborator(
      id,
      collaboratorId,
      req.user.id,
    );
  }

  @Get(':id/collaborators/count')
  @ApiOperation({ summary: 'Get the number of collaborators for a hoagie' })
  @ApiParam({ name: 'id', description: 'The ID of the hoagie' })
  @ApiResponse({ status: 200, description: 'Return the collaborator count.' })
  @ApiResponse({ status: 404, description: 'Hoagie not found.' })
  async getCollaboratorCount(@Param('id') id: string) {
    const count = await this.hoagieService.getCollaboratorCount(id);
    return { count };
  }

  @Get(':id/permissions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check user permissions for a hoagie' })
  @ApiParam({ name: 'id', description: 'The ID of the hoagie' })
  @ApiResponse({
    status: 200,
    description: 'Return the permission information.',
  })
  @ApiResponse({ status: 404, description: 'Hoagie not found.' })
  async checkPermission(@Param('id') id: string, @Req() req) {
    return this.hoagieService.checkPermission(id, req.user.id);
  }
}
