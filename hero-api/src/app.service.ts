// Nom de fichier : app.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Hero } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  create(data: Prisma.HeroCreateInput): Promise<Hero> {
    return this.prisma.hero.create({ data, });
  }

  findAll(): Promise<Hero[]> {
    return this.prisma.hero.findMany();
  }

  findById(id: number): Promise<Hero> {
    return this.prisma.hero.findUnique({ where: { id } });
  }

  findByName(name: string): Promise<Hero> {
    return this.prisma.hero.findFirst({ where: { name } });
  }

  async heroes(params: {
    where?: Prisma.HeroWhereInput;
  }): Promise<Hero[]> {
    const {where} = params;
    return this.prisma.hero.findMany({
      where,
    });
  }

  async update(params: {
    where: Prisma.HeroWhereUniqueInput;
    data: Prisma.HeroUpdateInput;
  }): Promise<Hero> {
      const { where, data } = params;
      return this.prisma.hero.update({
        data,
        where,
      });
  }

  delete(where: Prisma.HeroWhereUniqueInput): Promise<Hero> {
    return this.prisma.hero.delete({ where, });
  }
}
