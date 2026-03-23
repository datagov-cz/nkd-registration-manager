import type { BlankNode, NamedNode, Term } from "../rdf-model";

/**
 * A single object representation of a resource with all its properties.
 */
export interface Resource {

  identifier: NamedNode | BlankNode;

  properties: { [property: string]: Term[] };

}

export type ResourceByIri = { [iri: string]: Resource };
