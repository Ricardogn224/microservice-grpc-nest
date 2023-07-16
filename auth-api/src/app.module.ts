import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { ClientsModule } from '@nestjs/microservices';
import grpcOption, { userGrpcOptions } from './grpc.config';
import { PrismaService } from './prisma.service';
import { USER_V1ALPHA_PACKAGE_NAME } from './stubs/user/v1alpha/user';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { WinstonModule } from 'nest-winston';
import winstonConfig from './winston.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_V1ALPHA_PACKAGE_NAME,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cs: ConfigService) => userGrpcOptions(cs),
      },
    ]),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => winstonConfig(cs),
    }),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => grpcOption(cs),
    }),
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RefreshTokenService],
})
export class AppModule { }