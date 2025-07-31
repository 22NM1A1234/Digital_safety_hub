import { useState, useEffect } from 'react';

interface ReverseGeocodingResult {
  locationName: string | null;
  error: string | null;
  loading: boolean;
}

export const useReverseGeocoding = (latitude: number | null, longitude: number | null) => {
  const [result, setResult] = useState<ReverseGeocodingResult>({
    locationName: null,
    error: null,
    loading: false
  });

  useEffect(() => {
    if (!latitude || !longitude) {
      setResult({
        locationName: null,
        error: null,
        loading: false
      });
      return;
    }

    const fetchLocationName = async () => {
      setResult(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Using OpenStreetMap Nominatim API (free reverse geocoding)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'CrimeAlertsApp/1.0'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location name');
        }

        const data = await response.json();
        
        if (data && data.display_name) {
          // Extract meaningful location parts
          const address = data.address || {};
          const locationParts = [
            address.neighbourhood || address.suburb,
            address.city || address.town || address.village,
            address.state || address.province
          ].filter(Boolean);

          const locationName = locationParts.length > 0 
            ? locationParts.join(', ')
            : data.display_name.split(',').slice(0, 3).join(',');

          setResult({
            locationName,
            error: null,
            loading: false
          });
        } else {
          setResult({
            locationName: 'Unknown Location',
            error: null,
            loading: false
          });
        }
      } catch (error) {
        setResult({
          locationName: null,
          error: 'Failed to get location name',
          loading: false
        });
      }
    };

    // Debounce the API call to avoid too many requests
    const timeoutId = setTimeout(fetchLocationName, 500);
    return () => clearTimeout(timeoutId);
  }, [latitude, longitude]);

  return result;
};