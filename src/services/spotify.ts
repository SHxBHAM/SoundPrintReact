import SpotifyWebApi from 'spotify-web-api-js';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const TOKEN_KEY = 'spotify_access_token';

// Log the environment variables (client ID only partially for security)
console.log('Spotify Client ID:', clientId ? `${clientId.substring(0, 4)}...` : 'not set');
console.log('Redirect URI:', redirectUri);

const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played'
];

export const spotifyApi = new SpotifyWebApi();

// Initialize with stored token if available
const storedToken = localStorage.getItem(TOKEN_KEY);
if (storedToken) {
  spotifyApi.setAccessToken(storedToken);
  console.log('Restored access token from storage');
}

export const getSpotifyAuthUrl = () => {
  if (!clientId) {
    throw new Error('Spotify Client ID is not set in environment variables');
  }

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'token');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('show_dialog', 'true');

  const url = authUrl.toString();
  console.log('Generated Spotify Auth URL:', url);
  return url;
};

export const getAccessTokenFromUrl = async () => {
  return new Promise<string>((resolve, reject) => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const error = params.get('error');
    
    if (error) {
      console.error('Spotify Auth Error:', error);
      reject(new Error(`Spotify authentication failed: ${error}`));
      return;
    }

    if (!token) {
      console.error('No access token found in URL');
      reject(new Error('No access token received from Spotify'));
      return;
    }

    resolve(token);
  });
};

export const setAccessToken = (token: string) => {
  if (!token) {
    throw new Error('No access token provided');
  }
  spotifyApi.setAccessToken(token);
  localStorage.setItem(TOKEN_KEY, token);
  console.log('Access token set and stored successfully');
};

export const clearAccessToken = () => {
  spotifyApi.setAccessToken('');
  localStorage.removeItem(TOKEN_KEY);
  console.log('Access token cleared');
};

export const getTopTracks = async (limit = 10) => {
  try {
    const token = spotifyApi.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    console.log('Fetching top tracks...');
    const response = await spotifyApi.getMyTopTracks({ limit, time_range: 'long_term' });
    console.log('Successfully fetched top tracks:', response.items.length);

    return response.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0]?.url
    }));
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    if (error instanceof Error) {
      // Only clear token if we get a 401 Unauthorized error
      if (error.message.includes('401')) {
        clearAccessToken();
        throw new Error('Spotify session expired. Please log in again.');
      }
      // For other errors, just throw without clearing the token
      if (error.message.includes('403')) {
        throw new Error('Access denied. Please check your Spotify permissions.');
      }
      // For network errors or other issues, don't clear the token
      throw new Error('Failed to fetch top tracks. Please try again.');
    }
  }
};

export const getTopGenres = async (limit = 10) => {
  try {
    const token = spotifyApi.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    console.log('Fetching top artists...');
    const response = await spotifyApi.getMyTopArtists({ limit, time_range: 'long_term' });
    console.log('Successfully fetched top artists:', response.items.length);

    // Get all genres from top artists
    const allGenres = response.items.flatMap(artist => artist.genres);
    
    // Count genre occurrences
    const genreCount = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort genres by count and get top 2
    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([genre]) => genre.toUpperCase());

    return topGenres.join(', ');
  } catch (error) {
    console.error('Error fetching top genres:', error);
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        clearAccessToken();
        throw new Error('Spotify session expired. Please log in again.');
      }
      if (error.message.includes('403')) {
        throw new Error('Access denied. Please check your Spotify permissions.');
      }
      throw new Error('Failed to fetch genres. Please try again.');
    }
    return 'UNKNOWN';
  }
}; 