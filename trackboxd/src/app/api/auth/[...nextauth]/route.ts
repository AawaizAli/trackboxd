import { createClient } from "@/lib/supabase/server";
import NextAuth, { type NextAuthOptions, DefaultSession, Profile } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    spotifyId?: string;
    error?: string;
  }
  interface Profile {
    id: string;
  }
}

// Define the required scopes
const SPOTIFY_SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-library-read',
  'user-top-read',
  'user-read-recently-played'
].join(',');

// Type-safe auth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: SPOTIFY_SCOPES,
          show_dialog: true
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        const supabase = createClient(cookies());
        
        // Get the Spotify profile data
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select()
          .eq('id', profile.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user:', fetchError);
          return false;
        }

        if (!existingUser) {
          // Create new user if doesn't exist
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: profile.id,
              email: profile.email,
              name: profile.display_name,
              image_url: profile.images?.[0]?.url || null,
              spotify_url: profile.external_urls?.spotify || null,
              country: profile.country || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating user:', insertError);
            return false;
          }
        } else {
          // Update existing user
          const { error: updateError } = await supabase
            .from('users')
            .update({
              email: profile.email,
              name: profile.display_name,
              image_url: profile.images?.[0]?.url || null,
              spotify_url: profile.external_urls?.spotify || null,
              country: profile.country || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id);

          if (updateError) {
            console.error('Error updating user:', updateError);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error('Auth error:', error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.spotifyId = profile.id;
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
      }
      
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }
      
      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: any, token: any }) {
      session.accessToken = token.accessToken as string;
      session.spotifyId = token.spotifyId as string;
      session.error = token.error as string;
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Token refresh implementation
async function refreshAccessToken(token: any) {
  try {
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

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };