import { isLiteral, isNamedNode, LanguageString, type Node } from "../rdf-model";
import type { RdfReader, RdfEntityReader } from "../rdf-reader";
import type { Resource, ResourceDictionary } from "./resource-model";

class RdfResourceReader implements RdfReader {

  readonly resources: ResourceDictionary;

  constructor(resources: ResourceDictionary) {
    this.resources = resources;
  }

  iri(iri: string | null): RdfEntityReader | null {
    if (iri === null) {
      return null;
    }
    const resource = this.resources[iri];
    if (resource === undefined) {
      return null;
    }
    return new RdfResourceEntityReader(this, resource)
  }

  anyOfType(types: string[]): RdfEntityReader[] {
    const result: RdfEntityReader[] = [];
    for (const resource of Object.values(this.resources)) {
      const values = resource.properties[RDFS.type] ?? [];
      if (values.find(item => types.includes(item.value)) !== undefined) {
        result.push(new RdfResourceEntityReader(this, resource));
      }
    }
    return result;
  }

  entities(): RdfEntityReader[] {
    return Object.values(this.resources)
      .map(resource => new RdfResourceEntityReader(this, resource));
  }

}

const RDFS = {
  type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
  languageString: "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
};

const XSD = {
  date: "http://www.w3.org/2001/XMLSchema#dateTime",
  string: "http://www.w3.org/2001/XMLSchema#string",
}

class RdfResourceEntityReader implements RdfEntityReader {

  readonly parent: RdfResourceReader;

  readonly resource: Resource;

  constructor(parent: RdfResourceReader, resource: Resource) {
    this.parent = parent;
    this.resource = resource;
  }

  identifier(): Node {
    return this.resource.identifier;
  }

  firstIri(predicate: string): string | null {
    const terms = this.resource.properties[predicate] ?? [];
    for (const term of terms) {
      if (!isNamedNode(term)) {
        continue;
      }
      return term.value;
    }
    return null;
  }

  firstAsString(predicate: string): string | null {
    const terms = this.resource.properties[predicate] ?? [];
    if (terms.length === 0) {
      return null;
    }
    return terms[0].value;
  }

  firstDate(predicate: string): Date | null {
    const terms = this.resource.properties[predicate] ?? [];
    for (const term of terms) {
      if (!isLiteral(term)) {
        continue;
      }
      if (term.datatype.value === XSD.date) {
        return new Date(term.value);
      }
    }
    return null;
  }

  firstEntity(predicate: string): RdfEntityReader | null {
    const terms = this.resource.properties[predicate] ?? [];
    for (const term of terms) {
      if (!isNamedNode(term)) {
        continue;
      }
      const reader = this.parent.iri(term.value);
      if (reader === null) {
        continue;
      }
      return reader;
    }
    return null;
  }

  languageString(predicate: string): LanguageString {
    const terms = this.resource.properties[predicate] ?? [];
    const result: LanguageString = {};
    for (const term of terms) {
      if (!isLiteral(term)) {
        continue;
      }
      let language = term.language ?? "";
      if (term.datatype.value === RDFS.languageString
        || term.datatype.value === XSD.string) {
        result[language] = term.value;
      }
    }
    return result;
  }

}

export function createRdfResourceReader(
  resources: ResourceDictionary,
): RdfReader {
  return new RdfResourceReader(resources);
}
