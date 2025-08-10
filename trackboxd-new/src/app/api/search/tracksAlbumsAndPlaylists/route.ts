import { NextResponse } from 'next/server';
import { searchTracksAlbumsAndPlaylists } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const trackLimit = searchParams.get('trackLimit');
    const albumLimit = searchParams.get('albumLimit');
    const playlistLimit = searchParams.get('playlistLimit');
    const market = searchParams.get('market');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = await searchTracksAlbumsAndPlaylists(query, {
      trackLimit: trackLimit ? Number(trackLimit) : undefined,
      albumLimit: albumLimit ? Number(albumLimit) : undefined,
      playlistLimit: playlistLimit ? Number(playlistLimit) : undefined,
      market: market || undefined,
    });

    console.log('Search results:', results); // Debugging log

    return NextResponse.json(results);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search Spotify',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Explicitly define other HTTP methods as not allowed
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}