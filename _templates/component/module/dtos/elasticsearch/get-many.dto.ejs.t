---
to: src/modules/<%= name %>/dtos/elasticsearch/get-many.dto.ts
---
import { <%= h.capitalize(name) %>Entity } from 'src/modules/<%= name %>/entities';

export class GetMany<%= h.capitalize(name) %>sByUuidArguments {
  uuid: string[];
}

export class GetMany<%= h.capitalize(name) %>sByUuidResult {
  metadata: { total: number };
  data: <%= h.capitalize(name) %>Entity[];
}
