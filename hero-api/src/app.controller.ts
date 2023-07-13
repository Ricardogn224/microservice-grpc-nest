import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  HERO_CR_UD_SERVICE_NAME,
  Hero,
  HeroCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  HeroCRUDServiceControllerMethods,
} from './stubs/hero';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@HeroCRUDServiceControllerMethods()
export class AppController implements HeroCRUDServiceController {
  constructor(private readonly appService: AppService) { }

  private handlePrismaErr(err: Error) {
    console.error(err);
    if (err instanceof RpcException) throw err;
    else throw new RpcException(err);
  }

  @GrpcMethod(HERO_CR_UD_SERVICE_NAME, 'Get')
  async get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> {
    try {
      Object.keys(request).forEach((key) => request[key] === '' && delete request[key]);
      const where = {
        ...request,
        id: request.id ? +request.id : undefined,
      };
      return { hero: (await this.appService.heroes({ where })) as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod(HERO_CR_UD_SERVICE_NAME, 'Update')
  async update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> {
    let uptHero = JSON.parse(JSON.stringify(request));
    delete uptHero.hero.id;
    const hero = await this.appService.update({
      where: {
        id: +request.hero.id,
      },
      data: uptHero.hero,
    });
    return { hero: hero as any };
  }

  @GrpcMethod(HERO_CR_UD_SERVICE_NAME, 'Delete')
  async delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> {

    const hero = await this.appService.delete({
      id: +request.id,
    });

    return { hero: hero as any };
  }

  @GrpcMethod(HERO_CR_UD_SERVICE_NAME, 'Add')
  async add(request: AddRequest): Promise<AddResponse> {
    try {
      console.log(request);
      const hero = await this.appService.create(request);
      
      
      return { hero: hero as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }
}
