// app/api/songs/global-top-4/route.ts
import { getPlaylistTracks } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export async function GET() {
  const playlistId = '37i9dQZEVXbLRQDuF5jeBp';
  
  try {
    const tracks = await getPlaylistTracks(playlistId, 4);
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Failed to fetch playlist tracks:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch playlist tracks',
        details: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}