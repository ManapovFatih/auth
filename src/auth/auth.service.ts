import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user){

      if(user.password == password) {
          const { password, ...result } = user;
          return user;
      }
      throw new BadRequestException("Неверный пароль");
    }
    throw new BadRequestException("Неверный логин");
  }
  async login(user: User): Promise<{ user: User, token: string }> {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { user, token };
  }
}
