export interface JwtPayload {
  sub: string;
  userId: string;
  shopId: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}
