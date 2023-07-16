// Nom de fichier : main.ts
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import grpcOption from './grpc.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  const cs = app.get(ConfigService);
  app.connectMicroservice(grpcOption(cs));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.startAllMicroservices();

  (async () => {
    logger.log(
      `${cs.get('npm_package_name')}:${cs.get(
        'npm_package_version',
      )} Listening  on port 8000`,
    );
    logger.log('Server started at ' + new Date());
  })();
}
bootstrap();
