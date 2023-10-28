---
to: src/modules/<%= name %>/abstracts/model.abstract.ts
---
import { Document } from 'typeorm';
import { CreateOne<%= h.capitalize(name) %>Entity, UpdateOne<%= h.capitalize(name) %>Body } from '@/modules/<%= name %>/dtos/service';
import { <%= h.capitalize(name) %>Entity } from '@/modules/<%= name %>/entities';

export abstract class ModelAbstract {
  abstract createMany(
    body: Array<CreateOne<%= h.capitalize(name) %>Entity>,
  ): Promise<Array<<%= h.capitalize(name) %>Entity>>;
  abstract getManyByUuid(query: Array<string>): Promise<Array<<%= h.capitalize(name) %>Entity>>;
  abstract updateOneByUuid(
    uuid: string,
    body: UpdateOne<%= h.capitalize(name) %>Body,
  ): Promise<Document>;
  abstract deleteOneByUuid(id: string): Promise<Document>;
}
