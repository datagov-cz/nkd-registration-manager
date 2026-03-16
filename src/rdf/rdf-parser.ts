import type { Node, Term, Statement } from "./rdf-model";

export interface Collector<T> {

  consume(subject: Node | null, predicate: string, object: Term | null): void;

  result(): T;

}

/**
 * Collect statements into an array.
 */
export function collectToArray(): Collector<Statement[]> {
  const statements: Statement[] = [];
  return {
    consume: function (subject, predicate, object): void {
      if (subject === null || object === null) {
        return;
      }
      statements.push([subject, predicate, object]);
    },
    result: function (): Statement[] {
      return statements;
    }
  };
}
