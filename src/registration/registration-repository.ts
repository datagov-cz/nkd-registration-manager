import { DiskRepository } from "./disk";
import { IsdsRepository } from "./isds";
import { RegistrationEntry } from "./registration-model";

export function createRegistrationRepository(
  isds: IsdsRepository,
  disk: DiskRepository,
): RegistrationRepository {
  return new DefaultRegistrationRepository(isds, disk);
}

export interface RegistrationRepository {

  /**
   * @returns All entries for given organization.
   */
  listRegistrations(organization: string): RegistrationEntry[];

  /**
   * @returns Content of given message's attachment or null.
   */
  readAttachment(
    organization: string,
    identifier: string,
  ): Promise<string | null>;

  /**
   * @returns Identifier of the newly created registration entry.
   */
  createRegistration(
    organization: string,
    username: string,
    attachment: string,
  ): Promise<RegistrationEntry>

  /**
   * Run synchronize content with storage.
   */
  synchronize(): Promise<void>;

}

class DefaultRegistrationRepository implements RegistrationRepository {

  readonly isds: IsdsRepository;

  readonly disk: DiskRepository;

  constructor(isds: IsdsRepository, disk: DiskRepository) {
    this.isds = isds;
    this.disk = disk;
  }

  listRegistrations(organization: string): RegistrationEntry[] {
    return [
      ...this.isds.listRegistrations(organization),
      ...this.disk.listRegistrations(organization),
    ];
  }

  async readAttachment(
    organization: string, identifier: string,
  ): Promise<string | null> {
    return await this.isds.readAttachment(organization, identifier) ??
      await this.disk.readAttachment(organization, identifier) ??
      null;
  }

  async createRegistration(
    organization: string, username: string, attachment: string,
  ): Promise<RegistrationEntry> {
    return this.disk.createRegistration(organization, username, attachment);
  }

  async synchronize(): Promise<void> {
    await Promise.all([this.isds.synchronize(), this.disk.synchronize()]);
  }

}
