"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Bookmark, Music, Album, List, Clock, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data
const currentUser = {
  name: "Iznah Waqar",
  avatar: "/api/placeholder/40/40",
  username: "iznauurr"
};

const recentActivity = [
  {
    id: 1,
    type: "review",
    itemType: "track",
    title: "Blinding Lights",
    artist: "The Weeknd",
    rating: 4.5,
    content: "An absolute masterpiece that captures the essence of 80s synthwave...",
    timestamp: "2 hours ago",
    likes: 12
  },
  {
    id: 2,
    type: "review",
    itemType: "album",
    title: "After Hours",
    artist: "The Weeknd",
    rating: 4.0,
    content: "Solid album with great production values and emotional depth.",
    timestamp: "1 day ago",
    likes: 8
  },
  {
    id: 3,
    type: "save",
    itemType: "playlist",
    title: "Midnight Vibes",
    creator: "Sarah Johnson",
    tracks: 24,
    timestamp: "3 hours ago"
  },
  {
    id: 4,
    type: "save",
    itemType: "track",
    title: "Save Your Tears",
    artist: "The Weeknd",
    timestamp: "5 hours ago"
  },
  {
    id: 5,
    type: "playlist",
    title: "Road Trip Essentials",
    tracks: 47,
    followers: 23,
    timestamp: "2 days ago"
  }
];

const friendsActivity = [
  {
    id: 6,
    user: { name: "Sarah Johnson", avatar: "/api/placeholder/40/40", username: "sarahj" },
    type: "review",
    itemType: "album",
    title: "folklore",
    artist: "Taylor Swift",
    rating: 5.0,
    content: "Every song tells a story. Pure poetry in musical form.",
    timestamp: "1 hour ago",
    likes: 34,
    isHighlyUpvoted: true
  },
  {
    id: 7,
    user: { name: "Mike Rodriguez", avatar: "/api/placeholder/40/40", username: "mikerod" },
    type: "review",
    itemType: "track",
    title: "Levitating",
    artist: "Dua Lipa",
    rating: 4.0,
    content: "Perfect dance track for any occasion!",
    timestamp: "4 hours ago",
    likes: 16
  },
  {
    id: 8,
    user: { name: "Emma Davis", avatar: "/api/placeholder/40/40", username: "emmad" },
    type: "save",
    itemType: "playlist",
    title: "Study Beats",
    creator: "Lo-Fi Collective",
    tracks: 89,
    timestamp: "6 hours ago"
  },
  {
    id: 9,
    user: { name: "Jordan Kim", avatar: "/api/placeholder/40/40", username: "jordank" },
    type: "annotation",
    track: "Watermelon Sugar",
    artist: "Harry Styles",
    content: "This bridge section at 2:14 gives me chills every time 🎵",
    timestamp: "2:14",
    likes: 7,
    timeAgo: "8 hours ago"
  }
];

const ActivityCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#F9F9F6] border border-[#D9D9D9] rounded-lg p-4 shadow-sm ${className}`}>
    {children}
  </div>
);

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <div key={star} className="relative">
        <div className="w-4 h-4 text-[#D9D9D9]">★</div>
        <div 
          className="absolute top-0 left-0 w-4 h-4 text-[#FFBA00] overflow-hidden"
          style={{ width: `${Math.max(0, Math.min(1, rating - star + 1)) * 100}%` }}
        >
          ★
        </div>
      </div>
    ))}
    <span className="text-sm text-[#1F2C24] ml-1">{rating}</span>
  </div>
);

const UserAvatar = ({ user, size = "w-10 h-10" }: { user: any; size?: string }) => (
  <div className={`${size} rounded-full ring-2 ring-[#FFBA00] overflow-hidden flex-shrink-0`}>
    <Avatar className="w-full h-full">
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className="bg-[#6D9773] text-[#F9F9F9]">
        {user.name.split(' ').map((n: string) => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
  </div>
);

const ActivityItem = ({ activity, isCurrentUser = false }: { activity: any; isCurrentUser?: boolean }) => {
  const renderContent = () => {
    switch (activity.type) {
      case 'review':
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              {!isCurrentUser && <UserAvatar user={activity.user} size="w-8 h-8" />}
              <span className="text-sm text-[#A0A0A0]">
                {isCurrentUser ? 'You reviewed' : `${activity.user.name} reviewed`}
              </span>
              {activity.itemType === 'track' && <Music className="w-4 h-4 text-[#FFBA00]" />}
              {activity.itemType === 'album' && <Album className="w-4 h-4 text-[#FFBA00]" />}
            </div>
            <div className="mb-2">
              <h4 className="font-medium text-[#1F2C24]">{activity.title}</h4>
              <p className="text-sm text-[#A0A0A0]">by {activity.artist}</p>
            </div>
            <RatingStars rating={activity.rating} />
            <p className="text-sm text-[#1F2C24] mt-2 line-clamp-2">{activity.content}</p>
          </>
        );
      case 'save':
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              {!isCurrentUser && <UserAvatar user={activity.user} size="w-8 h-8" />}
              <span className="text-sm text-[#A0A0A0]">
                {isCurrentUser ? 'You saved' : `${activity.user.name} saved`}
              </span>
              {activity.itemType === 'playlist' && <List className="w-4 h-4 text-[#FFBA00]" />}
              {activity.itemType === 'track' && <Music className="w-4 h-4 text-[#FFBA00]" />}
            </div>
            <div className="mb-2">
              <h4 className="font-medium text-[#1F2C24]">{activity.title}</h4>
              {activity.creator && <p className="text-sm text-[#A0A0A0]">by {activity.creator}</p>}
              {activity.artist && <p className="text-sm text-[#A0A0A0]">by {activity.artist}</p>}
              {activity.tracks && <p className="text-sm text-[#A0A0A0]">{activity.tracks} tracks</p>}
            </div>
          </>
        );
      case 'playlist':
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <UserAvatar user={currentUser} size="w-8 h-8" />
              <span className="text-sm text-[#A0A0A0]">You created playlist</span>
              <List className="w-4 h-4 text-[#FFBA00]" />
            </div>
            <div className="mb-2">
              <h4 className="font-medium text-[#1F2C24]">{activity.title}</h4>
              <p className="text-sm text-[#A0A0A0]">{activity.tracks} tracks · {activity.followers} followers</p>
            </div>
          </>
        );
      case 'annotation':
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <UserAvatar user={activity.user} size="w-8 h-8" />
              <span className="text-sm text-[#A0A0A0]">{activity.user.name} annotated</span>
              <Clock className="w-4 h-4 text-[#FFBA00]" />
            </div>
            <div className="mb-2">
              <h4 className="font-medium text-[#1F2C24]">{activity.track}</h4>
              <p className="text-sm text-[#A0A0A0]">by {activity.artist} · at {activity.timestamp}</p>
            </div>
            <p className="text-sm text-[#1F2C24] bg-[#F2F3EF] rounded p-2 mb-2">{activity.content}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ActivityCard className="space-y-3">
      {renderContent()}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#A0A0A0]">{activity.timestamp || activity.timeAgo}</span>
        <div className="flex items-center gap-4">
          {activity.likes !== undefined && (
            <button className="flex items-center gap-1 text-sm text-[#A0A0A0] hover:text-[#6D9773]">
              <Heart className="w-4 h-4" />
              {activity.likes}
            </button>
          )}
          <button className="flex items-center gap-1 text-sm text-[#A0A0A0] hover:text-[#6D9773]">
            <MessageCircle className="w-4 h-4" />
          </button>
          {activity.type === 'save' && (
            <button className="flex items-center gap-1 text-sm text-[#A0A0A0] hover:text-[#6D9773]">
              <Bookmark className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {activity.isHighlyUpvoted && (
        <div className="bg-[#FFBA00]/10 border border-[#FFBA00]/20 rounded-md p-2">
          <span className="text-xs text-[#FFBA00] font-medium">🔥 Highly upvoted</span>
        </div>
      )}
    </ActivityCard>
  );
};

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-[#0C3B2E]">
      <Header/>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F9F9F9] mb-2">Activity</h1>
            <p className="text-[#F9F9F9]/70">Keep track of your music journey</p>
          </div>
          <button className="bg-[#FFBA00] text-[#1F2C24] px-6 py-3 rounded-lg font-bold hover:bg-[#FFBA00]/90 transition-colors flex items-center gap-2 shadow-md">
            <Plus className="w-5 h-5" />
            Log Activity
          </button>
        </div>

        <div className="grid gap-8">
          {/* Your Recent Activity */}
          <div>
            <h2 className="text-2xl font-semibold text-[#F9F9F9] mb-6">Your Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} isCurrentUser={true} />
              ))}
            </div>
          </div>

          {/* Friends' Activity */}
          <div>
            <h2 className="text-2xl font-semibold text-[#F9F9F9] mb-6">Friends' Activity</h2>
            <div className="space-y-4">
              {friendsActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer variant="dark"/>
    </div>
  );
}