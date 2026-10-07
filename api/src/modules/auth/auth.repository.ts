import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/helpers/base.repository';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User, UserDocument } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password');
  }

  async findAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password'),
      this.userModel.countDocuments(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password');
  }
}
