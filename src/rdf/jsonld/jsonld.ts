import { LanguageString } from "../rdf-model";

/**
 * Collection of function for working with JSON-LD objects.
 */
export const jsonld = {
  id: getId,
  types: getTypes,
  asLanguageString,
  asString,
};

function getId(entity: object): string | null {
  if ("@id" in entity) {
    return String(entity["@id"]) ?? null;
  }
  return null;
}

function getTypes(entity: object): string[] {
  if (!("@type" in entity)) {
    return [];
  }
  const types = entity["@type"];
  if (types === undefined || types === null) {
    return []
  } else if (Array.isArray(types)) {
    return types;
  } else {
    return [String(types)];
  }
}

function asLanguageString(value: object | null): LanguageString {
  if (value === null) {
    return {};
  }
  if (typeof value === "string") {
    // This is a primitive value.
    return { "": value };
  }
  if ("@value" in value) {
    if ("@language" in value) {
      return { [value["@language"] as string]: value["@value"] as string };
    } else {
      return { "": value["@value"] as string };
    }
  }
  return {};
}

function asString(value: object): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === "object") {
    if ("@id" in value) {
      return String(value["@id"]);
    } else if ("@value" in value) {
      return String(value["@value"]);
    }
  }
  return String(value);
}
