
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { User, Settings, Bell, Shield, LogOut, ChevronRight, Pencil, Plus, Trash2, Phone } from 'lucide-react';
import SOSButton from '@/components/SOSButton';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';

interface TrustedContact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
}

// Create a schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(7, { message: "Please enter a valid phone number." }),
  relationship: z.string().min(1, { message: "Please specify a relationship." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

// Emergency contacts key for localStorage
const EMERGENCY_CONTACTS_KEY = 'emergency_contacts';

const Profile = () => {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);
  const { logout } = useAuth();
  const { toast } = useToast();
  
  // Initialize the form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      relationship: '',
    },
  });

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem(EMERGENCY_CONTACTS_KEY);
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Initial demo contacts if none exist
      const initialContacts = [
        { id: 1, name: "Emma Wilson", phone: "(555) 123-4567", relationship: "Sister" },
        { id: 2, name: "Robert Chen", phone: "(555) 987-6543", relationship: "Friend" }
      ];
      setContacts(initialContacts);
      localStorage.setItem(EMERGENCY_CONTACTS_KEY, JSON.stringify(initialContacts));
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem(EMERGENCY_CONTACTS_KEY, JSON.stringify(contacts));
    }
  }, [contacts]);

  const handleAddContact = () => {
    setEditingContact(null);
    form.reset({
      name: '',
      phone: '',
      relationship: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditContact = (contact: TrustedContact) => {
    setEditingContact(contact);
    form.reset({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteContact = (contactId: number) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    setContacts(updatedContacts);
    
    toast({
      title: "Contact removed",
      description: "Emergency contact has been removed from your list.",
    });
  };

  const onSubmit = (data: ContactFormValues) => {
    if (editingContact) {
      // Update existing contact - using the spread operator to ensure all fields are set
      const updatedContacts = contacts.map(contact => 
        contact.id === editingContact.id 
          ? { 
              id: editingContact.id,
              name: data.name,
              phone: data.phone,
              relationship: data.relationship
            } 
          : contact
      );
      setContacts(updatedContacts);
      
      toast({
        title: "Contact updated",
        description: "Your emergency contact has been updated successfully.",
      });
    } else {
      // Add new contact - ensure all fields are explicitly assigned
      const newContact: TrustedContact = {
        id: Date.now(),
        name: data.name,
        phone: data.phone,
        relationship: data.relationship
      };
      setContacts([...contacts, newContact]);
      
      toast({
        title: "Contact added",
        description: "New emergency contact has been added to your list.",
      });
    }
    
    setIsDialogOpen(false);
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
              <div className="p-5 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-medium">Trusted Emergency Contacts</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    These contacts will receive alerts when you trigger an SOS.
                  </p>
                </div>
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
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditContact(contact)}>
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  className="w-full p-4 text-primary font-medium text-left hover:bg-primary/5 transition-colors flex items-center"
                  onClick={handleAddContact}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add New Contact
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
        
        {/* Contact Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Edit Emergency Contact" : "Add Emergency Contact"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="Friend, Family, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingContact ? "Save Changes" : "Add Contact"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Profile;
