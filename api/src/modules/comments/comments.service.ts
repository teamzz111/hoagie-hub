import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from './comments.repository';
import { UserService } from '../users/user.service';
import { CommentWithUser } from './dto/comment-user.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentWithUser> {
    const result = await this.commentRepository.createComment(
      createCommentDto,
      userId,
    );

    const user = await this.userRepository.findOne(userId);

    return {
      ...result.toObject(),
      user: {
        name: user.name,
      },
    } as unknown as CommentWithUser;
  }

  async findByHoagie(hoagieId: string, page: number = 1, limit: number = 10) {
    const comments = await this.commentRepository.countByHoagie(hoagieId);
    const data = await this.commentRepository.findByHoagie(
      hoagieId,
      page,
      limit,
    );

    return {
      ...data,
      comments: comments,
    };
  }

  async countByHoagie(hoagieId: string): Promise<number> {
    return this.commentRepository.countByHoagie(hoagieId);
  }
}
