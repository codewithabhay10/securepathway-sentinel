
import React, { useState } from 'react';
import { MessageSquare, MapPin, ThumbsUp, Flag, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafetyPost {
  id: number;
  user: string;
  avatar: string;
  location: string;
  coordinates: { lat: number; lng: number };
  content: string;
  rating: 'safe' | 'caution' | 'unsafe';
  timestamp: string;
  likes: number;
  replies: number;
}

const DEMO_POSTS: SafetyPost[] = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "SJ",
    location: "Central Park, New York",
    coordinates: { lat: 40.7812, lng: -73.9665 },
    content: "The main paths in Central Park are well-lit and have regular security patrols. I frequently jog here in the early evening and feel safe. There are emergency phones throughout the park.",
    rating: 'safe',
    timestamp: "2 hours ago",
    likes: 24,
    replies: 5
  },
  {
    id: 2,
    user: "Madison Lee",
    avatar: "ML",
    location: "Broadway & 34th St",
    coordinates: { lat: 40.7506, lng: -73.9878 },
    content: "This area gets very dark after sunset with some broken street lights. I'd recommend avoiding the side streets off Broadway after 10pm. Main street is generally okay but stay alert.",
    rating: 'caution',
    timestamp: "Yesterday",
    likes: 17,
    replies: 8
  },
  {
    id: 3,
    user: "Taylor Morgan",
    avatar: "TM",
    location: "Grand Central Terminal",
    coordinates: { lat: 40.7527, lng: -73.9772 },
    content: "Grand Central has security personnel present 24/7 and is well-monitored. Very busy during the day, but even late at night it feels secure with constant police presence.",
    rating: 'safe',
    timestamp: "3 days ago",
    likes: 42,
    replies: 3
  }
];

const SafetyForum = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'safe' | 'caution' | 'unsafe'>('all');
  const [posts, setPosts] = useState<SafetyPost[]>(DEMO_POSTS);
  
  const filteredPosts = posts.filter(post => {
    // Apply search filter
    if (searchQuery && !post.location.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !post.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply safety rating filter
    if (filter !== 'all' && post.rating !== filter) {
      return false;
    }
    
    return true;
  });
  
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by location or content..."
              className="w-full pl-10 pr-4 py-3 rounded-full bg-background border shadow-soft focus:ring-2 focus:ring-primary/20 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 mask-fade-out-right">
            <button 
              onClick={() => setFilter('all')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                filter === 'all' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              All Areas
            </button>
            <button 
              onClick={() => setFilter('safe')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                filter === 'safe' 
                  ? "bg-green-500 text-white" 
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              )}
            >
              Safe Areas
            </button>
            <button 
              onClick={() => setFilter('caution')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                filter === 'caution' 
                  ? "bg-amber-500 text-white" 
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              )}
            >
              Use Caution
            </button>
            <button 
              onClick={() => setFilter('unsafe')}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                filter === 'unsafe' 
                  ? "bg-red-500 text-white" 
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              )}
            >
              Avoid Areas
            </button>
          </div>
        </div>
        
        {/* New Post Button */}
        <button className="flex items-center justify-center space-x-2 w-full p-4 rounded-lg border border-dashed border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
          <Plus size={18} />
          <span>Share Safety Information</span>
        </button>
        
        {/* Posts */}
        <div className="flex flex-col space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center rounded-lg border bg-muted/30">
              <p className="text-muted-foreground">No results found for your search.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="glass-panel-hover overflow-hidden group">
                <div className="p-4">
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                        {post.avatar}
                      </div>
                      <div>
                        <h3 className="font-medium">{post.user}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin size={14} className="mr-1" />
                          {post.location}
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      post.rating === 'safe' && "bg-green-100 text-green-800",
                      post.rating === 'caution' && "bg-amber-100 text-amber-800",
                      post.rating === 'unsafe' && "bg-red-100 text-red-800"
                    )}>
                      {post.rating === 'safe' && "Safe Area"}
                      {post.rating === 'caution' && "Use Caution"}
                      {post.rating === 'unsafe' && "Avoid Area"}
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <p className="mb-4">{post.content}</p>
                  
                  {/* Post Footer */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex space-x-4">
                      <button 
                        className="flex items-center space-x-1 hover:text-primary transition-colors"
                        onClick={() => handleLike(post.id)}
                      >
                        <ThumbsUp size={16} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                        <MessageSquare size={16} />
                        <span>{post.replies}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-destructive transition-colors">
                        <Flag size={16} />
                        <span>Report</span>
                      </button>
                    </div>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyForum;
