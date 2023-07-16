// Nom de fichier : app.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Lieu } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.LieuCreateInput): Promise<Lieu> {
    return this.prisma.lieu.create({ data });
  }

  findAll(): Promise<Lieu[]> {
    return this.prisma.lieu.findMany();
  }

  findById(id: number): Promise<Lieu> {
    return this.prisma.lieu.findUnique({ where: { id } });
  }

  findByFormat(format: string): Promise<Lieu> {
    return this.prisma.lieu.findFirst({ where: { format } });
  }

  async Lieus(params: { where?: Prisma.LieuWhereInput }): Promise<Lieu[]> {
    const { where } = params;
    return this.prisma.lieu.findMany({
      where,
    });
  }

  async update(params: {
    where: Prisma.LieuWhereUniqueInput;
    data: Prisma.LieuUpdateInput;
  }): Promise<Lieu> {
    const { where, data } = params;
    return this.prisma.lieu.update({
      data,
      where,
    });
  }

  delete(where: Prisma.LieuWhereUniqueInput): Promise<Lieu> {
    return this.prisma.lieu.delete({ where });
  }
}