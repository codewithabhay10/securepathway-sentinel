
import React from 'react';
import Navbar from '@/components/Navbar';
import Map from '@/components/Map';
import SOSButton from '@/components/SOSButton';

const MapView = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-6 px-4 h-[calc(100vh-80px)]">
        <div className="container max-w-7xl mx-auto h-full">
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Safety Map</h1>
              <div className="flex space-x-2">
                <select className="bg-background border rounded-lg px-3 py-1 text-sm">
                  <option>All Safety Markers</option>
                  <option>Safe Areas Only</option>
                  <option>Caution Areas</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden rounded-xl border shadow-soft">
              <Map className="w-full h-full" />
            </div>
          </div>
        </div>
        
        <SOSButton className="bottom-6 right-6" />
      </main>
    </div>
  );
};

export default MapView;
