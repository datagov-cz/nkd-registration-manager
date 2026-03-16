import fileSystem from "node:fs/promises";

export class FileChangeTracker {

  readonly lastReadTimes: Map<string, number> = new Map();

  /**
   * Returns true if the file has been modified since the given time
   */
  async hasChangedSinceMarked(filePath: string): Promise<boolean> {
    const lastReadTime = this.lastReadTimes.get(filePath);
    if (lastReadTime === undefined) {
      return false;
    }
    const stats = await fileSystem.stat(filePath);
    const modifiedTime = stats.mtimeMs;
    return modifiedTime > lastReadTime;
  }

  /**
   * Marks the file as read at the given time.
   */
  mark(filePath: string, time: Date): void {
    const timestamp = time.getTime();
    this.lastReadTimes.set(filePath, timestamp);
  }

}
