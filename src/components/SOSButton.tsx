
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertCircle, Phone, X, UserRound, WifiOff, CheckCircle, Mic, MicOff, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import * as speechCommands from '@tensorflow-models/speech-commands';
import * as tf from '@tensorflow/tfjs';

interface SOSButtonProps {
  className?: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  synced: boolean;
}

// Demo emergency contacts - in a real app, these would be stored in a database or local storage
const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: "Police", phone: "911" }, // Example emergency number
  { name: "John Doe", phone: "+1234567890" }, // Example contact
];

const LOCAL_STORAGE_KEY = 'offline_location_data';

const SOSButton: React.FC<SOSButtonProps> = ({ className }) => {
  // Initialize TensorFlow backend
  useEffect(() => {
    // Set the backend to webgl or cpu to avoid the "No backend found in registry" error
    tf.setBackend('webgl').catch(() => {
      tf.setBackend('cpu').catch(err => {
        console.error("Failed to set TensorFlow backend:", err);
      });
    });
  }, []);

  // Core state variables
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineLocationData, setOfflineLocationData] = useState<LocationData[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // WebRTC state
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCallContact, setCurrentCallContact] = useState<EmergencyContact | null>(null);

  // WebRTC refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const { toast } = useToast();
  const recognizerRef = useRef<speechCommands.SpeechCommandRecognizer | null>(null);
  
  // Function to handle SOS button click
  const handleSOSClick = useCallback(() => {
    if (isActivated) return;
    setIsExpanded(true);
  }, [isActivated]);
  
  // Function to activate SOS countdown
  const handleActivate = useCallback(() => {
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
  }, [isActivated]);
  
  // Function to cancel SOS
  const handleCancel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setIsActivated(false);
    setCountdown(5);
    
    // Close any active WebRTC call
    if (isCallActive) {
      endWebRTCCall();
    }
  }, [isCallActive]);
  
  // Function to store offline location
  const storeOfflineLocation = useCallback((locationData: LocationData) => {
    const updatedData = [...offlineLocationData, locationData];
    setOfflineLocationData(updatedData);
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
      toast({
        title: "Location Stored Offline",
        description: "Your location will be shared when you're back online",
        variant: "default",
      });
    } catch (e) {
      console.error('Error storing location data:', e);
    }
  }, [offlineLocationData, toast]);
  
  // Initialize WebRTC connection
  const initializeWebRTC = useCallback(async () => {
    try {
      // Create local media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      
      // Create RTCPeerConnection
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      };
      
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;
      
      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream);
        }
      });
      
      // Create data channel for location sharing
      const dataChannel = peerConnection.createDataChannel('emergency-data');
      dataChannelRef.current = dataChannel;
      
      dataChannel.onopen = () => {
        console.log('Data channel opened');
        
        // Share location data
        if (location) {
          const locationString = `${location.latitude},${location.longitude}`;
          const googleMapsUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
          
          dataChannel.send(JSON.stringify({
            type: 'location',
            data: {
              coordinates: locationString,
              url: googleMapsUrl,
              timestamp: Date.now()
            }
          }));
        }
      };
      
      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // In a real app, we would send this to a signaling server
          console.log('ICE candidate:', event.candidate);
        }
      };
      
      // Log connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        
        if (peerConnection.connectionState === 'disconnected' || 
            peerConnection.connectionState === 'failed' || 
            peerConnection.connectionState === 'closed') {
          endWebRTCCall();
        }
      };
      
      return true;
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
      toast({
        title: "Communication Error",
        description: "Could not initialize emergency call. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [location, toast]);
  
  // Function to make a WebRTC emergency call
  const makeWebRTCCall = useCallback(async (contact: EmergencyContact, locationStr: string) => {
    try {
      // In a real app, we would connect to a signaling server to establish the connection
      setCurrentCallContact(contact);
      
      const initialized = await initializeWebRTC();
      if (!initialized || !peerConnectionRef.current) {
        return false;
      }
      
      // Create and set local description
      const offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      };
      
      const offer = await peerConnectionRef.current.createOffer(offerOptions);
      await peerConnectionRef.current.setLocalDescription(offer);
      
      // In a real application, you would send this offer to your contact via a signaling server
      console.log(`WebRTC call initiated to ${contact.name} at ${contact.phone}`);
      console.log(`Sharing location: ${locationStr}`);
      
      // Simulate connection (in a real app, we would wait for answer from remote peer)
      setTimeout(() => {
        setIsCallActive(true);
        
        toast({
          title: `Connected to ${contact.name}`,
          description: "Emergency call active. Location has been shared.",
          variant: "destructive",
        });
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('WebRTC call failed:', error);
      setCurrentCallContact(null);
      return false;
    }
  }, [initializeWebRTC, toast]);
  
  // Function to end a WebRTC call
  const endWebRTCCall = useCallback(() => {
    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Stop all tracks in local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    setIsCallActive(false);
    setCurrentCallContact(null);
  }, []);
  
  // Fallback to SMS if WebRTC fails
  const sendSMS = useCallback(async (contact: EmergencyContact, locationStr: string) => {
    try {
      console.log(`Sending SMS to ${contact.name} at ${contact.phone}`);
      console.log(`SMS Content: Emergency alert! My location: ${locationStr}`);
      
      // In a real implementation, we would make an API call to an SMS service
      
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
  }, [toast]);
  
  // Function to trigger SOS actions
  const triggerSOS = useCallback(async () => {
    // Get current location
    let locationStr = "Unknown location";
    
    if (location) {
      locationStr = `${location.latitude},${location.longitude}`;
      const googleMapsUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
      locationStr = `${locationStr} (${googleMapsUrl})`;
    }
    
    // If offline, store location for later and notify user
    if (!navigator.onLine) {
      if (location) {
        const locationData: LocationData = {
          ...location,
          timestamp: Date.now(),
          synced: false
        };
        storeOfflineLocation(locationData);
      }
      
      toast({
        title: "Device Offline",
        description: "Your location has been saved and will be shared when you're back online",
        variant: "destructive",
      });
      return;
    }
    
    // Alert method based on connectivity
    let successCount = 0;
    
    for (const contact of EMERGENCY_CONTACTS) {
      if (isOnline) {
        // Try WebRTC call first when online
        const webrtcSuccess = await makeWebRTCCall(contact, locationStr);
        if (webrtcSuccess) {
          successCount++;
          break; // Only need one successful WebRTC call
        } else {
          // Fallback to SMS if WebRTC fails
          const smsSuccess = await sendSMS(contact, locationStr);
          if (smsSuccess) successCount++;
        }
      } else {
        // Use SMS when offline
        const smsSuccess = await sendSMS(contact, locationStr);
        if (smsSuccess) successCount++;
      }
    }
    
    // Display overall status if no WebRTC call is active
    if (!isCallActive) {
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
    }
  }, [location, isOnline, isCallActive, storeOfflineLocation, makeWebRTCCall, sendSMS, toast]);
  
  // Sync offline data when back online
  const syncOfflineData = useCallback(async () => {
    if (!navigator.onLine || offlineLocationData.length === 0) return;
    
    const unsyncedData = offlineLocationData.filter(data => !data.synced);
    if (unsyncedData.length === 0) return;
    
    let syncedCount = 0;
    const updatedData = [...offlineLocationData];
    
    // Process each unsynced location
    for (const data of unsyncedData) {
      try {
        // Send emergency alerts with stored location data
        const locationStr = `${data.latitude},${data.longitude}`;
        const googleMapsUrl = `https://maps.google.com/maps?q=${data.latitude},${data.longitude}`;
        const fullLocationStr = `${locationStr} (${googleMapsUrl})`;
        
        // Try to send alerts for the stored location
        for (const contact of EMERGENCY_CONTACTS) {
          // Use SMS for stored offline data (WebRTC needs a live location)
          const success = await sendSMS(contact, fullLocationStr);
          if (success) syncedCount++;
        }
        
        // Mark this data as synced
        const index = updatedData.findIndex(
          item => item.timestamp === data.timestamp && 
                 item.latitude === data.latitude && 
                 item.longitude === data.longitude
        );
        
        if (index !== -1) {
          updatedData[index] = { ...updatedData[index], synced: true };
        }
      } catch (err) {
        console.error('Error syncing location data:', err);
      }
    }
    
    // Update storage with synced status
    setOfflineLocationData(updatedData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
    
    if (syncedCount > 0) {
      toast({
        title: "Location Data Synced",
        description: `Sent ${syncedCount} delayed emergency alert(s) with your stored location`,
        variant: "default",
      });
    }
  }, [offlineLocationData, sendSMS, toast]);
  
  // Load offline location data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as LocationData[];
        setOfflineLocationData(parsedData);
      } catch (e) {
        console.error('Error parsing stored location data:', e);
      }
    }
  }, []);
  
  // Set up speech recognition
  useEffect(() => {
    let recognizer: speechCommands.SpeechCommandRecognizer;
    
    const loadModel = async () => {
      try {
        // Ensure TensorFlow backend is set
        await tf.ready();
        console.log('TensorFlow backend ready:', tf.getBackend());
        
        // Create the recognizer
        recognizer = speechCommands.create(
          'BROWSER_FFT',
          undefined,
          undefined,
          undefined
        );
        
        // Load the model
        await recognizer.ensureModelLoaded();
        recognizerRef.current = recognizer;
        
        // Toast when model is loaded
        toast({
          title: "Voice Detection Ready",
          description: "Say 'help' to trigger SOS",
          variant: "default",
        });
        
        console.log('Speech commands model loaded');
      } catch (error) {
        console.error('Error loading speech commands model:', error);
        toast({
          title: "Voice Detection Error",
          description: "Could not load voice recognition model",
          variant: "destructive",
        });
      }
    };
    
    loadModel();
    
    return () => {
      // Clean up
      if (recognizerRef.current) {
        recognizerRef.current.stopListening();
      }
    };
  }, [toast]);
  
  // Listen for voice commands when enabled
  useEffect(() => {
    const startListening = async () => {
      if (!recognizerRef.current || !voiceEnabled) return;
      
      try {
        await recognizerRef.current.listen(
          async (result) => {
            // Get the top prediction
            const scores = result.scores as Float32Array;
            let maxScore = Number.MIN_VALUE;
            let maxScoreIndex = -1;
            
            for (let i = 0; i < scores.length; i++) {
              if (scores[i] > maxScore) {
                maxScore = scores[i];
                maxScoreIndex = i;
              }
            }
            
            const words = recognizerRef.current?.wordLabels();
            
            if (words && maxScoreIndex >= 0 && words[maxScoreIndex] === 'help' && maxScore > 0.8) {
              console.log('Help detected with confidence:', maxScore);
              // Trigger SOS if the word is 'help' with high confidence
              handleSOSClick();
              handleActivate();
              
              toast({
                title: "Voice Command Detected",
                description: "SOS triggered by voice command",
                variant: "destructive",
              });
            }
            
            return Promise.resolve();
          },
          {
            includeSpectrogram: false,
            probabilityThreshold: 0.7,
            invokeCallbackOnNoiseAndUnknown: false,
            overlapFactor: 0.5
          }
        );
        
        setIsListening(true);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        toast({
          title: "Voice Detection Error",
          description: "Could not start voice recognition",
          variant: "destructive",
        });
        setIsListening(false);
        setVoiceEnabled(false);
      }
    };
    
    const stopListening = async () => {
      if (!recognizerRef.current) return;
      
      try {
        await recognizerRef.current.stopListening();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
      }
    };
    
    if (voiceEnabled) {
      startListening();
    } else {
      stopListening();
    }
    
    return () => {
      stopListening();
    };
  }, [voiceEnabled, handleSOSClick, handleActivate, toast]);
  
  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      const nextOnlineState = navigator.onLine;
      setIsOnline(nextOnlineState);
      
      // When coming back online, try to sync stored location data
      if (nextOnlineState && offlineLocationData.length > 0) {
        syncOfflineData();
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [offlineLocationData, syncOfflineData]);

  // Get current location
  useEffect(() => {
    if (isActivated) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          setLocation(newLocation);
          
          // If offline, store the location data for later syncing
          if (!navigator.onLine) {
            const locationData: LocationData = {
              ...newLocation,
              timestamp: Date.now(),
              synced: false
            };
            
            storeOfflineLocation(locationData);
          }
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
  }, [isActivated, storeOfflineLocation, toast]);
  
  // Sync offline data when online
  useEffect(() => {
    // Try to sync when component mounts if we're online
    if (navigator.onLine && offlineLocationData.some(data => !data.synced)) {
      syncOfflineData();
    }
  }, [syncOfflineData, offlineLocationData]);
  
  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    setVoiceEnabled(!voiceEnabled);
    
    toast({
      title: voiceEnabled ? "Voice Detection Disabled" : "Voice Detection Enabled",
      description: voiceEnabled ? "Voice commands turned off" : "Say 'help' to trigger SOS",
      variant: "default",
    });
  };
  
  return (
    <div className={cn('fixed z-40 flex flex-col items-end justify-end gap-2', className)}>
      {/* Active call overlay */}
      {isCallActive && currentCallContact && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
          <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Phone size={36} className="text-green-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold">Emergency Call Active</h2>
              <p className="text-muted-foreground text-center">
                Connected to {currentCallContact.name}
                <br />
                {currentCallContact.phone}
              </p>
              {location && (
                <div className="text-sm text-center mt-2 text-muted-foreground">
                  Your location has been shared:
                  <br />
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </div>
              )}
              <Button 
                variant="destructive" 
                className="mt-6"
                onClick={endWebRTCCall}
              >
                End Emergency Call
              </Button>
            </div>
          </div>
        </div>
      )}
    
      {/* Voice activation toggle button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'rounded-full shadow-medium',
          voiceEnabled ? 'bg-green-100 border-green-500' : 'bg-gray-100'
        )}
        onClick={toggleVoiceRecognition}
      >
        {voiceEnabled ? (
          <Mic size={20} className="text-green-600 animate-pulse" />
        ) : (
          <MicOff size={20} />
        )}
      </Button>
      
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
      
      {/* Show offline status badge if there's unsynced data */}
      {offlineLocationData.some(data => !data.synced) && (
        <div className="absolute bottom-20 right-0 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-md">
          <WifiOff size={12} />
          <span>{offlineLocationData.filter(d => !d.synced).length} pending alert(s)</span>
        </div>
      )}
      
      {/* Emergency contacts display */}
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
      
      {/* Voice recognition status badge */}
      {voiceEnabled && (
        <div className="absolute bottom-28 right-0 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-md">
          <Mic size={12} className={isListening ? "animate-pulse" : ""} />
          <span>Say "help" to trigger SOS</span>
        </div>
      )}
    </div>
  );
};

export default SOSButton;
