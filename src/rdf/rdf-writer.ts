import { Statement } from "./rdf-model";

export interface RdfWriter {

  addStatements(statements: Statement[]): void;

}

/**
 * In memory writer to a string.
 */
export interface StringRdfWriter extends RdfWriter {

  asString(): Promise<string>;

}
