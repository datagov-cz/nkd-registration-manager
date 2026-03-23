// RDF basic primitives
export * from "./rdf-model";

// RDF parsers
export {
  type RdfCollector as Collector,
  collectToArray,
} from "./rdf-reader";
export {
  createJsonLdReader,
} from "./jsonld/rdf-parser-jsonld";
export {
  createStringN3RdfReader,
  createStreamN3RdfReader,
} from "./n3/rdf-parser-n3";

// RDF Writers
export {
  createStringN3RdfWriter,
} from "./n3/rdf-writer-n3";

// RDF readers
export {
  type Resource,
  type ResourceByIri,
} from "./resource/resource-model";
export {
  type ResourceReader,
  type SubjectReader,
  createResourceReader,
} from "./resource/resource-reader";
export { createResourceCollector } from "./resource/resource-collector";

// RDF builder
export {
  type RdfBuilder,
  createStatementRdfBuilder,
} from "./rdf-builder";
