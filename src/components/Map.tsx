
import React, { useEffect, useRef, useState } from 'react';
import { Search, Compass, MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // For demo, set a default location (this would be user location in real app)
      setUserLocation({ lat: 40.7128, lng: -74.0060 }); // New York
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log('Current location:', { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchQuery);
    // Actual implementation would use geocoding API
  };
  
  const safetyMarkers = [
    { id: 1, lat: 40.7128, lng: -74.0060, type: 'safe', title: 'Monitored Area' },
    { id: 2, lat: 40.7228, lng: -74.0050, type: 'caution', title: 'Low Lighting' },
    { id: 3, lat: 40.7138, lng: -73.9940, type: 'safe', title: 'Police Station' },
  ];
  
  return (
    <div className={cn('relative w-full h-full rounded-lg overflow-hidden', className)}>
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-background/90 backdrop-blur-sm border shadow-soft focus:ring-2 focus:ring-primary/20 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-1.5 rounded-full"
          >
            <Navigation size={16} />
          </button>
        </form>
      </div>
      
      {/* Map Controls */}
      <div className="absolute right-4 bottom-24 flex flex-col space-y-2 z-10">
        <button
          className="p-3 rounded-full bg-background/90 backdrop-blur-sm border shadow-soft hover:bg-background/100 transition-colors"
          onClick={handleGetCurrentLocation}
        >
          <Compass size={20} />
        </button>
      </div>
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className={cn(
          'w-full h-full bg-muted/20',
          isLoading ? 'animate-pulse' : ''
        )}
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="mt-4 text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full bg-[#f2f5f8]">
            {/* Placeholder for actual map implementation */}
            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-74.0060,40.7128,13,0/1200x800?access_token=pk.example')] bg-cover bg-center opacity-80" />
            
            {/* Safety markers */}
            {safetyMarkers.map(marker => (
              <div 
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ 
                  left: `${(marker.lng + 74.01) * 1000}px`, 
                  top: `${(40.73 - marker.lat) * 1000}px`
                }}
              >
                <div 
                  className={cn(
                    "flex flex-col items-center",
                    marker.type === 'safe' ? 'text-green-600' : 'text-amber-500'
                  )}
                >
                  <MapPin className="w-6 h-6" />
                  <div className="mt-1 px-2 py-1 rounded-md bg-background/90 backdrop-blur-sm text-xs font-medium shadow-soft">
                    {marker.title}
                  </div>
                </div>
              </div>
            ))}
            
            {/* User location marker */}
            {userLocation && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                style={{ 
                  left: `${(userLocation.lng + 74.01) * 1000}px`, 
                  top: `${(40.73 - userLocation.lat) * 1000}px`
                }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse"></div>
                  <div className="w-4 h-4 bg-primary border-2 border-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Safe Route Info (simplified for demo) */}
      <div className="absolute left-4 right-4 bottom-4 glass-panel p-4 animate-slide-up">
        <h3 className="font-medium mb-2">Recommended Safe Route</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <p className="text-sm">5th Avenue → Madison Avenue → 32nd Street</p>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="font-medium text-green-600">Safer route</span> • Well lit • 24/7 cameras • 12 min walk
        </div>
      </div>
    </div>
  );
};

export default Map;
