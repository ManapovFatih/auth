import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UsersService } from '../user/users.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const candidate = await this.usersService.findUserByName(
      createUserDto.username,
    );
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersService.createUser(createUserDto);
    return this.login(user);
  }
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const { password, ...result } = user;
        return user;
      }
      throw new BadRequestException('Неверный пароль');
    }
    throw new BadRequestException('Неверный логин');
  }
  async login(user: User): Promise<{ user: User; token: string }> {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }
}
