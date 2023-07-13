/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "hero.v1alpha";

export interface Hero {
  id: string;
  name: string;
  power: string;
  hp: string;
}

export interface GetRequest {
  id: string;
  name: string;
  power: string;
  hp: string;
}

export interface GetResponse {
  hero: Hero[];
}

export interface AddRequest {
  name: string;
  power: string;
  hp: string;
}

export interface AddResponse {
  hero: Hero | undefined;
}

export interface UpdateRequest {
  hero: Hero | undefined;
}

export interface UpdateResponse {
  hero: Hero | undefined;
}

export interface DeleteResponse {
  hero: Hero | undefined;
}

export interface DeleteRequest {
  id: string;
}

export const HERO_V1ALPHA_PACKAGE_NAME = "hero.v1alpha";

export interface HeroCRUDServiceClient {
  get(request: GetRequest, metadata?: Metadata): Observable<GetResponse>;

  add(request: AddRequest, metadata?: Metadata): Observable<AddResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;
}

export interface HeroCRUDServiceController {
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
}

export function HeroCRUDServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["get", "add", "update", "delete"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("HeroCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("HeroCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HERO_CR_UD_SERVICE_NAME = "HeroCRUDService";
