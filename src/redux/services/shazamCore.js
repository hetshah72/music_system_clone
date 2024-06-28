import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

// Function to get Spotify access token
const getSpotifyToken = async () => {
  const clientId = '538968132aaa4c199d00e391f9bde7a5';
  const clientSecret = '6de9e64eb144491a8663bb7f91fa6cd5';
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  
  const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
  });
  const token = response.data.access_token;
  console.log('Spotify Token:', token); // Debugging: Log the access token
  return token;
};

export const shazamCoreApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.spotify.com/v1/',
    prepareHeaders: async (headers) => {
      const token = await getSpotifyToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => 'browse/categories/toplists/playlists' }),
    getSongsByGenre: builder.query({ query: () => `browse/categories/dinner/playlists` }),
    getSongsByCountry: builder.query({ query: (country) => `browse/categories/0JQ5DAqbMKFz6FAsUtgAab/playlists` }),
    getSongsBySearch: builder.query({ query: (searchTerm) => `search?q=${searchTerm}&type=track,artist` }),
    getArtistDetails: builder.query({ query: (artistId) => `artists/${artistId}` }),
    getSongDetails: builder.query({ query: (songId) => `tracks/${songId}` }),
    getSongRelated: builder.query({ query: (artistId) => `artists/${artistId}/related-artists` }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  useGetArtistDetailsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
}  = shazamCoreApi;
