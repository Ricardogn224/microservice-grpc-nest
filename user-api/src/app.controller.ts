import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  CheckPasswordRequest,
  CheckPasswordResponse,
  MakeAdminRequest,
  MakeAdminResponse,
  USER_CR_UD_SERVICE_NAME,
  User,
  CheckPasswordResponse_STATUS,
  UserCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  UserCRUDServiceControllerMethods,
} from  './stubs/user/v1alpha/user';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@UserCRUDServiceControllerMethods()
export class AppController implements UserCRUDServiceController {
  constructor(private readonly appService: AppService) { }

  private handlePrismaErr(err: Error) {
    console.error(err);
    if (err instanceof RpcException) throw err;
    else throw new RpcException(err);
  }

  @GrpcMethod('UserService')
  async get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> {
    try {
      Object.keys(request).forEach((key) => request[key] === '' && delete request[key]);
      const where = {
        ...request,
        id: request.id ? +request.id : undefined,
      };
      return { user: (await this.appService.users({ where })) as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod('UserService')
  async checkPassword(req: CheckPasswordRequest, metadata?: Metadata): Promise<CheckPasswordResponse> {
    try {
      const { user, match } = await this.appService.checkPassword(
        req.email,
        req.password,
      );

      if (!user) {
        return {
          status: CheckPasswordResponse_STATUS.NOT_FOUND,
          user: undefined,
        };
      }

      if (match) {
        return {
          user: user as any,
          status: CheckPasswordResponse_STATUS.OK,
        };
      }

      return {
        status: CheckPasswordResponse_STATUS.WRONG_PASSWORD,
        user: undefined,
      };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod('UserService')
  async update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> {
    let uptUser = JSON.parse(JSON.stringify(request));
    delete uptUser.user.id;
    const user = await this.appService.update({
      where: {
        id: +request.user.id,
      },
      data: uptUser.user,
    });
    return { user: user as any };
  }

  @GrpcMethod('UserService')
  async delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> {

    const user = await this.appService.delete({
      id: +request.id,
    });

    return { user: user as any };
  }

  @GrpcMethod('UserService')
  async add(request: AddRequest): Promise<AddResponse> {
    try {
      console.log(request);
      const user = await this.appService.create(request);
      
      
      return { user: user as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  @GrpcMethod(USER_CR_UD_SERVICE_NAME, 'MakeAdmin')
  async makeAdmin(request: MakeAdminRequest, metadata?: Metadata): Promise<MakeAdminResponse> {
    try {
      Object.keys(request).forEach((key) => request[key] === '' && delete request[key]);
      const where = {
        ...request,
        id: request.id ? +request.id : undefined,
      };
      return { user: (await this.appService.users({ where })) as any };
    } catch (error) {
      this.handlePrismaErr(error);
    }
  }

  
}
