export class TokenRO implements Readonly<TokenRO> {
  /**
   * id of the user that is associated with this token.
   */
  userId: number;
  tokenData: TokenData;
}

class TokenData {
  /**
   * Bearer Token that is required in the Authorization Header
   * for resource related requests.
   */
  access_token: string;

  /**
   * Provides the expiration of the access token in seconds.
   * For example: 3600
   */
  expires_in: number;
}
