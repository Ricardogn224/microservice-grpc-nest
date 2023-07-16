// Nom de fichier : app.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, User } from '@prisma/client';


@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data, });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async users(params: {
    where?: Prisma.UserWhereInput;
  }): Promise<User[]> {
    const {where} = params;
    return this.prisma.user.findMany({
      where,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
      const { where, data } = params;
      return this.prisma.user.update({
        data,
        where,
      });
  }

  delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where, });
  }

  async checkPassword(
    email: string,
    password: string,
  ): Promise<{ user: User; match: boolean }> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        updatedAt: true,
        password: true,
      },
    });

    if (!user) {
      return { user: null, match: false };
    }

    const match = password === user.password;

    return { user, match };
  }
}
