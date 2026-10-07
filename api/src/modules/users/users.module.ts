import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserService } from './user.service';
import { UserRepository } from '../auth/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
