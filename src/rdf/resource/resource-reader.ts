import { Resource, ResourceDictionary } from "./resource-model";
import { Node } from "../rdf-model";

export interface ResourceReader {

  firstOfType(type: string): SubjectReader | null;

}

export interface SubjectReader {

  identifier(): Node;

  value(predicate: string): string | null;

  date(predicate: string): Date | null;

}

const RDFS = {
  type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
};

class DefaultResourceReader implements ResourceReader {

  private readonly record: ResourceDictionary;

  constructor(record: ResourceDictionary) {
    this.record = record;
  }

  firstOfType(type: string) {
    for (const resource of Object.values(this.record)) {
      const types = resource.properties[RDFS.type] ?? [];
      if (types.find(item => item.value === type) !== undefined) {
        return new DefaultSubjectReader(resource);
      }
    }
    return null;
  }

}

class DefaultSubjectReader implements SubjectReader {

  readonly resource: Resource;

  constructor(resource: Resource) {
    this.resource = resource;
  }

  identifier(): Node {
    return this.resource.identifier;
  }

  value(predicate: string) {
    const values = this.resource.properties[predicate];
    return values?.[0].value ?? null;
  }

  date(predicate: string): Date | null {
    const value = this.value(predicate);
    if (value === null) {
      return null;
    }
    return new Date(value);
  }

}

export function createResourceReader(
  record: ResourceDictionary,
): ResourceReader {
  return new DefaultResourceReader(record);
}
