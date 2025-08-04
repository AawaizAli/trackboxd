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

export const searchTracksAndAlbums = async (
  query: string,
  options: {
    trackLimit?: number;
    albumLimit?: number;
    market?: string;
  } = {}
) => {
  try {
    const { access_token } = await getAccessToken();
    const { trackLimit = 7, albumLimit = 4, market = 'US' } = options;

    // Create URLs for both endpoints
    const tracksUrl = new URL(SEARCH_ENDPOINT);
    tracksUrl.searchParams.append('q', query);
    tracksUrl.searchParams.append('type', 'track');
    tracksUrl.searchParams.append('limit', trackLimit.toString());
    tracksUrl.searchParams.append('market', market);

    const albumsUrl = new URL(SEARCH_ENDPOINT);
    albumsUrl.searchParams.append('q', query);
    albumsUrl.searchParams.append('type', 'album'); // <-- Changed from 'playlist' to 'album'
    albumsUrl.searchParams.append('limit', albumLimit.toString());
    albumsUrl.searchParams.append('market', market);

    // Execute both requests in parallel
    const [tracksResponse, albumsResponse] = await Promise.all([
      fetch(tracksUrl.toString(), {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
      fetch(albumsUrl.toString(), {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
    ]);

    // Check for errors
    if (!tracksResponse.ok || !albumsResponse.ok) {
      const tracksError = !tracksResponse.ok ? await tracksResponse.text() : null;
      const albumsError = !albumsResponse.ok ? await albumsResponse.text() : null;
      
      console.error('Spotify API errors:', {
        tracksError,
        albumsError,
      });
      
      throw new Error(
        `Spotify API errors: ${tracksError || ''} ${albumsError || ''}`
      );
    }

    const [tracksData, albumsData] = await Promise.all([
      tracksResponse.json(),
      albumsResponse.json(),
    ]);

    return {
      tracks: tracksData.tracks?.items || [],
      albums: albumsData.albums?.items || [],
    };
  } catch (error) {
    console.error('Spotify combined search error:', error);
    throw error;
  }
};

export const getPlaylistDetails = async (
  playlistId: string,
  options: {
    market?: string;
    fields?: string;
  } = {}
) => {
  try {
    const { access_token } = await getAccessToken();
    
    // Set default options
    const { market = 'US', fields } = options;

    // Create URL
    const url = new URL(`${PLAYLIST_ITEMS_ENDPOINT}/${playlistId}`);
    
    // Add query parameters
    if (market) url.searchParams.append('market', market);
    if (fields) url.searchParams.append('fields', fields);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Detailed error handling
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Spotify API error ${response.status}: ${response.statusText}`, {
        url: url.toString(),
        status: response.status,
        errorBody
      });
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    
    return await response.json();
  } catch (error) {
    console.error('Spotify getPlaylistDetails error:', error);
    throw error;
  }
};

export const createPlaylist = async (
  userId: string,
  name: string,
  options: {
    public?: boolean;
    collaborative?: boolean;
    description?: string;
  } = {}
) => {
  try {
    const { access_token } = await getAccessToken();
    
    // Set default options
    const {
      public: isPublic = true,
      collaborative = false,
      description = ""
    } = options;

    // Validate input
    if (!userId) throw new Error("User ID is required");
    if (!name) throw new Error("Playlist name is required");
    if (collaborative && isPublic) {
      throw new Error("Collaborative playlists must be private");
    }

    // Create the playlist
    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          public: isPublic,
          collaborative,
          description,
        }),
      }
    );

    // Handle errors
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Spotify API error ${response.status}: ${response.statusText}`, {
        endpoint: `users/${userId}/playlists`,
        status: response.status,
        errorBody
      });
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Spotify createPlaylist error:", error);
    throw error;
  }
};

export const addItemsToPlaylist = async (
  playlistId: string,
  uris: string[],
  options: {
    position?: number;
  } = {}
) => {
  try {
    const { access_token } = await getAccessToken();
    
    // Validate input
    if (!playlistId) throw new Error("Playlist ID is required");
    if (!uris || uris.length === 0) throw new Error("At least one URI is required");
    if (uris.length > 100) throw new Error("Maximum 100 items can be added at once");

    // Prepare request
    const { position } = options;
    const url = new URL(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`);
    
    if (position !== undefined) {
      url.searchParams.append('position', position.toString());
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris,
        position: position !== undefined ? position : undefined,
      }),
    });

    // Handle errors
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Spotify API error ${response.status}: ${response.statusText}`, {
        endpoint: `playlists/${playlistId}/tracks`,
        status: response.status,
        errorBody
      });
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.snapshot_id;
  } catch (error) {
    console.error("Spotify addItemsToPlaylist error:", error);
    throw error;
  }
};

export const searchAlbums = async (
  query: string,
  options: {
    limit?: number;
    market?: string;
  } = {}
) => {
  try {
    const { access_token } = await getAccessToken();
    const { limit = 3, market = 'US' } = options;

    const url = new URL(SEARCH_ENDPOINT);
    url.searchParams.append('q', query);
    url.searchParams.append('type', 'album');
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('market', market);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

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
    return data.albums?.items || [];
  } catch (error) {
    console.error('Spotify album search error:', error);
    throw error;
  }
};