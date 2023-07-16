// Nom de fichier : prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Timestamp } from './stubs/google/protobuf/timestamp';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }

    private toTimestamp(date: Date): Timestamp {
        const timeMS = date.getTime();
        return {
          seconds: timeMS / 1000,
          nanos: (timeMS % 1000) * 1e6,
        };
      }
}
