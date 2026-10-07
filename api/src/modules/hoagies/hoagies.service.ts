import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PaginationResult } from 'src/common/helpers/pagination.helper';
import { CreateHoagieDto } from './dto/create-hoagie.dto';
import { UpdateHoagieDto } from './dto/update-hoagie.dto';
import { Hoagie } from './entities/hoagies.entity';
import { HoagieRepository } from './hoagies.repository';

@Injectable()
export class HoagieService {
  constructor(private readonly hoagieRepository: HoagieRepository) {}

  async create(
    createHoagieDto: CreateHoagieDto,
    userId: string,
  ): Promise<Hoagie> {
    if (
      !createHoagieDto.name ||
      !createHoagieDto.ingredients ||
      createHoagieDto.ingredients.length === 0
    ) {
      throw new BadRequestException(
        'Hoagie name and at least one ingredient are required',
      );
    }

    return this.hoagieRepository.createHoagie(createHoagieDto, userId);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Hoagie>> {
    return this.hoagieRepository.getPaginatedHoagies(page, limit);
  }

  async findOne(id: string): Promise<Hoagie> {
    const hoagie = await this.hoagieRepository.getHoagieWithDetails(id);
    if (!hoagie) {
      throw new NotFoundException(`Hoagie with ID "${id}" not found`);
    }
    return hoagie;
  }

  async update(
    id: string,
    updateHoagieDto: UpdateHoagieDto,
    userId: string,
  ): Promise<Hoagie> {
    const hoagie = await this.findOne(id);

    const isCreator = hoagie.creator._id.toString() === userId;
    const isCollaborator = hoagie.collaborators?.some(
      (collaborator) => collaborator.toString() === userId,
    );

    if (!isCreator && !isCollaborator) {
      throw new ForbiddenException(
        'You do not have permission to update this hoagie',
      );
    }

    const updatedHoagie = await this.hoagieRepository.update(
      id,
      updateHoagieDto,
    );
    if (!updatedHoagie) {
      throw new NotFoundException(`Failed to update hoagie with ID "${id}"`);
    }

    return updatedHoagie;
  }

  async remove(id: string, userId: string): Promise<void> {
    const hoagie = await this.findOne(id);

    if (hoagie.creator._id.toString() !== userId) {
      throw new ForbiddenException('Only the creator can delete this hoagie');
    }

    const deleted = await this.hoagieRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Failed to delete hoagie with ID "${id}"`);
    }
  }

  async addCollaborator(
    hoagieId: string,
    collaboratorId: string,
    userId: string,
  ): Promise<Hoagie> {
    const hoagie = await this.findOne(hoagieId);

    if (hoagie.creator._id.toString() !== userId) {
      throw new ForbiddenException('Only the creator can add collaborators');
    }

    if (collaboratorId === userId) {
      throw new BadRequestException(
        'You cannot add yourself as a collaborator',
      );
    }

    const isAlreadyCollaborator = hoagie.collaborators?.some(
      (collaborator) => collaborator.toString() === collaboratorId,
    );

    if (isAlreadyCollaborator) {
      throw new BadRequestException('User is already a collaborator');
    }

    const updatedHoagie = await this.hoagieRepository.addCollaborator(
      hoagieId,
      collaboratorId,
    );
    if (!updatedHoagie) {
      throw new NotFoundException(
        `Failed to add collaborator to hoagie with ID "${hoagieId}"`,
      );
    }

    return updatedHoagie;
  }

  async removeCollaborator(
    hoagieId: string,
    collaboratorId: string,
    userId: string,
  ): Promise<Hoagie> {
    const hoagie = await this.findOne(hoagieId);

    if (hoagie.creator._id.toString() !== userId) {
      throw new ForbiddenException('Only the creator can remove collaborators');
    }

    const updatedHoagie = await this.hoagieRepository.removeCollaborator(
      hoagieId,
      collaboratorId,
    );
    if (!updatedHoagie) {
      throw new NotFoundException(
        `Failed to remove collaborator from hoagie with ID "${hoagieId}"`,
      );
    }

    return updatedHoagie;
  }

  async getCollaboratorCount(hoagieId: string): Promise<number> {
    await this.findOne(hoagieId);
    return this.hoagieRepository.getCollaboratorCount(hoagieId);
  }

  async findByCreator(
    creatorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Hoagie>> {
    return this.hoagieRepository.getHoagiesByCreator(creatorId, page, limit);
  }

  async findByCollaborator(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Hoagie>> {
    return this.hoagieRepository.getHoagiesByCollaborator(userId, page, limit);
  }

  async checkPermission(
    hoagieId: string,
    userId: string,
  ): Promise<{ isCreator: boolean; isCollaborator: boolean }> {
    const hoagie = await this.findOne(hoagieId);

    const isCreator = hoagie.creator._id.toString() === userId;
    const isCollaborator = hoagie.collaborators?.some(
      (collaborator) => collaborator.toString() === userId,
    );

    return { isCreator, isCollaborator };
  }
}
