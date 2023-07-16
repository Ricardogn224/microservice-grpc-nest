import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  LIEU_CR_UD_SERVICE_NAME,
  LIEU,
  LieuCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  LieuCRUDServiceControllerMethods,
} from './stubs/lieu/v1alpha/lieu';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@LieuCRUDServiceControllerMethods()
export class AppController implements LieuCRUDServiceController {
  constructor(private readonly appService: AppService) { }

  private handlePrismaErr(err: Error) {
    console.error(err);
    if (err instanceof RpcException) throw err;
    else throw new RpcException(err);
  }

  @GrpcMethod(LIEU_CR_UD_SERVICE_NAME, 'Get')
  async get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> {
    try {
      Object.keys(request).forEach(
        (key) => request[key] === '' && delete request[key],
      );
      const where = {
        ...request,
        id: request.id ? +request.id : undefined,
      };
      return { lieu: (await this.appService.Lieus({ where })) as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod(LIEU_CR_UD_SERVICE_NAME, 'Update')
  async update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> {
    const uptlieu = JSON.parse(JSON.stringify(request));
    delete uptlieu.lieu.id;
    const lieu = await this.appService.update({
      where: {
        id: +request.lieu.id,
      },
      data: uptlieu.rdv,
    });
    return { lieu: lieu as any };
  }

  @GrpcMethod(LIEU_CR_UD_SERVICE_NAME, 'Delete')
  async delete(
    request: DeleteRequest,
    _metadata?: Metadata,
  ): Promise<DeleteResponse> {
    const lieu = await this.appService.delete({
      id: +request.id,
    });

    return { lieu: lieu as any };
  }

  @GrpcMethod(LIEU_CR_UD_SERVICE_NAME, 'Add')
  async add(request: AddRequest): Promise<AddResponse> {
    try {
      console.log(request);
      const lieu = await this.appService.create(request);
      return { lieu: lieu as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }
}