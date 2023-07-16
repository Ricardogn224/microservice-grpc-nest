import { OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CheckPasswordResponse,
  GetRequest,
  GetResponse,
  User,
} from './stubs/user/v1alpha/user';
import {
  USER_CR_UD_SERVICE_NAME,
  USER_V1ALPHA_PACKAGE_NAME,
  UserCRUDServiceClient,
} from './stubs/user/v1alpha/user';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class AppService implements OnModuleInit {
  private userService: UserCRUDServiceClient;

  constructor(@Inject(USER_V1ALPHA_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserCRUDServiceClient>(USER_CR_UD_SERVICE_NAME);
  }

  async checkPassword(
    email: string,
    password: string,
  ): Promise<CheckPasswordResponse> {
    const res: CheckPasswordResponse = await firstValueFrom(
      this.userService.checkPassword({ email, password }) as any,
    );

    return res;
  }

  async findUser(req: GetRequest): Promise<User> {
    const meta = new Metadata();
    const res: GetResponse = await firstValueFrom(
      this.userService.get(req, ) as any,
    );

    return res.user?.[0];
  }
}