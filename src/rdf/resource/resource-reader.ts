import { Resource, ResourceByIri } from "./resource-model";
import { Node } from "../rdf-model";

export function createResourceReader(
  record: ResourceByIri,
): ResourceReader {
  return new DefaultResourceReader(record);
}

export interface ResourceReader {

  firstOfType(type: string): SubjectReader | null;

}

export interface SubjectReader {

  identifier(): Node;

  value(predicate: string): string | null;

  date(predicate: string): Date | null;

  languageString(predicate: string): LanguageString | null;

}

type LanguageString = { [language: string]: string };

const RDFS = {
  type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
};

class DefaultResourceReader implements ResourceReader {

  private readonly resources: ResourceByIri;

  constructor(record: ResourceByIri) {
    this.resources = record;
  }

  firstOfType(type: string) {
    for (const resource of Object.values(this.resources)) {
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

  languageString(predicate: string): LanguageString | null {
    const values = this.resource.properties[predicate];
    const result : LanguageString = {};
    for (const value of values) {
      if ( value.termType !== "Literal") {
        continue;
      }
      result[value.language ?? ""] = value.value;
    }
    if (Object.keys(result).length === 0 ) {
      return null;
    }
    return result;
  }

}
