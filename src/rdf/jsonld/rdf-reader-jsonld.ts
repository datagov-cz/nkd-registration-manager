import { LanguageString, type Node } from "../rdf-model";
import type { RdfReader, RdfEntityReader } from "../rdf-reader";
import { jsonld } from "./jsonld";
import { hasIntersection } from "../utilities";

class RdfJsonLdReader implements RdfReader {

  readonly resources: object[];

  constructor(resources: object[]) {
    this.resources = resources;
  }

  iri(iri: string | null): RdfEntityReader | null {
    if (iri === null) {
      return null;
    }
    for (const entity of this.resources) {
      if (jsonld.id(entity) === iri) {
        return new RdfJsonLdEntityReader(this, entity);
      }
    }
    return null;
  }

  anyOfType(types: string[]): RdfEntityReader[] {
    return this.resources
      .filter(entity => hasIntersection(jsonld.types(entity), types))
      .map(entity => new RdfJsonLdEntityReader(this, entity));
  }

  entities(): RdfEntityReader[] {
    return this.resources
      .map(resource => new RdfJsonLdEntityReader(this, resource));
  }

}

class RdfJsonLdEntityReader implements RdfEntityReader {

  readonly parent: RdfJsonLdReader;

  readonly entity: object;

  constructor(parent: RdfJsonLdReader, entity: object) {
    this.parent = parent;
    this.entity = entity;
  }

  identifier(): Node {
    const identifier = jsonld.id(this.entity);
    if (identifier === null) {
      return {
        termType: "BlankNode",
        // TODO We may need to generate a uniq identifier here!
        value: "",
      }
    } else {
      return {
        termType: "NamedNode",
        value: identifier,
      }
    }
  }

  firstIri(predicate: string): string | null {
    const value = (this.entity as any)[predicate];
    if (value === null || value === undefined) {
      return null;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        const id = jsonld.id(item);
        if (id === null) {
          continue;
        }
        return id;
      }
      return null;
    } else {
      return jsonld.id(value);
    }
  }

  firstAsString(predicate: string): string | null {

  }

  firstDate(predicate: string): Date | null {
  }

  firstEntity(predicate: string): RdfEntityReader | null {
    // We search for the object in root list.
    const iri = this.firstIri(predicate);
    const result = this.parent.parent.iri(iri);
    if (result !== null) {
      return result;
    }
    // Otherwise we just return the object.
    const value = this.value;
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return null;
      }
      return new RdfJsonLdEntityReader(this.parent.parent, value[0] as any);
    } else {
      return new RdfJsonLdEntityReader(this.parent.parent, value as any);
    }
  }

  languageString(predicate: string): LanguageString {
    const value = this.value;
    if (Array.isArray(value)) {
      for (const item of value) {
        return asLanguageString(item);
      }
      return {};
    } else {
      return asLanguageString(value);
    }

  }

}

/**
 * Create a reader working directly with JSON-LD as a JavaScript object
 * without the need of conversion into RDF statements.
 */
export function createJsonLdReader(payload: unknown): RdfReader {
  if (Array.isArray(payload)) {
    return new RdfJsonLdReader(payload);
  } else {
    return new RdfJsonLdReader([payload as object]);
  }
}
