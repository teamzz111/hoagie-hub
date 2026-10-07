import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hoagie, HoagieDocument } from './entities/hoagies.entity';
import { CreateHoagieDto } from './dto/create-hoagie.dto';
import {
  PaginationHelper,
  PaginationResult,
} from 'src/common/helpers/pagination.helper';
import { BaseRepository } from 'src/common/helpers/base.repository';

@Injectable()
export class HoagieRepository extends BaseRepository<HoagieDocument> {
  constructor(
    @InjectModel(Hoagie.name)
    private readonly hoagieModel: Model<HoagieDocument>,
  ) {
    super(hoagieModel);
  }

  async createHoagie(dto: CreateHoagieDto, creatorId: string): Promise<Hoagie> {
    const hoagie = new this.hoagieModel({
      ...dto,
      creator: new Types.ObjectId(creatorId),
    });
    return hoagie.save();
  }

  async getPaginatedHoagies(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Hoagie>> {
    const pipeline = [
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creatorDetails',
        },
      },
      { $unwind: '$creatorDetails' },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'hoagie',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
          creator: {
            _id: '$creatorDetails._id',
            name: '$creatorDetails.name',
            email: '$creatorDetails.email',
          },
        },
      },
      {
        $project: {
          comments: 0,
          creatorDetails: 0,
        },
      },
    ];

    return PaginationHelper.paginateAggregate(
      this.hoagieModel,
      pipeline,
      [],
      page,
      limit,
    );
  }

  async getHoagieWithDetails(id: string): Promise<Hoagie | null> {
    const [hoagie] = await this.hoagieModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creatorDetails',
        },
      },
      { $unwind: '$creatorDetails' },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'hoagie',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
          creator: {
            _id: '$creatorDetails._id',
            name: '$creatorDetails.name',
            email: '$creatorDetails.email',
          },
        },
      },
      {
        $project: {
          comments: 0,
          creatorDetails: 0,
        },
      },
    ]);

    return hoagie || null;
  }

  async getHoagiesByCreator(
    creatorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Hoagie>> {
    const pipeline = [
      { $match: { creator: new Types.ObjectId(creatorId) } },
      { $sort: { createdAt: -1 } },
    ];

    const countPipeline = [
      { $match: { creator: new Types.ObjectId(creatorId) } },
    ];

    return PaginationHelper.paginateAggregate(
      this.hoagieModel,
      pipeline,
      countPipeline,
      page,
      limit,
    );
  }

  async getHoagiesByCollaborator(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Hoagie>> {
    const pipeline = [
      { $match: { collaborators: new Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creatorDetails',
        },
      },
      { $unwind: '$creatorDetails' },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'hoagie',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
          creator: {
            _id: '$creatorDetails._id',
            name: '$creatorDetails.name',
            email: '$creatorDetails.email',
          },
        },
      },
      {
        $project: {
          comments: 0,
          creatorDetails: 0,
        },
      },
    ];

    const countPipeline = [
      { $match: { collaborators: new Types.ObjectId(userId) } },
    ];

    return PaginationHelper.paginateAggregate(
      this.hoagieModel,
      pipeline,
      countPipeline,
      page,
      limit,
    );
  }

  async getCollaboratorCount(hoagieId: string) {
    const [result] = await this.hoagieModel.aggregate([
      { $match: { _id: new Types.ObjectId(hoagieId) } },
      {
        $project: {
          collaboratorCount: { $size: '$collaborators' },
        },
      },
    ]);

    return result?.collaboratorCount || 0;
  }

  async removeCollaborator(hoagieId: string, userId: string) {
    return this.hoagieModel.findByIdAndUpdate(
      hoagieId,
      { $pull: { collaborators: userId } },
      { new: true },
    );
  }

  async addCollaborator(hoagieId: string, userId: string) {
    return this.hoagieModel.findByIdAndUpdate(
      hoagieId,
      { $addToSet: { collaborators: userId } },
      { new: true },
    );
  }
}
