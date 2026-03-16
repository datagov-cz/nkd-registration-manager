import type { Resource, ResourceDictionary } from "./resource-model";
import type { Node } from "../rdf-model";
import type { Collector } from "../rdf-parser";

/**
 * Collect statements into {@link Resource}s.
 */
export function createResourceCollector(): Collector<ResourceDictionary> {
  const resourceMap: { [iri: string]: Resource } = {};
  return {
    consume: function (subject, predicate, object): void {
      if (subject === null || object === null) {
        return;
      }
      const resource = getOrCreateResource(resourceMap, subject);
      let property = resource.properties[predicate];
      if (property === undefined) {
        property = [];
        resource.properties[predicate] = property;
      }
      property.push(object);
    },
    result: function (): ResourceDictionary {
      return resourceMap;
    }
  };
}

function getOrCreateResource(
  resourceMap: { [iri: string]: Resource },
  subject: Node,
): Resource {
  const identifier = subject.value;
  let resource = resourceMap[identifier];
  if (resource === undefined) {
    resource = {
      identifier: subject.termType === "NamedNode" ? {
        termType: "NamedNode",
        value: identifier,
      } : {
        termType: "BlankNode",
        value: identifier,
      },
      "properties": {},
    };
    resourceMap[identifier] = resource;
  }
  return resource;
}
