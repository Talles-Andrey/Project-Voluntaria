export interface JwtPayload {
  sub: string; // ID do usuário
  email: string;
  userType: 'volunteer' | 'ngo';
  iat?: number; // issued at
  exp?: number; // expiration
}
