
export function createHttpAuthentication(): HttpAuthentication {
  return new DefaultHttpAuthentication();
}

export interface HttpAuthentication {

  /**
   * @returns Name of a header with authentication information.
   */
  httpHeaderName(): string;

  /**
   * @param page Where to redirect back after login.
   * @returns URL for login.
   */
  loginRedirectUrl(page: string): string;

  /**
   * @returns Null if there are no authentication data.
   */
  createFromHeader(
    value: string | string[] | undefined,
  ): AuthenticationData | null;

}

export interface AuthenticationData {

  login: string;

  familyName: string;

  givenName: string;

  isEditor: boolean;

  entity: {

    identifier: string;

    name: string;

  }

}

class DefaultHttpAuthentication implements HttpAuthentication {

  httpHeaderName(): string {
    return "x-caais-token";
  }

  loginRedirectUrl(page: string): string {
    return "/caais/login?redirect-url=" + encodeURIComponent(page);
  }

  createFromHeader(
    value: string | string[] | undefined,
  ): AuthenticationData | null {
    if (value === undefined) {
      return null;
    }
    if (Array.isArray(value)) {
      value = value[0];
    }

    try {
      const payload = value.split(".")[1];
      // TODO Add JWT validation.
      const { user, entity } = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
      if (user === undefined || entity === undefined) {
        return null;
      }
      return {
        login: user.username,
        givenName: user.given_name,
        familyName: user.family_name,
        isEditor: user.roles.includes("EDITOR"),
        entity: {
          identifier: entity.public_identifier,
          name: entity.name,
        },
      }
    } catch (error) {
      return null;
    }
  }

}
