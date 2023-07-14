// Nom de fichier : grpc.config.ts
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { RDV_V1ALPHA_PACKAGE_NAME } from 'src/stubs/rdv/v1alpha/rdv';
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
export const grpcConfig = addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
        url: '0.0.0.0:6000',
        package: RDV_V1ALPHA_PACKAGE_NAME,
        protoPath: join(__dirname, 'proto/rdv/v1alpha/rdv.proto'),
    },
}) as GrpcOptions;
