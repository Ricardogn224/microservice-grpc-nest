import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  LoginRequest,
  LoginResponse,
  LoginResponse_STATUS,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './stubs/auth/v1alpha/auth';
import { AUTH_SERVICE_NAME } from './stubs/auth/v1alpha/auth';
import {
  CheckPasswordResponse_STATUS,
  User,
} from './stubs/user/v1alpha/user';
import { createHash } from 'crypto';
import { status as RpcStatus } from '@grpc/grpc-js';
import { Logger } from 'winston';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private rtService: RefreshTokenService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @GrpcMethod(AUTH_SERVICE_NAME)
  async login(req: LoginRequest): Promise<LoginResponse> {
    try {

      const { user, status } = await this.appService.checkPassword(
        req.email,
        req.password,
      );

      if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(req.ip)) {
        throw new RpcException({
          code: RpcStatus.INVALID_ARGUMENT,
          message: `${req.ip} is not a valid ip address`,
        });
      }

      switch (status) {
        case CheckPasswordResponse_STATUS.OK:
          const rt = await this.rtService.createRefreshToken({
            userId: user.id,
            ip: req.ip,
            refreshToken: createHash('md5')
              .update(`${req.ip}-${user.id}-${new Date().toISOString()}`)
              .digest('hex'),
          });
          return {
            refreshToken: rt.refreshToken,
            status: LoginResponse_STATUS.OK,
          };
        case CheckPasswordResponse_STATUS.WRONG_PASSWORD:
          throw new RpcException({
            code: RpcStatus.INVALID_ARGUMENT,
            message: 'wrong password',
          });
        case CheckPasswordResponse_STATUS.INTERNAL:
          throw new RpcException('Something went wrong');
        case CheckPasswordResponse_STATUS.NOT_FOUND:
          throw new RpcException({
            code: RpcStatus.NOT_FOUND,
            message: `user with email ${req.email} not found`,
          });
        default:
          break;
      }
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod(AUTH_SERVICE_NAME)
  async RefreshToken(req: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const rt = await this.rtService.refreshToken({
        refreshToken: req.refreshToken,
      });

      if (!rt)
        throw new RpcException({
          code: RpcStatus.NOT_FOUND,
          message: 'refresh token not found',
        });

      if (rt.revoked)
        throw new RpcException({
          code: RpcStatus.PERMISSION_DENIED,
          message: 'refresh token revoked',
        });

      if (rt.ip !== req.ip)
        throw new RpcException({
          code: RpcStatus.PERMISSION_DENIED,
          message: 'different ip',
        });

      const user = await this.appService.findUser(
        {
          id: rt.userId,
          firstName: undefined,
          lastName: undefined,
          email: undefined,
        },
      );

      if (!user)
        throw new RpcException({
          code: RpcStatus.NOT_FOUND,
          message: 'user not found',
        });

      return {
        refreshToken: undefined,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        code: error?.code || RpcStatus.INTERNAL,
        message: error?.message || 'something went wrong',
      });
    }
  }

}