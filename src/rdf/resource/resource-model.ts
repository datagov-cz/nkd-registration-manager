import type { BlankNode, NamedNode, Term } from "../rdf-model";

/**
 * Resource model is focused around RDF resources.
 */
export interface Resource {

  identifier: NamedNode | BlankNode;

  properties: { [property: string]: Term[] };

}

export type ResourceDictionary = { [iri: string]: Resource };
