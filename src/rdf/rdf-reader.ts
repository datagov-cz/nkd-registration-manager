import { Node, LanguageString } from "./rdf-model";

export interface RdfReader {

  iri: (iri: string | null) => RdfEntityReader | null;

  /**
   * @returns List of entities with at least one of the given types.
   */
  anyOfType: (types: string[]) => RdfEntityReader[];

  entities: () => RdfEntityReader[];

}

export interface RdfEntityReader {

  identifier: () => Node;

  firstIri: (predicate: string) => string | null;

  firstAsString: (predicate: string) => string | null;

  firstDate: (predicate: string) => Date | null;

  firstEntity(predicate: string): RdfEntityReader | null;

  /**
   * @returns Aggregation of language strings into a single object.
   */
  languageString: (predicate: string) => LanguageString;

}
