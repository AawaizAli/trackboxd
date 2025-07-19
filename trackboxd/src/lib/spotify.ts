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