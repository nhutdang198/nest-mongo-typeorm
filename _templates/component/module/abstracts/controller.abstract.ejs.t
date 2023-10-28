---
to: src/modules/<%= name %>/abstracts/controller.abstract.ts
---
import {
  CreateMany<%= h.capitalize(name) %>sBody,
  CreateMany<%= h.capitalize(name) %>sResponse,
  DeleteOne<%= h.capitalize(name) %>Param,
  DeleteOne<%= h.capitalize(name) %>Response,
  UpdateOne<%= h.capitalize(name) %>Body,
  UpdateOne<%= h.capitalize(name) %>Param,
  UpdateOne<%= h.capitalize(name) %>Response,
  GetMany<%= h.capitalize(name) %>sByIdQuery,
  GetMany<%= h.capitalize(name) %>sByIdResponse,
} from '@/modules/<%= name %>/dtos/service';

export abstract class ControllerAbstract {
  abstract createMany(
    body: CreateMany<%= h.capitalize(name) %>sBody,
  ): Promise<CreateMany<%= h.capitalize(name) %>sResponse>;

  abstract getManyByUuid(
    query: GetMany<%= h.capitalize(name) %>sByIdQuery,
  ): Promise<GetMany<%= h.capitalize(name) %>sByIdResponse>;

  abstract updateOneByUuid(
    param: UpdateOne<%= h.capitalize(name) %>Param,
    body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<UpdateOne<%= h.capitalize(name) %>Response>;

  abstract deleteOneByUuid(
    param: DeleteOne<%= h.capitalize(name) %>Param,
  ): Promise<DeleteOne<%= h.capitalize(name) %>Response>;
}
