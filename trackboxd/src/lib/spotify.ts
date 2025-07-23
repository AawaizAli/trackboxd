const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

if (!client_id || !client_secret) {
  throw new Error(`
    Missing Spotify environment variables.
    Please ensure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are set.
    Refresh token is only required for refresh flow.
  `);
}

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search`;
const USER_PROFILE_ENDPOINT = `https://api.spotify.com/v1/me`;
const PLAYLIST_ITEMS_ENDPOINT = `https://api.spotify.com/v1/playlists`;
const TRACKS_ENDPOINT = `https://api.spotify.com/v1/tracks`;

export const getAccessToken = async () => {
  if (!refresh_token) {
    throw new Error('Refresh token is required for token refresh');
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  return response.json();
};

export const searchTracks = async (query: string) => {
  try {
    const { access_token } = await getAccessToken();
    
    const response = await fetch(
      `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Spotify search error:', error);
    throw error;
  }
};

export const getCurrentUserProfile = async () => {
  try {
    const { access_token } = await getAccessToken();
    
    const response = await fetch(USER_PROFILE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Spotify user profile error:', error);
    throw error;
  }
};

export const getPlaylistTracks = async (playlistId: string, limit: number = 4) => {
  try {
    const { access_token } = await getAccessToken();
    
    const url = new URL(`${PLAYLIST_ITEMS_ENDPOINT}/${playlistId}/tracks`);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('market', 'US'); // Add market parameter
    // url.searchParams.append('fields', 'items(track(name,id,preview_url,album(name,images),added_by(id))');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Add detailed error logging
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Spotify API error ${response.status}: ${response.statusText}`, {
        url: url.toString(),
        status: response.status,
        errorBody
      });
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Spotify playlist tracks error:', error);
    throw error;
  }
};

export const getTrackDetails = async (trackId: string) => {
  try {
    const { access_token } = await getAccessToken();

    if (!trackId) {
      throw new Error('Track ID is required');
    }

    const response = await fetch(`${TRACKS_ENDPOINT}/${trackId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Spotify API error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching track details:', error);
    throw error;
  }
};

export const searchPlaylists = async (
  query: string,
  options: {
    limit?: number;
    offset?: number;
    market?: string;
  } = {}
) => {
  try {
    const { access_token } = await getAccessToken();
    
    // Set default options
    const { limit = 20, offset = 0, market = 'US' } = options;

    // Create URL with query parameters
    const url = new URL(SEARCH_ENDPOINT);
    url.searchParams.append('q', query);
    url.searchParams.append('type', 'playlist');
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('market', market);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Add detailed error logging
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Spotify API error ${response.status}: ${response.statusText}`, {
        url: url.toString(),
        status: response.status,
        errorBody
      });
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('Search playlists response:', data);
    return data.playlists?.items || [];
  } catch (error) {
    console.error('Spotify playlist search error:', error);
    throw error;
  }
};