import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentService } from './comments.service';
import { CommentRepository } from './comments.repository';
import { CommentSchema, Comment } from './entities/comments.entity';
import { UserRepository } from '../auth/auth.repository';
import { UserService } from '../users/user.service';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentService, CommentRepository, UserRepository, UserService],
  exports: [CommentService],
})
export class CommentsModule {}
