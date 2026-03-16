
export class SparqlService {

  async executeSelect(
    endpoint: string, query: string,
  ): Promise<SparqlSelectResult[]> {
    const response = await fetch(endpoint, {
      "headers": {
        "accept": "application/sparql-results+json,*/*;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      "body": "query=" + encodeURI(query),
      "method": "POST"
    });
    const content = await response.json();
    return content.results.bindings;
  }

}

type SparqlSelectResult = {
  [column: string]: {
    value: string,
  },
};
