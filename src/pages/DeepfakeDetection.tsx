
import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Upload, ImageIcon, FileVideo2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SOSButton from '@/components/SOSButton';
import DeepfakeResult from '@/components/DeepfakeResult';

const DeepfakeDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    isDeepfake: boolean | null;
    confidence: number;
    details: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    
    if (selectedFile) {
      const fileType = selectedFile.type;
      // Check if file is an image or video
      if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or video file.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should be less than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
    }
  };

  const simulateAnalysis = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 500);
    
    // Simulate analysis completion after 4-6 seconds
    const duration = 4000 + Math.random() * 2000;
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // For demo purposes, randomly determine if it's a deepfake
      // In a real implementation, this would be the result from the AI model
      const isDeepfake = Math.random() > 0.5;
      const confidence = 70 + Math.random() * 25;
      
      setResult({
        isDeepfake,
        confidence,
        details: isDeepfake 
          ? "This media shows signs of manipulation typical of deepfakes, including inconsistent lighting, unnatural facial movements, and digital artifacts."
          : "No significant indicators of manipulation were detected. The media appears to be authentic."
      });
      
      setIsAnalyzing(false);
    }, duration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateAnalysis();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile) {
      const fileType = droppedFile.type;
      if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or video file.",
          variant: "destructive"
        });
        return;
      }
      
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should be less than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(droppedFile);
      setResult(null);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = file && file.type.startsWith('image/');
  const isVideo = file && file.type.startsWith('video/');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-5xl mx-auto px-4 pt-20 pb-24">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Deepfake Detection</h1>
            <p className="text-muted-foreground">
              Upload images or videos to check if they've been manipulated using AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upload Media</CardTitle>
                <CardDescription>
                  Upload an image or video file to analyze for potential manipulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload size={16} />
                        <span>Upload File</span>
                      </TabsTrigger>
                      <TabsTrigger value="camera" className="flex items-center gap-2">
                        <ImageIcon size={16} />
                        <span>Camera</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload">
                      <div 
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {!file && (
                          <div className="flex flex-col items-center justify-center py-6">
                            <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
                            <p className="text-xl font-medium mb-1">Drag and drop or click to upload</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              Supports images and videos up to 10MB
                            </p>
                            <Button type="button" variant="secondary" onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}>
                              Select File
                            </Button>
                          </div>
                        )}
                        
                        {file && (
                          <div className="flex flex-col items-center">
                            {isImage && (
                              <div className="my-4 max-h-[300px] overflow-hidden rounded-md">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt="Preview" 
                                  className="max-h-[300px] object-contain"
                                />
                              </div>
                            )}
                            
                            {isVideo && (
                              <div className="my-4 max-h-[300px] overflow-hidden rounded-md">
                                <video 
                                  src={URL.createObjectURL(file)} 
                                  controls 
                                  className="max-h-[300px] object-contain"
                                />
                              </div>
                            )}
                            
                            <div className="text-sm mb-2">
                              <span className="font-medium">{file.name}</span> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </div>
                            
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" size="sm" onClick={(e) => {
                                e.stopPropagation();
                                resetAnalysis();
                              }}>
                                Remove
                              </Button>
                              <Button type="button" variant="outline" size="sm" onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}>
                                Change File
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <Input
                          ref={fileInputRef}
                          type="file" 
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="camera">
                      <div className="p-6 border rounded-lg text-center">
                        <p className="text-muted-foreground mb-4">
                          Camera access will be requested when you click the button below
                        </p>
                        <Button type="button" variant="outline" disabled>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Take Photo/Video (Coming Soon)
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6 flex flex-col gap-4">
                    {isAnalyzing && (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Analyzing...</span>
                          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      disabled={!file || isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Media'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center text-primary text-sm font-bold">1</div>
                      <div>
                        <h3 className="font-medium mb-1">Upload Media</h3>
                        <p className="text-sm text-muted-foreground">Upload an image or video that you want to verify</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center text-primary text-sm font-bold">2</div>
                      <div>
                        <h3 className="font-medium mb-1">AI Analysis</h3>
                        <p className="text-sm text-muted-foreground">Our AI model will analyze the content for manipulation indicators</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center text-primary text-sm font-bold">3</div>
                      <div>
                        <h3 className="font-medium mb-1">Get Results</h3>
                        <p className="text-sm text-muted-foreground">View detailed results showing whether the media is likely manipulated</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Important Note</h3>
                  <p className="text-sm text-amber-700">
                    While our technology can detect many forms of manipulated media, no detection system is 100% accurate. Always verify important media through multiple sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {result && <DeepfakeResult result={result} />}
          
        </div>
      </main>
      
      <SOSButton className="bottom-6 right-6" />
    </div>
  );
};

export default DeepfakeDetection;
