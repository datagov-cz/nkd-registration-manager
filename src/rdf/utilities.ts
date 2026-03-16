
export function asArray<T>(value: T): T[] {
  if (value === undefined || value === null) {
    return [];
  } else if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

export function hasIntersection<T>(
  left: T[],
  right: T[],
  equals: ((left: T, right: T) => boolean) | undefined = undefined,
): boolean {
  if (equals === undefined) {
    // Use index based method if there is no custom comparator.
    const leftSet = new Set(left);
    return right.some(item => leftSet.has(item));
  } else {
    return left.some(x => right.some(y => equals(x, y)));
  }
}
