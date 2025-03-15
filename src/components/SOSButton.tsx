
import React, { useState, useEffect } from 'react';
import { AlertCircle, Phone, X, UserRound, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface SOSButtonProps {
  className?: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
}

// Demo emergency contacts - in a real app, these would be stored in a database or local storage
const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: "Police", phone: "911" }, // Example emergency number
  { name: "John Doe", phone: "+1234567890" }, // Example contact
];

const SOSButton: React.FC<SOSButtonProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  
  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Get current location
  useEffect(() => {
    if (isActivated) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Could not get your precise location",
            variant: "destructive",
          });
        }
      );
    }
  }, [isActivated, toast]);
  
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
  
  const makeVoIPCall = async (contact: EmergencyContact, locationStr: string) => {
    try {
      console.log(`Making VoIP call to ${contact.name} at ${contact.phone}`);
      console.log(`Sharing location: ${locationStr}`);
      
      // In a real implementation, we would make an API call to Twilio here
      // Example of how the call might be structured:
      // const response = await fetch('/api/make-call', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     to: contact.phone,
      //     message: `Emergency alert from SecurePathway. Location: ${locationStr}`
      //   })
      // });
      
      toast({
        title: `Calling ${contact.name}`,
        description: "Emergency VoIP call initiated",
        variant: "destructive",
      });
      
      return true;
    } catch (error) {
      console.error('VoIP call failed:', error);
      return false;
    }
  };
  
  const sendSMS = async (contact: EmergencyContact, locationStr: string) => {
    try {
      console.log(`Sending SMS to ${contact.name} at ${contact.phone}`);
      console.log(`SMS Content: Emergency alert! My location: ${locationStr}`);
      
      // In a real implementation, we would make an API call to Twilio SMS here
      // Example of how it might be structured:
      // const response = await fetch('/api/send-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     to: contact.phone,
      //     message: `Emergency alert! My location: ${locationStr}`
      //   })
      // });
      
      toast({
        title: `SMS sent to ${contact.name}`,
        description: "Emergency SMS message sent",
        variant: "destructive",
      });
      
      return true;
    } catch (error) {
      console.error('SMS failed:', error);
      return false;
    }
  };
  
  const triggerSOS = async () => {
    // Get current location
    let locationStr = "Unknown location";
    
    if (location) {
      locationStr = `${location.latitude},${location.longitude}`;
      const googleMapsUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
      locationStr = `${locationStr} (${googleMapsUrl})`;
    }
    
    // Alert method based on connectivity
    let successCount = 0;
    
    for (const contact of EMERGENCY_CONTACTS) {
      if (isOnline) {
        // Try VoIP call first when online
        const voipSuccess = await makeVoIPCall(contact, locationStr);
        if (voipSuccess) {
          successCount++;
        } else {
          // Fallback to SMS if VoIP fails
          const smsSuccess = await sendSMS(contact, locationStr);
          if (smsSuccess) successCount++;
        }
      } else {
        // Use SMS when offline
        const smsSuccess = await sendSMS(contact, locationStr);
        if (smsSuccess) successCount++;
      }
    }
    
    // Display overall status
    if (successCount > 0) {
      toast({
        title: "Emergency Alert Sent",
        description: `Alerts sent to ${successCount} contacts with your location`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Alert Failed",
        description: "Could not send emergency alerts. Please try again or call emergency services directly.",
        variant: "destructive",
      });
    }
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
                <div className="text-destructive-foreground font-semibold flex items-center gap-2">
                  {isOnline ? (
                    <>Sending in {countdown}...</>
                  ) : (
                    <><WifiOff size={16} className="text-yellow-200" /> Offline mode: SMS only</>
                  )}
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
      
      {/* Emergency contacts display (would be implemented in a real app) */}
      {isExpanded && !isActivated && (
        <div className="absolute bottom-20 right-0 bg-white p-4 rounded-lg shadow-lg w-72">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <UserRound size={16} />
            Emergency Contacts
          </h3>
          <ul className="text-xs space-y-2">
            {EMERGENCY_CONTACTS.map((contact, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{contact.name}</span>
                <span className="text-muted-foreground">{contact.phone}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-muted-foreground">
            These contacts will be alerted with your location
          </div>
        </div>
      )}
    </div>
  );
};

export default SOSButton;
