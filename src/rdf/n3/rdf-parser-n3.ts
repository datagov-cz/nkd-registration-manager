import N3 from "n3";

import type { Node, BlankNode, Literal, NamedNode, Term } from "../rdf-model";
import type { Collector } from "../rdf-parser";

const parser = new N3.Parser({});

export async function parseN3<T>(
  document: string,
  consumer: Collector<T>,
): Promise<T> {
  return new Promise<T>((accept, reject) => {
    const callback = createCallback(accept, reject, consumer);
    parser.parse(document, callback);
  });
}

/**
 * @returns Callback that feeds all quads to the {@link consumer}.
 */
function createCallback<T>(
  accept: (value: T) => void,
  reject: (reason?: any) => void,
  consumer: Collector<T>,
) {
  return (error: Error, quad: N3.Quad) => {
    if (error !== null) {
      reject(error);
      return;
    }
    if (error === null && quad === null) {
      accept(consumer.result());
      return;
    }
    const subject = convertSubject(quad.subject);
    const predicate = quad.predicate.value;
    const object = convertObject(quad.object);
    consumer.consume(subject, predicate, object);
  }
}

function convertSubject(value: N3.Quad_Subject): Node | null {
  switch (value.termType) {
    case "NamedNode":
      return {
        termType: "NamedNode",
        value: value.value,
      } as NamedNode;
    case "BlankNode":
      return {
        termType: "BlankNode",
        value: value.value,
      } as BlankNode;
    default:
      console.error("Unknown value when parsing using n3:", value);
      return null;
  }
}

function convertObject(value: N3.Quad_Object): Term | null {
  switch (value.termType) {
    case "NamedNode":
      return {
        termType: "NamedNode",
        value: value.value,
      } as NamedNode;
    case "BlankNode":
      return {
        termType: "BlankNode",
        value: value.value,
      } as BlankNode;
    case "Literal":
      return {
        termType: "Literal",
        value: value.value,
        language: value.language === "" ? null : value.language,
        datatype: value.datatype,
      } as Literal;
    case "Variable":
    default:
      console.error("Unknown value when parsing using n3:", value);
      return null;
  }
}

export async function parseN3Stream<T>(
  document: ReadableStreamDefaultReader<Uint8Array>,
  format: N3.BaseFormat,
  consumer: Collector<T>,
): Promise<T> {
  return new Promise((accept, reject) => {
    const parser = new N3StreamReader({ format }, consumer);
    parser.parse(document)
      .then(() => accept(consumer.result()))
      .catch(error => reject(error));
  });
}

/**
 * Support for reading RDF stream.
 */
class N3StreamReader<T> {

  protected readonly parser: N3.Parser;

  protected readonly consumer: Collector<T>;

  protected readonly decoder = new TextDecoder("utf-8");

  /**
   * Parser callback for when data ara available.
   */
  protected onData?: (data: string) => void;

  /**
   * Parser callback for end of the data.
   */
  protected onEnd?: () => void;

  constructor(options: N3.ParserOptions, consumer: Collector<T>) {
    this.parser = new N3.Parser(options);
    this.consumer = consumer;
    this.initializeParser();
  }

  protected initializeParser() {
    const source = this.createCaptureSource();

    const callback = (error: Error, quad: N3.Quad) => {
      if (error !== null) {
        throw error;
      }
      if (quad !== null) {
        const subject = convertSubject(quad.subject);
        const predicate = quad.predicate.value;
        const object = convertObject(quad.object);
        this.consumer.consume(subject, predicate, object);
      }
      // We do not handle end of the stream here.
    };

    this.parser.parse(source as any, callback);
  }

  /**
   * Create and return source that only captures callbacks.
   */
  protected createCaptureSource() {
    return {
      on: (event: any, callback: any) => {
        switch (event) {
          case "data":
            this.onData = callback;
            break;
          case "end":
            this.onEnd = callback;
            break;
          case "error":
            // We do not need to capture error callback.
            break;
        }
      },
    };
  }

  public async parse(reader: ReadableStreamDefaultReader): Promise<void> {
    let readResult = await reader.read();
    while (!readResult.done) {
      const decoded = this.decoder.decode(readResult.value);
      this.onData?.(decoded);
      readResult = await reader.read();
    }
    this.onEnd?.();
  }

}
