import { logger } from "../application";
import { SparqlService } from "../sparql";

export function createRppService(
  sparql: SparqlService, endpoint: string,
): RppService {
  return new SparqlRppService(sparql, endpoint);
}

export interface RppService {

  /**
   * @return Null when there is no mapping.
   */
  databoxToOrganization(databox: string): Promise<string | null>

}

class SparqlRppService implements RppService {

  readonly endpoint: string;

  readonly cache: Map<string, string | null> = new Map();

  readonly sparql;

  constructor(sparql: SparqlService, endpoint: string) {
    this.sparql = sparql;
    this.endpoint = endpoint;
  }

  async databoxToOrganization(databox: string): Promise<string | null> {
    const cached = this.cache.get(databox);
    if (cached !== undefined) {
      return cached;
    }
    const query = this.createSparqlQuery(databox);
    logger.debug({ endpoint: this.endpoint }, "Executing SPARQL query.");
    const result = await this.sparql.executeSelect(this.endpoint, query);
    if (result.length !== 1) {
      logger.warn(
        { databox, count: result.length },
        "Invalid number of results for databox to organization SPARQL query.");
      // Store null into the result.
      this.cache.set(databox, null);
      return null;
    }
    const organization = result[0]?.ovmID?.value;
    if (organization === undefined) {
      logger.warn(
        { databox, organization },
        "Missing organization in a result of organization SPARQL query.");
      throw Error();
    }
    // Update cache.
    this.cache.set(databox, organization);
    // Return result.
    return organization;
  }

  private createSparqlQuery(databox: string): string {
    return `
PREFIX gr: <http://purl.org/goodrelations/v1#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX req: <http://plugins.linkedpipes.com/ontology/x-httpRequest#>
PREFIX nkod: <https://data.gov.cz/slovník/nkod/>
PREFIX pojem: <https://slovník.gov.cz/legislativní/sbírka/111/2009/pojem/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX a-sgov-104-pojem: <https://slovník.gov.cz/agendový/104/pojem/>

SELECT ?dsID ?ovmID WHERE {
  ?ovm pojem:má-datovou-schránku-orgánu-veřejné-moci ?dsIRI ;
    pojem:má-identifikátor-orgánu-veřejné-moci ?ovmID ;
    pojem:má-název-orgánu-veřejné-moci ?ovmNázev .
  ?dsIRI pojem:má-identifikátor-datové-schránky ?dsID.

  OPTIONAL { ?ovm a-sgov-104-pojem:má-datum-ukončení-výkonu-působnosti-orgánu-veřejné-moci ?ukonceni }
  FILTER(!bound(?ukonceni) || ?ukonceni > now())

  VALUES ?dsID {"${databox}"^^xsd:string}
}
  `
  }

}
