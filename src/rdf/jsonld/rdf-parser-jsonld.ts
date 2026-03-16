// We use '@types/jsonld' which does not really reflect types,
// but it is better then nothing.
import jsonld from "jsonld";

import type { Node, Term, NamedNode } from "./rdf-model";
import type { Collector } from "./rdf-parser";

interface RdfQuad {

  subject: Node;

  predicate: NamedNode;

  object: Term;

  graph: Node;

}

const documentCache: { [url: string]: any } = {};

const documentLoader = async (url: string) => {
  if (documentCache[url] === undefined) {
    const loader = (jsonld as any).documentLoaders.node();
    // Encode the URL to allow for national characters.
    documentCache[url] = await loader(encodeURI(url));
  }
  return documentCache[url];
}

export async function parseJsonLd<T>(
  document: object | [],
  consumer: Collector<T>,
): Promise<T> {
  const options = {
    documentLoader,
  };
  const rdf = (await jsonld.toRDF(document, options)) as RdfQuad[];
  for (const { subject, predicate, object } of rdf) {
    consumer.consume(subject, predicate.value, object);
  }
  return consumer.result();
}
