export interface TJwtPayload {
  _id: string;
  email: string;
}

export interface JwtOutput {
  accessToken: string;
  refreshToken: string;
}

