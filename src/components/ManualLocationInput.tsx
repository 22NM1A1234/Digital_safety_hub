import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManualLocationProps {
  onLocationSet: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}

export const ManualLocationInput = ({ onLocationSet, onClose }: ManualLocationProps) => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchLocation = async () => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter an address to search for",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CrimeAlertsApp/1.0'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          onLocationSet(lat, lng, result.display_name);
          toast({
            title: "Location Set",
            description: "Your location has been updated successfully",
          });
          onClose();
        } else {
          toast({
            title: "Location Not Found",
            description: "Please try a more specific address",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to search for location. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const useCoordinates = () => {
    const coords = coordinates.split(',').map(c => c.trim());
    if (coords.length !== 2) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter coordinates in format: latitude, longitude",
        variant: "destructive"
      });
      return;
    }

    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude (-90 to 90) and longitude (-180 to 180)",
        variant: "destructive"
      });
      return;
    }

    onLocationSet(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    toast({
      title: "Location Set",
      description: "Your location has been updated using coordinates",
    });
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Set Location Manually
        </CardTitle>
        <CardDescription>
          Search by address or enter coordinates directly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Search Address</Label>
          <div className="flex gap-2">
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter city, area, or landmark"
              onKeyPress={(e) => e.key === 'Enter' && !loading && searchLocation()}
            />
            <Button onClick={searchLocation} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          - OR -
        </div>

        <div className="space-y-2">
          <Label htmlFor="coordinates">Enter Coordinates</Label>
          <div className="flex gap-2">
            <Input
              id="coordinates"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              placeholder="latitude, longitude (e.g. 28.6139, 77.2090)"
            />
            <Button onClick={useCoordinates} variant="outline">
              Use
            </Button>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};