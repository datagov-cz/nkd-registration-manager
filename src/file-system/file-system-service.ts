import fileModule from "node:fs/promises";
import pathModule from "node:path";

export function createFileSystemService(): FileSystemService {
  return new DefaultFileSystemService();
}

/**
 * This service should be used for any interaction with a file system.
 */
export interface FileSystemService {

  /**
   * @returns File content.
   */
  readFile(path: string): Promise<string>;

  /**
   * @returns List of absolute paths of files in the given directory.
   */
  readDirectory(path: string): Promise<string[]>;

  /**
   * Write content of given file.
   */
  writeFile(path: string, content: string): Promise<void>;

}

class DefaultFileSystemService implements FileSystemService {

  readFile(path: string): Promise<string> {
    return fileModule.readFile(path, { encoding: "utf-8" });
  }

  async readDirectory(path: string): Promise<string[]> {
    const items = await fileModule.readdir(path, { withFileTypes: true });
    return items
      .filter(item => item.isFile())
      .map(item => pathModule.join(path, item.name));
  }

  async writeFile(path: string, content: string): Promise<void> {
    const tempPath = path + ".swp";
    try {
      await fileModule.writeFile(tempPath, content, { encoding: "utf-8" });
      // Atomic update via rename.
      await fileModule.rename(tempPath, path);
    } catch (error) {
      try {
         await fileModule.unlink(tempPath);
      } catch {
        // Do nothing here.
      }
      throw error;
    }
  }

}

export function mockFileSystemService(
  files: { [path: string]: string },
): FileSystemService {
  return {
    async readDirectory(path) {
      // TODO This does not properly handle sub directories.
      const prefix = path.endsWith("/") ? path : path + "/";
      return Object.keys(files)
        .filter(item => item.startsWith(prefix));
    },
    readFile(path) {
      const content = files[path];
      if (content === undefined) {
        throw Error(`File path '${path}' not expected.`)
      }
      return Promise.resolve(content);
    },
    async writeFile(path, content) {
      files[path] = content;
    },
  }
};
