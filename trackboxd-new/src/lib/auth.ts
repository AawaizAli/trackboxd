import { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'user-read-email user-read-private',
          show_dialog: true
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }): Promise<JWT> {
      // Initial sign in
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000,
        };
      }

      // Type-safe expiration check
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      // Refresh token if expired
      return refreshAccessToken(token);
    },
    async session({ session, token }): Promise<any> {
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          email: token.email,
          image: token.picture,
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresAt: token.expiresAt,
        error: token.error,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + (refreshedTokens.expires_in * 1000),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('RefreshAccessTokenError', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}