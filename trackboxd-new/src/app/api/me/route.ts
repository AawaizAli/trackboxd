import { getCurrentUserProfile } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile();
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Failed to fetch Spotify user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify user profile' },
      { status: 500 }
    );
  }
}