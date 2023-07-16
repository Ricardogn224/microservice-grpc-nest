/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "user.v1alpha";

export interface User {
  id: string ;
  firstName: string ;
  lastName: string ;
  email: string ;
  createdAt: Timestamp ;
  updatedAt: Timestamp ;
}

export interface GetRequest {
  id: string ;
  firstName: string ;
  lastName: string ;
  email: string ;
}

export interface GetResponse {
  user: User[] ;
}

export interface AddRequest {
  firstName: string ;
  lastName: string ;
  email: string ;
  password: string ;
}

export interface AddResponse {
  user: User ;
}

export interface UpdateRequest {
  user?: User ;
}

export interface UpdateResponse {
  user?: User ;
}

export interface DeleteResponse {
  user?: User ;
}

export interface DeleteRequest {
  id?: string ;
}

export interface CheckPasswordRequest {
  email?: string ;
  password?: string ;
}

export interface CheckPasswordResponse {
  status?: CheckPasswordResponse_STATUS ;
  user?: User ;
}

export enum CheckPasswordResponse_STATUS {
  OK = 0,
  WRONG_PASSWORD = 1,
  NOT_FOUND = 2,
  INTERNAL = 3,
  UNRECOGNIZED = -1,
}

export interface MakeAdminRequest {
  id?: string ;
  email?: string ;
}

export interface MakeAdminResponse {
  user?: User ;
}

export const USER_V1ALPHA_PACKAGE_NAME = "user.v1alpha";

export interface UserCRUDServiceClient {
  get(request: GetRequest, metadata?: Metadata): Observable<GetResponse>;

  add(request: AddRequest, metadata?: Metadata): Observable<AddResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;

  checkPassword(request: CheckPasswordRequest, metadata?: Metadata): Observable<CheckPasswordResponse>;

  makeAdmin(request: MakeAdminRequest, metadata?: Metadata): Observable<MakeAdminResponse>;
}

export interface UserCRUDServiceController {
  get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> | Observable<GetResponse> | GetResponse;

  add(request: AddRequest, metadata?: Metadata): Promise<AddResponse> | Observable<AddResponse> | AddResponse;

  update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> | Observable<UpdateResponse> | UpdateResponse;

  delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> | Observable<DeleteResponse> | DeleteResponse;

  checkPassword(
    request: CheckPasswordRequest,
    metadata?: Metadata,
  ): Promise<CheckPasswordResponse> | Observable<CheckPasswordResponse> | CheckPasswordResponse;

  makeAdmin(
    request: MakeAdminRequest,
    metadata?: Metadata,
  ): Promise<MakeAdminResponse> | Observable<MakeAdminResponse> | MakeAdminResponse;
}

export function UserCRUDServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["get", "add", "update", "delete", "checkPassword", "makeAdmin"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_CR_UD_SERVICE_NAME = "UserCRUDService";
