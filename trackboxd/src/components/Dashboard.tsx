import React from 'react';
import Header from './Header';
import { Star, Heart, Play, Users, Calendar, TrendingUp } from 'lucide-react';

const DemoAuthenticatedPage = () => {
  // Sample data for demonstration
  const recentSongs = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      rating: 4.5,
      userRating: 5,
      listenedDate: "2 hours ago"
    },
    {
      id: 2,
      title: "Good 4 U",
      artist: "Olivia Rodrigo", 
      album: "SOUR",
      rating: 4.2,
      userRating: 4,
      listenedDate: "Yesterday"
    },
    {
      id: 3,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      rating: 4.7,
      userRating: 5,
      listenedDate: "3 days ago"
    }
  ];

  const trendingSongs = [
    { title: "As It Was", artist: "Harry Styles", plays: "2.1M" },
    { title: "Heat Waves", artist: "Glass Animals", plays: "1.8M" },
    { title: "Anti-Hero", artist: "Taylor Swift", plays: "1.5M" }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Welcome back, Sarah! 🎵
          </h1>
          <p className="text-text-muted text-lg">
            Here's what's been happening in your musical world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Listens */}
          <div className="lg:col-span-2">
            <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">Recent Listens</h2>
                <button className="text-accent hover:text-accent/80 font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentSongs.map((song) => (
                  <div key={song.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors duration-200">
                    {/* Album Art Placeholder */}
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-text-on-dark" />
                    </div>
                    
                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary truncate">{song.title}</h3>
                      <p className="text-text-muted">{song.artist}</p>
                      <p className="text-sm text-text-muted">{song.album} • {song.listenedDate}</p>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= song.userRating
                                ? 'text-accent fill-accent'
                                : 'text-text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <Heart className="w-5 h-5 text-text-muted hover:text-red-500 cursor-pointer transition-colors duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-accent" />
                    <span className="text-text-primary">Songs played</span>
                  </div>
                  <span className="font-semibold text-text-primary">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="text-text-primary">Reviews written</span>
                  </div>
                  <span className="font-semibold text-text-primary">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-text-primary">Friends added</span>
                  </div>
                  <span className="font-semibold text-text-primary">2</span>
                </div>
              </div>
            </div>

            {/* Trending */}
            <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-text-primary">Trending Now</h3>
              </div>
              <div className="space-y-3">
                {trendingSongs.map((song, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary truncate">{song.title}</p>
                      <p className="text-sm text-text-muted">{song.artist}</p>
                    </div>
                    <span className="text-xs text-text-muted ml-2">{song.plays}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg bg-primary text-text-on-dark hover:bg-primary/90 transition-colors duration-200">
                  Add a song
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors duration-200 text-text-primary">
                  Create playlist
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors duration-200 text-text-primary">
                  Write review
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoAuthenticatedPage;