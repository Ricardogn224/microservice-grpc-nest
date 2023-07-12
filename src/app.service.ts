// Nom de fichier : app.service.ts
import { Injectable } from '@nestjs/common';
import { Hero } from './stubs/hero';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

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

  async update(id: number, data: Prisma.HeroUpdateInput): Promise<Hero> {
    await this.prisma.hero.update({ where: { id }, data });
    return this.prisma.hero.findUnique({ where: { id } });
  }

  delete(id: number): Promise<Hero> {
    return this.prisma.hero.delete({ where: { id } });
  }
}
