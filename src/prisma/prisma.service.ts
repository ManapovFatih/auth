import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaService {
  constructor() {}

  user = prisma.user;
  $connect() {
    return prisma.$connect();
  }

  $disconnect() {
    return prisma.$disconnect();
  }
}