
import React from 'react';
import Navbar from '@/components/Navbar';
import SafetyForum from '@/components/SafetyForum';
import SOSButton from '@/components/SOSButton';

const Forum = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col space-y-4 mb-6">
            <h1 className="text-2xl font-semibold">Community Safety Forum</h1>
            <p className="text-muted-foreground">
              Share and discover safety information from women in your community.
            </p>
          </div>
          
          <SafetyForum />
        </div>
        
        <SOSButton className="bottom-6 right-6" />
      </main>
    </div>
  );
};

export default Forum;
