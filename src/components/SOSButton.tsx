
import React, { useState } from 'react';
import { AlertCircle, Phone, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface SOSButtonProps {
  className?: string;
}

const SOSButton: React.FC<SOSButtonProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();
  
  const handleSOSClick = () => {
    if (isActivated) return;
    
    setIsExpanded(true);
  };
  
  const handleActivate = () => {
    if (isActivated) return;
    
    setIsActivated(true);
    let count = 5;
    
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(timer);
        triggerSOS();
      }
    }, 1000);
  };
  
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setIsActivated(false);
    setCountdown(5);
  };
  
  const triggerSOS = () => {
    // Here we would implement actual SOS functionality
    // Such as sending location to emergency contacts
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('SOS triggered with location:', { latitude, longitude });
        
        toast({
          title: "Emergency Alert Sent",
          description: "Your location has been shared with emergency contacts",
          variant: "destructive",
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        
        toast({
          title: "Emergency Alert Sent",
          description: "Unable to get precise location, but alert was sent",
          variant: "destructive",
        });
      }
    );
  };
  
  return (
    <div className={cn('fixed z-40 flex items-end justify-end', className)}>
      <div 
        className={cn(
          'flex items-center transition-all duration-300 rounded-full shadow-medium',
          isExpanded ? 'bg-destructive/95 px-5' : 'bg-destructive w-16 h-16'
        )}
      >
        {isExpanded ? (
          <div className="flex items-center justify-between w-full py-3">
            {isActivated ? (
              <>
                <div className="text-destructive-foreground font-semibold">
                  Sending in {countdown}...
                </div>
                <button
                  onClick={handleCancel}
                  className="ml-4 p-2 rounded-full bg-destructive-foreground/20 text-destructive-foreground hover:bg-destructive-foreground/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleActivate}
                  className="flex items-center space-x-2 text-destructive-foreground font-semibold"
                >
                  <AlertCircle className="animate-pulse" size={20} />
                  <span>Confirm Emergency</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="ml-4 p-2 rounded-full bg-destructive-foreground/20 text-destructive-foreground hover:bg-destructive-foreground/30 transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={handleSOSClick}
            className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground"
            aria-label="Emergency SOS Button"
          >
            <Phone size={28} className="animate-pulse-subtle" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SOSButton;
