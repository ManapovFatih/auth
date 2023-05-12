import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, PassportModule, AuthModule]
})
export class AppModule {}
