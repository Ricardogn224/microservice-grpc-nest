// Nom de fichier : app.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Rdv } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.RdvCreateInput): Promise<Rdv> {
    return this.prisma.rdv.create({ data });
  }

  findAll(): Promise<Rdv[]> {
    return this.prisma.rdv.findMany();
  }

  findById(id: number): Promise<Rdv> {
    return this.prisma.rdv.findUnique({ where: { id } });
  }

  findByName(name: string): Promise<Rdv> {
    return this.prisma.rdv.findFirst({ where: { name } });
  }

  async Rdves(params: { where?: Prisma.RdvWhereInput }): Promise<Rdv[]> {
    const { where } = params;
    return this.prisma.rdv.findMany({
      where,
    });
  }

  async update(params: {
    where: Prisma.RdvWhereUniqueInput;
    data: Prisma.RdvUpdateInput;
  }): Promise<Rdv> {
    const { where, data } = params;
    return this.prisma.rdv.update({
      data,
      where,
    });
  }

  delete(where: Prisma.RdvWhereUniqueInput): Promise<Rdv> {
    return this.prisma.rdv.delete({ where });
  }
}