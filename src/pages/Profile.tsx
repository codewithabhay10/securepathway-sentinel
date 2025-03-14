
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { User, Settings, Bell, Shield, LogOut, ChevronRight, Scan } from 'lucide-react';
import SOSButton from '@/components/SOSButton';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface TrustedContact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
}

const DEMO_CONTACTS: TrustedContact[] = [
  { id: 1, name: "Emma Wilson", phone: "(555) 123-4567", relationship: "Sister" },
  { id: 2, name: "Robert Chen", phone: "(555) 987-6543", relationship: "Friend" },
];

const Profile = () => {
  const [contacts, setContacts] = useState<TrustedContact[]>(DEMO_CONTACTS);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleDeepfakeDetection = () => {
    navigate('/deepfake');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-24">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-safety-100 border-4 border-white shadow-medium flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-safety-600" />
            </div>
            <h1 className="text-2xl font-semibold">Alexandra Park</h1>
            <p className="text-muted-foreground">New York, NY</p>
          </div>
          
          {/* Profile Sections */}
          <div className="flex flex-col space-y-8">
            {/* Trusted Contacts */}
            <div className="glass-panel overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-xl font-medium">Trusted Emergency Contacts</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  These contacts will receive alerts when you trigger an SOS.
                </p>
              </div>
              
              <div className="divide-y">
                {contacts.map(contact => (
                  <div key={contact.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {contact.phone} • {contact.relationship}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="w-full p-4 text-primary font-medium text-left hover:bg-primary/5 transition-colors">
                  + Add New Contact
                </button>
              </div>
            </div>
            
            {/* Settings */}
            <div className="glass-panel overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-xl font-medium">Settings</h2>
              </div>
              
              <div className="divide-y">
                <button className="w-full p-4 flex items-center text-left hover:bg-muted/50 transition-colors">
                  <Bell className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>Notifications</span>
                </button>
                
                <button className="w-full p-4 flex items-center text-left hover:bg-muted/50 transition-colors">
                  <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>Account Settings</span>
                </button>
                
                <button
                  className="w-full p-4 flex items-center text-left hover:bg-muted/50 transition-colors"
                  onClick={handleDeepfakeDetection}
                >
                  <Scan className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>Deepfake Detection</span>
                </button>
                
                <button className="w-full p-4 flex items-center text-left hover:bg-muted/50 transition-colors">
                  <Shield className="w-5 h-5 mr-3 text-muted-foreground" />
                  <span>Privacy & Security</span>
                </button>
                
                <button 
                  className="w-full p-4 flex items-center text-left text-destructive hover:bg-destructive/5 transition-colors"
                  onClick={logout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <SOSButton className="bottom-6 right-6" />
      </main>
    </div>
  );
};

export default Profile;
