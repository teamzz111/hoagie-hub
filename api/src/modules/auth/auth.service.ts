import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../users/user.service';
import { UserDocument } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user as UserDocument);
  }

  async signup(signupDto: SignupDto) {
    const user = await this.userService.create(signupDto);
    return this.generateToken(user as UserDocument);
  }

  private generateToken(user: UserDocument) {
    const id = user._id.toString();
    const payload = {
      sub: id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async validateUser(payload: { sub: string }) {
    return this.userService.findOne(payload.sub);
  }
}
