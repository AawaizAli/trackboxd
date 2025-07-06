✅ Core Functionalities (MVP-Level)

These are essential to make trackboxd usable and differentiated:

🔐 Auth & User Onboarding
 Spotify-only login via OAuth (NextAuth)
 Fetch user profile (name, image, Spotify ID)
 Save user in database (on first login)
 Store & refresh Spotify access tokens
🎵 Track/Album/Playlist Metadata
 Search tracks, albums, playlists (Spotify API)
 Fetch metadata (title, artist, cover art, duration, etc.)
 Fetch audio features (optional: tempo, energy, etc.)
⭐ Ratings & Reviews
 Rate any track, album, or playlist (1–5 stars)
 Write reviews (title + text)
 Edit/delete own reviews
 Display aggregate rating per item
 Sort reviews by date, rating, popularity
🕒 Timestamped Annotations
 Play a song in an embedded/audio player
 Add annotation at specific timestamp
 See annotations appear while scrubbing/playing
 View all annotations per track (timeline-style)
 Delete/edit own annotations


 🧑‍💻 User Features

🧾 Profile Page
 View own profile (avatar, name, Spotify link)
 See all own reviews (track/album/playlist)
 See all own annotations
 See own playlists
📦 Playlist Integration
 Import user playlists
 View playlist contents
 Review playlists
 Create a playlist in Spotboxd → sync to Spotify
 Add tracks to synced playlists (via Spotboxd)
👍 Social Interactions
 Upvote others' annotations
 Comment on annotations
 See top upvoted annotations per track

 📊 Discovery / Explore

 View trending annotations (upvoted recently)
 View top-rated tracks, albums, playlists
 Filter by genre, artist, decade (optional)
 See activity feed (if social/follow system is added)