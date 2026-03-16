import { RdfReader } from "../../rdf";
import { Dataset, Distribution } from "./dcat-ap-v3-model";

export function loadDcatApDataset(
  reader: RdfReader, iri: string,
): Dataset | null {
  const dataset = reader.iri(iri);
  if (dataset === null) {
    return null;
  }

  return {
    iri,
    accessRights: null,
    applicableLegislation: null,
    conformsTo: [],
    contactPoint: [],
    creator: [],
    datasetDistribution: [],
    description: [],
    documentation: [],
    frequency: null,
    geographicalCoverage: null,
    hasVersion: [],
    identifier: [],
    inSeries: [],
    isReferencedBy: [],
    keyword: [],
    landingPage: [],
    language: [],
    modificationDate: [],
    otherIdentifier: [],
    provenance: [],
    publisher: null,
    qualifiedAttribution: [],
    qualifiedRelation: [],
    relatedResource: [],
    releaseDate: null,
    sample: [],
    source: [],
    spatialResolution: null,
    temporalCoverage: null,
    theme: [],
    title: [],
    type: [],
    version: null,
    versionNotes: [],
    wasGeneratedBy: [],
  };
}

export function loadDcatApDistribution(
  reader: RdfReader, iri: string,
): Distribution | null {
  const distribution = reader.iri(iri);
  if (distribution === null) {
    return null;
  }

  return {
    iri,
    accessService: [],
    accessURL: [],
    applicableLegislation: [],
    availability: null,
    byteSize: null,
    checksum: null,
    compressionFormat: null,
    description: [],
    documentation: [],
    downloadURL: [],
    format: null,
    hasPolicy: null,
    language: [],
    licence: null,
    linkedSchemas: [],
    mediaType: null,
    modificationDate: null,
    packagingFormat: null,
    releaseDate: null,
    rights: null,
    spatialResolution: null,
    status: null,
    temporalResolution: null,
    title: [],
  };
}
