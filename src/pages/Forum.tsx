
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SafetyForum from '@/components/SafetyForum';
import SOSButton from '@/components/SOSButton';
import CreatePostForm from '@/components/CreatePostForm';
import { Button } from '@/components/ui/button';
import { Plus, FileVideo2 } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/components/AuthProvider';

const Forum = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, requireAuth } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home if not authenticated
    if (!requireAuth()) {
      return;
    }
  }, [requireAuth]);
  
  const handleCreatePostClick = () => {
    if (isAuthenticated) {
      setShowCreatePost(true);
    } else {
      setShowAuthModal(true);
    }
  };
  
  const handlePostCreated = (newPost: any) => {
    setShowCreatePost(false);
    // In a real app, we would update the posts state here
    // For now, we'll rely on the SafetyForum component to handle this
  };
  
  // If not authenticated, this component won't render content
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Community Safety Forum</h1>
              
              <div className="flex items-center gap-2">
                <Link to="/deepfake">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <FileVideo2 size={16} />
                    <span>Deepfake Detection</span>
                  </Button>
                </Link>
                
                <Button 
                  onClick={handleCreatePostClick} 
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Share Information</span>
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Share and discover safety information from women in your community.
            </p>
          </div>
          
          {showCreatePost ? (
            <CreatePostForm 
              onPostCreated={handlePostCreated}
              onCancel={() => setShowCreatePost(false)}
            />
          ) : (
            <SafetyForum />
          )}
        </div>
        
        <SOSButton className="bottom-6 right-6" />
      </main>
      
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            if (showCreatePost === false) {
              setShowCreatePost(true);
            }
          }}
        />
      )}
    </div>
  );
};

export default Forum;
