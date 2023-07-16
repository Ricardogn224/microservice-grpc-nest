import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  RDV_CR_UD_SERVICE_NAME,
  RdvCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  RdvCRUDServiceControllerMethods,
} from './stubs/rdv/v1alpha/rdv';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@RdvCRUDServiceControllerMethods()
export class AppController implements RdvCRUDServiceController {
  constructor(private readonly appService: AppService) { }

  private handlePrismaErr(err: Error) {
    console.error(err);
    if (err instanceof RpcException) throw err;
    else throw new RpcException(err);
  }

  @GrpcMethod(RDV_CR_UD_SERVICE_NAME, 'Get')
  async get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> {
    try {
      Object.keys(request).forEach(
        (key) => request[key] === '' && delete request[key],
      );
      const where = {
        ...request,
        id: request.id ? +request.id : undefined,
      };
      return { rdv: (await this.appService.Rdves({ where })) as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod(RDV_CR_UD_SERVICE_NAME, 'Update')
  async update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> {
    const uptRdv = JSON.parse(JSON.stringify(request));
    delete uptRdv.rdv.id;
    const rdv = await this.appService.update({
      where: {
        id: +request.rdv.id,
      },
      data: uptRdv.rdv,
    });
    return { rdv: rdv as any };
  }

  @GrpcMethod(RDV_CR_UD_SERVICE_NAME, 'Delete')
  async delete(
    request: DeleteRequest,
    _metadata?: Metadata,
  ): Promise<DeleteResponse> {
    const rdv = await this.appService.delete({
      id: +request.id,
    });

    return { rdv: rdv as any };
  }

  @GrpcMethod(RDV_CR_UD_SERVICE_NAME, 'Add')
  async add(request: AddRequest): Promise<AddResponse> {
    try {
      console.log(request);
      const rdv = await this.appService.create(request);
      return { rdv: rdv as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }
}