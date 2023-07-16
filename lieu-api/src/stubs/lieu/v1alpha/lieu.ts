/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "lieu.v1alpha";

export interface LIEU {
  id: string ;
  format: string ;
  etablissementPlateforme: string ;
  salleLien: string ;
}

export interface GetRequest {
  id: string ;
  format: string ;
  etablissementPlateforme: string ;
  salleLien: string ;
}

export interface GetResponse {
  lieu: LIEU[] ;
}

export interface AddRequest {
  format: string ;
  etablissementPlateforme: string ;
  salleLien: string ;
}

export interface AddResponse {
  lieu: LIEU ;
}

export interface UpdateRequest {
  lieu?: LIEU ;
}

export interface UpdateResponse {
  lieu?: LIEU ;
}

export interface DeleteResponse {
  lieu?: LIEU ;
}

export interface DeleteRequest {
  id?: string ;
}

export const LIEU_V1ALPHA_PACKAGE_NAME = "lieu.v1alpha";

export interface LieuCRUDServiceClient {
  get(request: GetRequest, metadata?: Metadata): Observable<GetResponse>;

  add(request: AddRequest, metadata?: Metadata): Observable<AddResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;
}

export interface LieuCRUDServiceController {
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

export function LieuCRUDServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["get", "add", "update", "delete"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("LieuCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("LieuCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const LIEU_CR_UD_SERVICE_NAME = "LieuCRUDService";
