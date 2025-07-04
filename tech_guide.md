
# 🧠 trackboxd — Technical Architecture

This document outlines the full technical structure behind **Spotboxd**, a web-only application built to provide review, rating, and annotation capabilities on top of the Spotify platform.

---

## 🛠️ Stack Overview

| Layer         | Tech                                   |
|---------------|----------------------------------------|
| **Frontend**  | Next.js, Tailwind CSS, shadcn/ui       |
| **Auth**      | NextAuth.js with Spotify Provider      |
| **Backend**   | Next.js API Routes or Supabase         |
| **Database**  | PostgreSQL                             |
| **Storage**   | DB only (annotations, ratings, etc.)   |
| **Playback**  | HTML5 Audio + wavesurfer.js (optional) |
| **Hosting**   | Vercel (Frontend), Supabase / Render (Backend + DB) |

---

## 🔐 Authentication Strategy

### Provider: **Spotify**
- Handled via **NextAuth.js**
- Uses **OAuth 2.0 Authorization Code Flow**
- No username/password system needed

### Scopes Required:
```env
user-read-email
playlist-read-private
playlist-read-collaborative
playlist-modify-public
playlist-modify-private
user-library-read
````

### Token Flow:

* Access token stored in JWT via NextAuth
* Token attached to all Spotify Web API calls
* Optional: Refresh token handling for long-lived sessions

---

## 🧩 Key Features and Logic

### 1. **Ratings & Reviews**

* Users rate songs, albums, or playlists
* Ratings stored locally in DB (not on Spotify)
* Reviews are user-generated content linked to items via Spotify IDs

### 2. **Timestamped Annotations**

* For individual tracks, at specific seconds
* Displayed over a waveform player (wavesurfer.js recommended)
* Each annotation has:

  * `timestamp`
  * `text`
  * `user_id`
  * `track_id`
* Upvotes and comments supported via join tables

### 3. **Playlist Import & Creation**

* Use `GET /me/playlists` to import playlists
* Use `POST /users/{user_id}/playlists` to create new ones
* Use `POST /playlists/{playlist_id}/tracks` to populate playlists

---

## 🧬 Data Models (PostgreSQL)

### `users`

| Column      | Type                |
| ----------- | ------------------- |
| id          | string (Spotify ID) |
| name        | text                |
| email       | text                |
| image\_url  | text                |
| created\_at | timestamp           |

---

### `reviews`

| Column      | Type                               |
| ----------- | ---------------------------------- |
| id          | uuid                               |
| user\_id    | string                             |
| item\_type  | enum(`track`, `album`, `playlist`) |
| item\_id    | string (Spotify ID)                |
| rating      | integer (1–5)                      |
| text        | text                               |
| created\_at | timestamp                          |

---

### `annotations`

| Column      | Type                |
| ----------- | ------------------- |
| id          | uuid                |
| user\_id    | string              |
| track\_id   | string (Spotify ID) |
| timestamp   | float               |
| text        | text                |
| created\_at | timestamp           |

---

### `annotation_upvotes`

| Column         | Type      |
| -------------- | --------- |
| id             | uuid      |
| annotation\_id | uuid      |
| user\_id       | string    |
| created\_at    | timestamp |

---

### `comments`

| Column         | Type      |
| -------------- | --------- |
| id             | uuid      |
| annotation\_id | uuid      |
| user\_id       | string    |
| text           | text      |
| created\_at    | timestamp |

---

## 📡 Spotify Web API Usage

### Data Retrieval

| Task                | Endpoint                     |
| ------------------- | ---------------------------- |
| Get user playlists  | `GET /me/playlists`          |
| Get playlist tracks | `GET /playlists/{id}/tracks` |
| Get album details   | `GET /albums/{id}`           |
| Get track details   | `GET /tracks/{id}`           |
| Get audio features  | `GET /audio-features/{id}`   |

### Playlist Management

| Task            | Endpoint                          |
| --------------- | --------------------------------- |
| Create playlist | `POST /users/{user_id}/playlists` |
| Add tracks      | `POST /playlists/{id}/tracks`     |
| Remove tracks   | `DELETE /playlists/{id}/tracks`   |

---

## 🧠 State Management Strategy

| Feature          | Approach                        |
| ---------------- | ------------------------------- |
| Auth session     | `useSession()` from NextAuth    |
| Now playing song | React state / context           |
| Playback time    | wavesurfer / HTML5 audio events |
| UI state         | React local state or Zustand    |

---

## 🧪 Dev Workflow

### Week 1: Auth + Base Spotify Integration

* [ ] Configure NextAuth with Spotify
* [ ] Fetch user profile + playlists
* [ ] Set up Supabase/PostgreSQL schema

### Week 2: Ratings + Reviews

* [ ] UI for rating tracks/albums/playlists
* [ ] Store reviews in DB
* [ ] Display rating breakdown per item

### Week 3: Annotations System

* [ ] Build waveform player with timestamps
* [ ] Store + retrieve annotations per track
* [ ] Enable annotation comments + upvotes

### Week 4: Playlist Sync

* [ ] Allow playlist creation
* [ ] Add tracks based on reviews/ratings
* [ ] Sync created playlists to Spotify

---

## 📤 Deployment Targets

| Layer    | Target                    |
| -------- | ------------------------- |
| Frontend | Vercel                    |
| Backend  | Supabase (Postgres + API) |
| Auth     | NextAuth via Spotify      |
| Storage  | Postgres only             |

---

## 🧱 Future Plans

* [ ] Social feed (follow users, see activity)
* [ ] Tagging system (moods, genres)
* [ ] Export/import annotation sets
* [ ] Public vs private profiles
* [ ] Spotify listening history integration

---

## 🧼 Maintenance & Rate Limit Handling

* Spotify API has rate limits (\~10 req/sec)
* Use caching (optional: Redis or Supabase edge functions)
* Refresh token rotation every 60 minutes

---

## 📎 Related Docs

* [Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/)
* [NextAuth.js Docs](https://next-auth.js.org/)
* [Supabase Docs](https://supabase.com/docs)

