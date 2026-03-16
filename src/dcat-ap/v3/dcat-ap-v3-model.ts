
type Literal = string | number | { [language: string]: string };

/**
 * @lc-resource http://xmlns.com/foaf/0.1/Agent
 */
export interface Agent {

  /**
   * @lc-property http://xmlns.com/foaf/0.1/name
   */
  name: Literal[];

  /**
   * @lc-property http://purl.org/dc/terms/type
   */
  type: Concept | null;

}

/**
 * @lc-resource http://www.w3.org/ns/dcat#Catalog
 */
export interface Catalogue {

  iri: string | null;

  /**
   * @lc-property http://data.europa.eu/r5r/applicableLegislation
   */
  applicableLegislation: Legal | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#catalog
   */
  catalogue: Catalogue | null;

  /**
   * @lc-property http://purl.org/dc/terms/creator
   */
  creator: Agent | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#dataset
   */
  dataset: Dataset[];

  /**
   * @lc-property http://purl.org/dc/terms/description
   */
  description: Literal[];

  /**
   * @lc-property http://purl.org/dc/terms/spatial
   */
  geographicalCoverage: Location | null;

  /**
   * @lc-property http://purl.org/dc/terms/hasPart
   */
  hasPart: Catalogue | null;

  /**
   * @lc-property http://xmlns.com/foaf/0.1/homepage
   */
  homepage: Document | null;

  /**
   * @lc-property http://purl.org/dc/terms/language
   */
  language: LinguisticSystem[];

  /**
   * @lc-property http://purl.org/dc/terms/license
   */
  licence: LicenceDocument | null;

  /**
   * @lc-property http://purl.org/dc/terms/modified
   */
  modificationDate: TemporalLiteral | null;

  /**
   * @lc-property http://purl.org/dc/terms/publisher
   */
  publisher: Agent;

  /**
   * @lc-property http://www.w3.org/ns/dcat#record
   */
  record: CatalogueRecord | null;

  /**
   * @lc-property http://purl.org/dc/terms/issued
   */
  releaseDate: TemporalLiteral | null;

  /**
   * @lc-property http://purl.org/dc/terms/rights
   */
  rights: RightsStatement | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#service
   */
  service: DataService[];

  /**
   * I@lc-property http://purl.org/dc/terms/temporal
   */
  temporalCoverage: PeriodOfTime[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#themeTaxonomy
   */
  themes: ConceptScheme[];

  /**
   * @lc-property http://purl.org/dc/terms/title
   */
  title: Literal;

}

/**
 * @lc-resource http://xmlns.com/foaf/0.1/Document
 */
export interface Document {

}

export interface Legal {

}

/**
 * @lc-resource http://www.w3.org/ns/dcat#Dataset
 */
export interface Dataset extends CataloguedResource {

  iri: string | null;

  /**
   * @lc-property http://purl.org/dc/terms/accessRights
   */
  accessRights: RightsStatement | null;

  /**
   * @lc-property http://data.europa.eu/r5r/applicableLegislation
   */
  applicableLegislation: LegalResource | null;

  /**
   * @lc-property http://purl.org/dc/terms/conformsTo
   */
  conformsTo: Standard[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#contactPoint
   */
  contactPoint: Kind[];

  /**
   * @lc-property http://purl.org/dc/terms/creator
   */
  creator: Agent[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#distribution
   */
  datasetDistribution: Distribution[];

  /**
   * @lc-property http://purl.org/dc/terms/description
   */
  description: Literal[];

  /**
   * @lc-property http://xmlns.com/foaf/0.1/page
   */
  documentation: Document[];

  /**
   * @lc-property http://purl.org/dc/terms/accrualPeriodicity
   */
  frequency: Frequency | null;

  /**
   * @lc-property http://purl.org/dc/terms/spatial
   */
  geographicalCoverage: Location | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#hasVersion
   */
  hasVersion: Dataset[];

  /**
   * @lc-property http://purl.org/dc/terms/identifier
   */
  identifier: Literal[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#inSeries
   */
  inSeries: DataSeries[];

  /**
   * @lc-property http://purl.org/dc/terms/isReferencedBy
   */
  isReferencedBy: Resource[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#keyword
   */
  keyword: Literal[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#landingPage
   */
  landingPage: Document[];

  /**
   * @lc-property http://purl.org/dc/terms/language
   */
  language: LinguisticSystem[];

  /**
   * @lc-property http://purl.org/dc/terms/modified
   */
  modificationDate: TemporalLiteral[];

  /**
   * @lc-property http://www.w3.org/ns/adms#identifier
   */
  otherIdentifier: Identifier[];

  /**
   * @lc-property http://purl.org/dc/terms/provenance
   */
  provenance: ProvenanceStatement[];

  /**
   * @lc-property http://purl.org/dc/terms/publisher
   */
  publisher: Agent | null;

  /**
   * @lc-property http://www.w3.org/ns/prov#qualifiedAttribution
   */
  qualifiedAttribution: Attribution[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#qualifiedRelation
   */
  qualifiedRelation: Relationship[];

  /**
   * @lc-property http://purl.org/dc/terms/relation
   */
  relatedResource: Resource[];

  /**
   * @lc-property http://purl.org/dc/terms/issued
   */
  releaseDate: TemporalLiteral | null;

  /**
   * @lc-property http://www.w3.org/ns/adms#sample
   */
  sample: Distribution[];

  /**
   * @lc-property http://purl.org/dc/terms/source
   */
  source: Dataset[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#spatialResolutionInMeters
   */
  spatialResolution: number | null;

  /**
   * @lc-property http://purl.org/dc/terms/temporal
   */
  temporalCoverage: PeriodOfTime | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#theme
   */
  theme: Concept[];

  /**
   * @lc-property http://purl.org/dc/terms/title
   */
  title: Literal;

  /**
   * @lc-property http://purl.org/dc/terms/type
   */
  type: Concept[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#version
   */
  version: Literal | null;

  /**
   * @lc-property http://www.w3.org/ns/adms#versionNotes
   */
  versionNotes: Literal[];

  /**
   * @lc-property http://www.w3.org/ns/prov#wasGeneratedBy
   */
  wasGeneratedBy: Activity[];

}

/**
 * @lc-resource http://www.w3.org/ns/dcat#DatasetSeries
 */
export interface DatasetSeries extends CataloguedResource {

  /**
   * @lc-property http://data.europa.eu/r5r/applicableLegislation
   */
  applicableLegislation: LegalResource[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#contactPoint
   */
  contactPoint: Kind[];

  /**
   * @lc-property http://purl.org/dc/terms/description
   */
  description: Literal[];

  /**
   * @lc-property http://purl.org/dc/terms/accrualPeriodicity
   */
  frequency: Frequency[];

  /**
   * @lc-property http://purl.org/dc/terms/spatial
   */
  geographicalCoverage: Location[];

  /**
   * @lc-property http://purl.org/dc/terms/modified
   */
  modificationDate: TemporalLiteral | null;

  /**
   * @lc-property http://purl.org/dc/terms/publisher
   */
  publisher: Agent | null;

  /**
   * @lc-property http://purl.org/dc/terms/issued
   */
  releaseDate: TemporalLiteral | null;

  /**
   * @lc-property http://purl.org/dc/terms/temporal
   */
  temporalCoverage: PeriodOfTime[];

  /**
   * @lc-property http://purl.org/dc/terms/title
   */
  title: Literal;

}

/**
 * @lc-resource http://www.w3.org/ns/prov#Activity
 */
export interface Activity {

}

/**
 * @lc-resource http://www.w3.org/ns/dcat#Relationship
 */
export interface Relationship {

  /**
   * @lc-property http://www.w3.org/ns/dcat#hadRole
   */
  hadRole: Role[];

  /**
   * @lc-property http://purl.org/dc/terms/relation
   */
  relation: Resource[];

}

/**
 * @lc-resource http://www.w3.org/ns/dcat#Role
 */
export interface Role {

}

/**
 * @lc-resource http://www.w3.org/ns/prov#Attribution
 */
export interface Attribution {

}

/**
 * @lc-resource http://purl.org/dc/terms/ProvenanceStatement
 */
export interface ProvenanceStatement {

}

/**
 * @lc-resource http://www.w3.org/ns/adms#Identifier
 */
export interface Identifier {

  /**
   * @lc-property http://www.w3.org/2004/02/skos/core#notation
   */
  notation: Literal;

}

/**
 * @lc-resource http://purl.org/dc/terms/Frequency
 */
export interface Frequency {

}

/**
 * @lc-resource http://www.w3.org/ns/dcat#Distribution
 */
export interface Distribution {

  iri: string | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#accessService
   */
  accessService: DataService[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#accessURL
   */
  accessURL: Resource[];

  /**
   * @lc-property http://data.europa.eu/r5r/applicableLegislation
   */
  applicableLegislation: LegalResource[];

  /**
   * @lc-property http://data.europa.eu/r5r/availability
   */
  availability: Concept | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#byteSize
   */
  byteSize: Number | null;

  /**
   * @lc-property http://spdx.org/rdf/terms#checksum
   */
  checksum: Checksum | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#compressFormat
   */
  compressionFormat: MediaType | null;

  /**
   * @lc-property http://purl.org/dc/terms/description
   */
  description: Literal[];

  /**
   * @lc-property http://xmlns.com/foaf/0.1/page
   */
  documentation: Document[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#downloadURL
   */
  downloadURL: Resource[];

  /**
   * @lc-property http://purl.org/dc/terms/format
   */
  format: MediaTypeOrExtent | null;

  /**
   * @lc-property http://www.w3.org/ns/odrl/2/hasPolicy
   */
  hasPolicy: Policy | null;

  /**
   * @lc-property http://purl.org/dc/terms/language
   */
  language: LinguisticSystem[];

  /**
   * @lc-property http://purl.org/dc/terms/license
   */
  licence: LicenceDocument | null;

  /**
   * @lc-property http://purl.org/dc/terms/conformsTo
   */
  linkedSchemas: Standard[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#mediaType
   */
  mediaType: MediaType | null;

  /**
   * @lc-property http://purl.org/dc/terms/modified
   */
  modificationDate: TemporalLiteral | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#packageFormat
   */
  packagingFormat: MediaType | null;

  /**
   * @lc-property http://purl.org/dc/terms/issued
   */
  releaseDate: TemporalLiteral | null;

  /**
   * @lc-property http://purl.org/dc/terms/rights
   */
  rights: RightsStatement | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#spatialResolutionInMeters
   */
  spatialResolution: number | null;

  /**
   * @lc-property http://www.w3.org/ns/adms#status
   */
  status: Concept | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#temporalResolution
   */
  temporalResolution: Duration | null;

  title: Literal;

}

export interface Duration {

}

/**
 * @lc-resource http://www.w3.org/ns/odrl/2/Policy
 */
export interface Policy {

}

/**
 * @lc-resource http://purl.org/dc/terms/MediaType
 */
export interface MediaType {

}

export interface DataSeries {

}

/**
 * @lc-resource http://purl.org/dc/terms/Location
 */
export interface Location {

  /**
   * @lc-property http://www.w3.org/ns/dcat#bbox
   */
  bbox: Literal | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#centroid
   */
  centroid: Literal | null;

  /**
   * @lc-property http://www.w3.org/ns/locn#geometry
   */
  geometry: Geometry | null;

}

/**
 * @lc-resource http://www.w3.org/ns/locn#Geometry
 */
export interface Geometry {

}

/**
 * @lc-resource http://purl.org/dc/terms/LinguisticSystem
 */
export interface LinguisticSystem {

}

/**
 * @lc-resource http://purl.org/dc/terms/LicenseDocument
 */
export interface LicenceDocument {

  /**
   * @lc-property http://purl.org/dc/terms/type
   */
  type: Concept[];

}

export interface TemporalLiteral {

}

/**
 * @lc-property http://www.w3.org/ns/dcat#CatalogRecord
 */
export interface CatalogueRecord {

  iri: string | null;

  /**
   * @lc-property http://purl.org/dc/terms/conformsTo
   */
  applicationProfile: Standard[];

  /**
   * @lc-property http://www.w3.org/ns/adms#status
   */
  changeType: Concept | null;

  /**
   * @lc-property http://purl.org/dc/terms/description
   */
  description: Literal | null;

  /**
   * @lc-property http://purl.org/dc/terms/language
   */
  language: LinguisticSystem[];

  /**
   * @lc-property http://purl.org/dc/terms/issued
   */
  listingDate: TemporalLiteral | null;

  /**
   * @lc-property http://purl.org/dc/terms/modified
   */
  modificationDate: TemporalLiteral;

  /**
   * @lc-property http://xmlns.com/foaf/0.1/primaryTopic
   */
  primaryTopic: CataloguedResource;

  /**
   * @lc-property http://purl.org/dc/terms/source
   */
  sourceMetadata: CatalogueRecord | null;

  /**
   * @lc-property http://purl.org/dc/terms/title
   */
  title: Literal;

}

/**
 * @lc-resource http://www.w3.org/ns/dcat#Resource
 */
export interface CataloguedResource {

  iri: string | null;

}

/**
 * @lc-resource http://spdx.org/rdf/terms#Checksum
 */
export interface Checksum {

  /**
   * @lc-property http://spdx.org/rdf/terms#algorithm
   */
  algorithm: ChecksumAlgorithm;

  /**
   * @lc-property http://spdx.org/rdf/terms#checksumValue
   */
  checksumValue: string;

}

/**
 * @lc-resource http://spdx.org/rdf/terms#ChecksumAlgorithm
 */
export interface ChecksumAlgorithm {

}

/**
 * @lc-resource http://purl.org/dc/terms/RightsStatement
 */
export interface RightsStatement {

}

export interface DataService extends CataloguedResource {

  /**
   * @lc-property http://purl.org/dc/terms/accessRights
   */
  accessRights: RightsStatement | null;

  /**
   * @lc-property http://data.europa.eu/r5r/applicableLegislation
   */
  applicableLegislation: LegalResource[];

  /**
   * @lc-property http://purl.org/dc/terms/conformsTo
   */
  conformsTo: Standard[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#contactPoint
   */
  contactPoint: Kind[];

  /**
   * @lc-property http://purl.org/dc/terms/description
   */
  description: Literal[];

  /**
   * @lc-property http://xmlns.com/foaf/0.1/page
   */
  documentation: Document[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#endpointDescription
   */
  endpointDescription: Resource[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#endpointURL
   */
  endpointURL: Resource[];

  /**
   * @lc-property http://purl.org/dc/terms/format
   */
  format: MediaTypeOrExtent | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#keyword
   */
  keyword: Literal[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#landingPage
   */
  landingPage: Document[];

  /**
   * @lc-property http://purl.org/dc/terms/license
   */
  licence: LicenceDocument[];

  /**
   * @lc-property http://purl.org/dc/terms/publisher
   */
  publisher: LicenceDocument | null;

  /**
   * @lc-property http://www.w3.org/ns/dcat#servesDataset
   */
  servesDataset: Dataset[];

  /**
   * @lc-property http://www.w3.org/ns/dcat#theme
   */
  theme: Concept[];

  /**
   * @lc-property http://purl.org/dc/terms/title
   */
  title: Literal;

}

/**
 * @lc-resource http://data.europa.eu/eli/ontology#LegalResource
 */
export interface LegalResource extends Resource { }

/**
 * @lc-resource http://www.w3.org/2006/vcard/ns#Kind
 */
export interface Kind {

}

/**
 * @lc-resource http://purl.org/dc/terms/MediaTypeOrExtent
 */
export interface MediaTypeOrExtent {

}

/**
 * @lc-resource http://www.w3.org/2000/01/rdf-schema#Resource
 */
export interface Resource {

  iri: string | null;

}

/**
 * @lc-resource http://purl.org/dc/terms/PeriodOfTime
 */
export interface PeriodOfTime {

  beginning: TimeInstant | null;

  end: TimeInstant | null;

  endDate: TemporalLiteral | null;

  startDate: TemporalLiteral | null;

}

/**
 * @lc-resource http://www.w3.org/2006/time#Instant
 */
export interface TimeInstant {

}

/**
 * @lc-resource http://www.w3.org/2004/02/skos/core#ConceptScheme
 */
export interface ConceptScheme {

  /**
   * @lc-property http://purl.org/dc/terms/title
   */
  title: Literal;

}

/**
 * @lc-resource http://purl.org/dc/terms/Standard
 */
export interface Standard {

}

/**
 * @lc-resource http://www.w3.org/2004/02/skos/core#Concept
 */
export interface Concept extends Resource {

  /**
   * @lc-property http://www.w3.org/2004/02/skos/core#prefLabel
   */
  preferredLabel: Literal[];

}

