// Filename : grpc.config.ts
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { LIEU_V1ALPHA_PACKAGE_NAME } from './stubs/lieu/v1alpha/lieu';
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:5005',
    package: LIEU_V1ALPHA_PACKAGE_NAME,
    protoPath: join(__dirname, 'proto/lieu/v1alpha/lieu.proto'),
  },
}) as GrpcOptions;