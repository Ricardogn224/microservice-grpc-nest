// Nom de fichier : grpc.config.ts
import { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { readFileSync } from 'fs';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';
import { AUTH_V1ALPHA_PACKAGE_NAME } from 'src/stubs/auth/v1alpha/auth';
import { USER_V1ALPHA_PACKAGE_NAME } from 'src/stubs/user/v1alpha/user';

export default (cs: ConfigService): GrpcOptions => {
  return addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
        url: '0.0.0.0:8000',
        package: AUTH_V1ALPHA_PACKAGE_NAME,
        protoPath: join(__dirname, 'proto/auth/v1alpha/auth.proto'),
    },
  });
};

export const userGrpcOptions = (cs: ConfigService): ClientProviderOptions => ({
  name: USER_V1ALPHA_PACKAGE_NAME,
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:7000',
    package: USER_V1ALPHA_PACKAGE_NAME,
    loader: {
      includeDirs: [join(__dirname, 'proto')],
    },
    protoPath: [join(__dirname, 'proto/user/v1alpha/user.proto')],
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
