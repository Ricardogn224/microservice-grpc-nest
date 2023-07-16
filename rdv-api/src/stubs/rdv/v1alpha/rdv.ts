/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "rdv.v1alpha";

export interface RDV {
  id: string ;
  name: string ;
  idUser: string ;
  participantId: string ;
  createdAt: Timestamp ;
  updatedAt: Timestamp ;
  rdvDate: string ;
  rdvHour: string ;
  idLieu: string ;
  status: string ;
  description: string ;
}

export interface GetRequest {
  id: string ;
  name: string ;
  idUser: string ;
  participantId: string ;
  rdvDate: string ;
  rdvHour: string ;
  idLieu: string ;
  status: string ;
  description: string ;
}

export interface GetResponse {
  rdv: RDV[] ;
}

export interface AddRequest {
  name: string ;
  idUser: string ;
  rdvDate: string ;
  rdvHour: string ;
  idLieu: string ;
  status: string ;
  description: string ;
  participantId: string ;
}

export interface AddResponse {
  rdv: RDV ;
}

export interface UpdateRequest {
  rdv?: RDV ;
}

export interface UpdateResponse {
  rdv?: RDV ;
}

export interface DeleteResponse {
  rdv?: RDV ;
}

export interface DeleteRequest {
  id?: string ;
}

export const RDV_V1ALPHA_PACKAGE_NAME = "rdv.v1alpha";

export interface RdvCRUDServiceClient {
  get(request: GetRequest, metadata?: Metadata): Observable<GetResponse>;

  add(request: AddRequest, metadata?: Metadata): Observable<AddResponse>;

  update(request: UpdateRequest, metadata?: Metadata): Observable<UpdateResponse>;

  delete(request: DeleteRequest, metadata?: Metadata): Observable<DeleteResponse>;
}

export interface RdvCRUDServiceController {
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

export function RdvCRUDServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["get", "add", "update", "delete"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("RdvCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("RdvCRUDService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const RDV_CR_UD_SERVICE_NAME = "RdvCRUDService";
