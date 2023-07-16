// Nom de fichier : grpc.config.ts
import { ClientProviderOptions, GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { USER_V1ALPHA_PACKAGE_NAME } from './stubs/user/v1alpha/user';
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';


export default (cs: ConfigService) =>
  addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: 'user.v1alpha',
      url: '0.0.0.0:7000',
      loader: {
        includeDirs: [join(__dirname, 'proto')],
      },
      protoPath: [join(__dirname, 'proto/user/v1alpha/user.proto')],
    },
  } as GrpcOptions);

  export const authGrpcOptions = (cs: ConfigService): ClientProviderOptions => ({
    name: 'auth',
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:8000',
      package: 'auth.v1alpha',
      loader: {
        includeDirs: [join(__dirname, 'proto')],
      },
      protoPath: [join(__dirname, 'proto/auth/v1alpha/auth.proto')],
      keepalive: {
        // Send keepalive pings every 10 seconds, default is 2 hours.
        keepaliveTimeMs: 10 * 1000,
        // Keepalive ping timeout after 5 seconds, default is 20 seconds.
        keepaliveTimeoutMs: 5 * 1000,
        // Allow keepalive pings when there are no gRPC calls.
        keepalivePermitWithoutCalls: 1,
      },
    },
  });
