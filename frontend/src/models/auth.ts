export type AccessToken = {
  access_token: string;
  expires_in: number;
};

export interface LoginData {
  userId: number;
  tokenData: AccessToken;
}
