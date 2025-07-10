import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MousePointer, Eye, Info, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createSession, trackClick, requestLocation, getLocationString, getBrowserInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Image } from "@shared/schema";

interface ImageViewerProps {
  onShowPrivacy: () => void;
}

export default function ImageViewer({ onShowPrivacy }: ImageViewerProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const { toast } = useToast();

  const { data: activeImage, isLoading, refetch } = useQuery({
    queryKey: ["/api/images/active"],
    queryFn: async () => {
      const response = await fetch("/api/images/active");
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch active image");
      }
      return response.json() as Promise<Image>;
    },
  });

  useEffect(() => {
    // Create session on component mount
    const initSession = async () => {
      try {
        const session = await createSession();
        setSessionId(session.id);
      } catch (error) {
        console.error("Failed to create session:", error);
        toast({
          title: "Session Error",
          description: "Failed to initialize tracking session.",
          variant: "destructive",
        });
      }
    };

    initSession();
  }, [toast]);

  const handleImageClick = async (event: React.MouseEvent<HTMLImageElement>) => {
    if (!activeImage || !sessionId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = Math.round(event.clientX - rect.left);
    const clickY = Math.round(event.clientY - rect.top);

    try {
      const { browser, device } = getBrowserInfo();
      let locationString = null;

      if (userLocation) {
        locationString = await getLocationString(userLocation.latitude, userLocation.longitude);
      }

      await trackClick({
        imageId: activeImage.id,
        sessionId,
        clickX,
        clickY,
        userAgent: navigator.userAgent,
        location: locationString,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        device,
        browser,
      });

      // Refetch to update click count
      refetch();

      toast({
        title: "Click Tracked",
        description: `Click recorded at position (${clickX}, ${clickY})`,
      });
    } catch (error) {
      console.error("Failed to track click:", error);
      toast({
        title: "Tracking Error",
        description: "Failed to record click data.",
        variant: "destructive",
      });
    }
  };

  const handleEnableLocation = async () => {
    try {
      const location = await requestLocation();
      setUserLocation(location);
      setLocationEnabled(true);
      
      toast({
        title: "Location Enabled",
        description: "Location tracking has been enabled for enhanced analytics.",
      });
    } catch (error) {
      console.error("Failed to get location:", error);
      toast({
        title: "Location Error",
        description: "Failed to access location. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!activeImage) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Image</h2>
        <p className="text-gray-600">No image is currently set as active. Please upload and activate an image in the Admin Panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Educational Research Notice:</strong> This platform collects anonymized interaction data for educational analysis. 
          By clicking on images, you consent to location tracking (if enabled) and click analytics.{" "}
          <button 
            onClick={onShowPrivacy}
            className="text-blue-600 underline ml-1 hover:text-blue-700"
          >
            Learn more
          </button>
        </AlertDescription>
      </Alert>

      {/* Image Display Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Image</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <MousePointer className="h-4 w-4" />
                <span>{activeImage.clickCount.toLocaleString()} clicks</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{activeImage.viewCount.toLocaleString()} views</span>
              </span>
            </div>
          </div>
          
          {/* Image Container */}
          <div className="relative group cursor-pointer">
            <img 
              src={`/api/images/${activeImage.filename}/file`}
              alt={activeImage.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-[1.02]"
              onClick={handleImageClick}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-lg"></div>
            
            {/* Click Indicator */}
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-sm font-medium text-gray-700">Click to track</span>
            </div>
          </div>

          {/* Image Metadata */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Upload Date</div>
              <div className="text-sm font-semibold text-gray-900 mt-1">
                {new Date(activeImage.uploadedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">File Size</div>
              <div className="text-sm font-semibold text-gray-900 mt-1">
                {(activeImage.size / (1024 * 1024)).toFixed(1)} MB
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</div>
              <div className="text-sm font-semibold text-gray-900 mt-1">{activeImage.title}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Permission Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="text-accent h-5 w-5" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Location Tracking</h3>
                <p className="text-sm text-gray-600">
                  {locationEnabled 
                    ? "Location tracking is enabled for enhanced analytics" 
                    : "Enable location data for enhanced analytics"
                  }
                </p>
              </div>
            </div>
            {!locationEnabled && (
              <Button 
                onClick={handleEnableLocation}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Enable Location
              </Button>
            )}
            {locationEnabled && (
              <div className="text-sm text-success font-medium">✓ Enabled</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
