import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from 'src/common/helpers/base.repository';
import { CommentDocument, Comment } from './entities/comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentRepository extends BaseRepository<CommentDocument> {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {
    super(commentModel);
  }

  async createComment(createCommentDto: CreateCommentDto, userId: string) {
    const newComment = new this.commentModel({
      ...createCommentDto,
      user: new Types.ObjectId(userId),
      hoagie: new Types.ObjectId(createCommentDto.hoagie),
    });

    return newComment.save();
  }

  async findByHoagie(hoagieId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.commentModel.aggregate([
        { $match: { hoagie: new Types.ObjectId(hoagieId) } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        { $unwind: '$userDetails' },
        {
          $project: {
            _id: 1,
            text: 1,
            createdAt: 1,
            user: {
              _id: '$userDetails._id',
              name: '$userDetails.name',
            },
          },
        },
      ]),
      this.commentModel.countDocuments({
        hoagie: new Types.ObjectId(hoagieId),
      }),
    ]);

    return {
      data: comments,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async countByHoagie(hoagieId: string): Promise<number> {
    return this.commentModel.countDocuments({
      hoagie: new Types.ObjectId(hoagieId),
    });
  }
}
