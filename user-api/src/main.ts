import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import grpcOption from './grpc.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cs = app.get(ConfigService);
  app.connectMicroservice(grpcOption(cs));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.startAllMicroservices();

}
bootstrap();
