import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  create(email: string, password: string, role: UserRole = UserRole.USER) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        role,
      },
    });
  }
}