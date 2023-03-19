export interface PayloadJWT {
  header: { alg: string; typ: string };
  payload: {
    sub: string;
    email: string;
    username: string;
    account_id: string;
    jti: string;
    iat: number;
    exp: number;
  };
  signature: string;
}
