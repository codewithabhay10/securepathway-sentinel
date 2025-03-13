
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { MapPin, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthProvider';

interface PostFormValues {
  location: string;
  content: string;
  safetyRating: 'safe' | 'caution' | 'unsafe';
}

interface CreatePostFormProps {
  onPostCreated: (post: any) => void;
  onCancel: () => void;
}

const CreatePostForm = ({ onPostCreated, onCancel }: CreatePostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const form = useForm<PostFormValues>({
    defaultValues: {
      location: '',
      content: '',
      safetyRating: 'safe',
    },
  });
  
  const onSubmit = async (values: PostFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to share safety information.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        id: Date.now(),
        user: localStorage.getItem('userName') || 'Anonymous User',
        avatar: localStorage.getItem('userName')?.charAt(0) || 'A',
        location: values.location,
        coordinates: { lat: 40.7128, lng: -74.0060 }, // Mock coordinates
        content: values.content,
        rating: values.safetyRating,
        timestamp: 'Just now',
        likes: 0,
        replies: 0,
      };
      
      onPostCreated(newPost);
      
      toast({
        title: "Post created successfully",
        description: "Your safety information has been shared with the community.",
      });
      
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-medium mb-4">Share Safety Information</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <FormControl>
                    <Input 
                      placeholder="Enter location name or address" 
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Safety Information</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share details about safety in this area..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="safetyRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Safety Rating</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => form.setValue('safetyRating', 'safe')}
                      className={`flex-1 py-2 rounded-md ${
                        field.value === 'safe' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      Safe
                    </button>
                    <button
                      type="button"
                      onClick={() => form.setValue('safetyRating', 'caution')}
                      className={`flex-1 py-2 rounded-md ${
                        field.value === 'caution' 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                    >
                      Caution
                    </button>
                    <button
                      type="button"
                      onClick={() => form.setValue('safetyRating', 'unsafe')}
                      className={`flex-1 py-2 rounded-md ${
                        field.value === 'unsafe' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      Unsafe
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePostForm;
