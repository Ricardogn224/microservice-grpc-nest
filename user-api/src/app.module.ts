import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import grpcOption, { authGrpcOptions } from './grpc.config';
import { PrismaService } from './prisma.service';
@Module({
  imports: [
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }