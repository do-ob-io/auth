/**
  * An object that contains the context of the client.
  */
export interface AuthClientContext {
  /**
   * Base url of the authentication server.
   */
  baseUrl: string;

  /**
   * The path to fetching a challenge.
   */
  pathChallenge: string;

  /**
   * The route to registering a user.
   */
  pathRegister: string;

  /**
   * Fetches a challenge from a server.
   */
  fetchChallenge: () => Promise<string>
}
