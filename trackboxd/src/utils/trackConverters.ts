import { Track, SpotifyTrack, Review } from "@/app/songs/types";

export const spotifyToTrack = (track: SpotifyTrack): Track => {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map(a => a.name).join(", "),
    album: track.album.name,
    coverArt: track.album.images[0]?.url || "/default-album.png",
    avgRating: 0, // Default value since Spotify doesn't provide ratings
    saveCount: 0, // Default value since Spotify doesn't provide save counts
    genre: "Pop", // Default value
    year: track.album.release_date ? parseInt(track.album.release_date.substring(0, 4)) : new Date().getFullYear(),
    mood: "Energetic", // Default value
    isSaved: false
  };
};

export const reviewToTrack = (review: Review): Track => {
  const trackDetails = review.track_details;
  const album = trackDetails.album;
  const artists = trackDetails.artists;

  return {
    id: trackDetails.id,
    title: trackDetails.name,
    artist: artists.map(a => a.name).join(", "),
    album: album.name,
    coverArt: album.images[0]?.url || "/default-album.png",
    avgRating: review.rating,
    saveCount: Math.floor(Math.random() * 2000) + 500, // Temporary random count
    genre: "Pop", // Default value
    year: album.release_date ? parseInt(album.release_date.substring(0, 4)) : new Date().getFullYear(),
    mood: "Energetic", // Default value
    isSaved: false
  };
};