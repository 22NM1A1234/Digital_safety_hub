import { useState, useEffect } from 'react';

interface ReverseGeocodingResult {
  locationName: string | null;
  error: string | null;
  loading: boolean;
}

// Helper function to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

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
        // Try multiple zoom levels for better accuracy
        const zoomLevels = [18, 16, 14, 12];
        let bestResult = null;

        // Try searching for nearby educational institutions first
        const searchResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=vignans+institute+engineering+women+visakhapatnam&limit=5&addressdetails=1&extratags=1`,
          {
            headers: {
              'User-Agent': 'CrimeAlertsApp/1.0'
            }
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          // Check if any results are within 500m of current location
          for (const place of searchData) {
            const placeLat = parseFloat(place.lat);
            const placeLon = parseFloat(place.lon);
            const distance = calculateDistance(latitude, longitude, placeLat, placeLon);
            
            if (distance <= 500) { // Within 500 meters
              bestResult = place;
              break;
            }
          }
        }

        // If no nearby institution found, try reverse geocoding
        if (!bestResult) {
          for (const zoom of zoomLevels) {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=${zoom}&addressdetails=1&extratags=1`,
              {
                headers: {
                  'User-Agent': 'CrimeAlertsApp/1.0'
                }
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data && data.display_name) {
                bestResult = data;
                // If we find a specific place or building, use it
                if (data.extratags?.name || data.name || data.address?.amenity) {
                  break;
                }
              }
            }
          }
        }

        if (bestResult) {
          const address = bestResult.address || {};
          const extratags = bestResult.extratags || {};
          
          // Build detailed location string with institution/landmark info
          const locationParts = [];
          
          // Add institution/amenity name if available
          if (extratags.name || bestResult.name) {
            locationParts.push(extratags.name || bestResult.name);
          }
          
          // Add amenity type (like university, school, etc.)
          if (address.amenity) {
            locationParts.push(address.amenity);
          }
          
          // Add street address
          if (address.house_number && address.road) {
            locationParts.push(`${address.house_number} ${address.road}`);
          } else if (address.road) {
            locationParts.push(address.road);
          }
          
          // Add area/neighborhood
          if (address.neighbourhood || address.suburb) {
            locationParts.push(address.neighbourhood || address.suburb);
          }
          
          // Add city/town
          if (address.city || address.town || address.village) {
            locationParts.push(address.city || address.town || address.village);
          }
          
          // Add state
          if (address.state) {
            locationParts.push(address.state);
          }

          const locationName = locationParts.length > 0 
            ? locationParts.join(', ')
            : bestResult.display_name.split(',').slice(0, 4).join(',');

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