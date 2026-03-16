import { Configuration } from "../application/";

export interface Forms {

  /**
   * @returns Base URL to proxy all resources to.
   */
  proxyUrl(): string;

  fetchRegisterDatasetHtml(payload: object): Promise<string>;

  fetchWithdrawDatasetHtml(payload: object): Promise<string>;

  fetchRegisterCatalogHtml(payload: object): Promise<string>;

  fetchWithdrawCatalogHtml(payload: object): Promise<string>;

}

class DefaultForms implements Forms {

  readonly configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  proxyUrl(): string {
    return this.configuration.forms.proxyUrl;
  }

  fetchRegisterDatasetHtml(payload: object): Promise<string> {
    return this.proxyForm("/registrace-datové-sady", payload);
  }

  private async proxyForm(
    relativeUrl: string,
    payload: object,
    returnUrl: string,
  ): Promise<string> {
    const url = this.configuration.forms.proxyUrl + relativeUrl;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "formData=" + encodeURIComponent(JSON.stringify(payload)) + "&returnUrl=\"./\"",
    });
    return await response.text();
  }

  fetchWithdrawDatasetHtml(payload: object): Promise<string> {
    return this.proxyForm("/odstranění-datové-sady", payload);
  }

  fetchRegisterCatalogHtml(payload: object): Promise<string> {
    return this.proxyForm("/registrace-lokálního-katalogu", payload);
  }

  fetchWithdrawCatalogHtml(payload: object): Promise<string> {
    return this.proxyForm("/odstranění-lokálního-katalogu", payload);
  }

}

export function createForms(configuration: Configuration) {
  return new DefaultForms(configuration);
}
