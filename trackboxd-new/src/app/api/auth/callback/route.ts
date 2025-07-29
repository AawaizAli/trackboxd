// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect('/login?error=missing_code');
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://cockatoo-engaged-readily.ngrok-free.app/api/auth/callback/spotify'
      })
    });

    const tokens = await tokenResponse.json();
    // Store tokens securely and redirect
    return NextResponse.redirect('/dashboard');
  } catch (error) {
    return NextResponse.redirect('/login?error=auth_failed');
  }
}