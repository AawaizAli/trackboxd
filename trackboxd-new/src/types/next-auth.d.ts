import "next-auth/jwt";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
    spotifyId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}