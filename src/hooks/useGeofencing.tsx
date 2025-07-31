import { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import { useAlerts } from '@/contexts/AlertContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface CrimeArea {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  severity: 'low' | 'medium' | 'high' | 'critical';
  crimeType: string;
  description: string;
}

interface GeofenceAlert {
  areaId: string;
  areaName: string;
  severity: string;
  crimeType: string;
  distance: number;
  enteredAt: string;
}

export const useGeofencing = () => {
  const [crimeAreas] = useState<CrimeArea[]>([
    {
      id: 'area1',
      name: 'Downtown Financial District',
      latitude: 40.7589,
      longitude: -73.9851,
      radius: 500,
      severity: 'high',
      crimeType: 'Cyber Fraud',
      description: 'High incidents of ATM skimming and card fraud'
    },
    {
      id: 'area2',
      name: 'University Campus',
      latitude: 40.7505,
      longitude: -73.9934,
      radius: 300,
      severity: 'medium',
      crimeType: 'Identity Theft',
      description: 'Student data breaches and phishing attempts'
    },
    {
      id: 'area3',
      name: 'Shopping Center',
      latitude: 40.7614,
      longitude: -73.9776,
      radius: 400,
      severity: 'critical',
      crimeType: 'Credit Card Fraud',
      description: 'Multiple reports of card skimming devices'
    }
  ]);

  const [activeAlerts, setActiveAlerts] = useState<GeofenceAlert[]>([]);
  const [monitoredAreas, setMonitoredAreas] = useState<string[]>([]);
  
  const { latitude, longitude, error } = useGeolocation({ 
    watch: true, 
    enableHighAccuracy: true 
  });
  const { addAlert } = useAlerts();
  const { profile } = useUserProfile();

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = useCallback((
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
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
  }, []);

  // Check if user is within any crime area
  useEffect(() => {
    if (!latitude || !longitude || error) return;

    crimeAreas.forEach(area => {
      const distance = calculateDistance(latitude, longitude, area.latitude, area.longitude);
      const isWithinArea = distance <= area.radius;
      const wasMonitored = monitoredAreas.includes(area.id);

      if (isWithinArea && !wasMonitored) {
        // User entered a crime area
        const alert: GeofenceAlert = {
          areaId: area.id,
          areaName: area.name,
          severity: area.severity,
          crimeType: area.crimeType,
          distance: Math.round(distance),
          enteredAt: new Date().toISOString()
        };

        setActiveAlerts(prev => [...prev, alert]);
        setMonitoredAreas(prev => [...prev, area.id]);

        // Add to global alerts
        addAlert({
          type: 'crime',
          severity: area.severity,
          title: `Crime Area Alert: ${area.name}`,
          message: `You've entered an area with reported ${area.crimeType} incidents. ${area.description}`,
          location: area.name
        });

        // Send browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Crime Area Alert: ${area.name}`, {
            body: `High ${area.crimeType} activity reported in this area. Stay vigilant!`,
            icon: '/favicon.ico',
            tag: area.id
          });
        }

        // Send SMS notification if user profile is available
        if (profile?.phoneNumber) {
          sendSMSAlert(profile.phoneNumber, profile.name, area);
          
          // Also send to emergency contacts
          profile.emergencyContacts?.forEach(contact => {
            sendEmergencySMS(contact, profile.name, area);
          });
        }

      } else if (!isWithinArea && wasMonitored) {
        // User left the crime area
        setActiveAlerts(prev => prev.filter(alert => alert.areaId !== area.id));
        setMonitoredAreas(prev => prev.filter(id => id !== area.id));
      }
    });
  }, [latitude, longitude, error, crimeAreas, monitoredAreas, calculateDistance, addAlert]);

  // Get nearby crime areas (within 1km)
  const getNearbyAreas = useCallback(() => {
    if (!latitude || !longitude) return [];

    return crimeAreas
      .map(area => ({
        ...area,
        distance: calculateDistance(latitude, longitude, area.latitude, area.longitude)
      }))
      .filter(area => area.distance <= 1000) // Within 1km
      .sort((a, b) => a.distance - b.distance);
  }, [latitude, longitude, crimeAreas, calculateDistance]);

  // Send SMS Alert function
  const sendSMSAlert = useCallback((phoneNumber: string, userName: string, area: CrimeArea) => {
    // In production, this would call your SMS API
    const message = `CRIME ALERT: ${userName}, you've entered ${area.name}. High ${area.crimeType} activity reported. Stay alert! - Digital Shield`;
    
    // For now, we'll simulate the SMS and log it
    console.log(`SMS sent to ${phoneNumber}: ${message}`);
    
    // In a real implementation, you'd call your SMS service here:
    // await fetch('/api/send-sms', {
    //   method: 'POST',
    //   body: JSON.stringify({ to: phoneNumber, message })
    // });
  }, []);

  // Send Emergency SMS function
  const sendEmergencySMS = useCallback((phoneNumber: string, userName: string, area: CrimeArea) => {
    const message = `EMERGENCY ALERT: ${userName} has entered a high-crime area (${area.name}) with reported ${area.crimeType}. Location coordinates: ${area.latitude}, ${area.longitude}`;
    
    console.log(`Emergency SMS sent to ${phoneNumber}: ${message}`);
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  return {
    currentLocation: latitude && longitude ? { latitude, longitude } : null,
    crimeAreas,
    activeAlerts,
    nearbyAreas: getNearbyAreas(),
    locationError: error,
    requestNotificationPermission,
    isInCrimeArea: activeAlerts.length > 0
  };
};