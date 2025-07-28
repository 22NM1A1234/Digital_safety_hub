import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useGeofencing } from "@/hooks/useGeofencing";
import { MapPin, AlertTriangle, Clock, TrendingUp, Bell, BellRing, Navigation, Shield } from "lucide-react";

interface CrimeAlert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  description: string;
  timestamp: string;
  distance: string;
}

interface CrimeStats {
  totalIncidents: number;
  riskLevel: "low" | "medium" | "high";
  trending: "up" | "down" | "stable";
  commonCrimes: string[];
}

const CrimeAlerts = () => {
  const [alerts, setAlerts] = useState<CrimeAlert[]>([]);
  const [stats, setStats] = useState<CrimeStats | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();
  const { latitude, longitude, error: locationError } = useGeolocation({ enableHighAccuracy: true });
  const { 
    currentLocation, 
    crimeAreas, 
    activeAlerts: geofenceAlerts, 
    nearbyAreas, 
    locationError: geofenceError,
    requestNotificationPermission,
    isInCrimeArea 
  } = useGeofencing();

  // Mock crime data - in real app, this would come from crime APIs
  const mockAlerts: CrimeAlert[] = [
    {
      id: "1",
      type: "Cyber Fraud",
      severity: "high",
      location: "Downtown Area",
      description: "Multiple reports of phishing scams targeting local businesses",
      timestamp: "2024-01-26T10:30:00Z",
      distance: "0.5 miles"
    },
    {
      id: "2",
      type: "Identity Theft",
      severity: "medium",
      location: "University District",
      description: "Data breach reported at local service provider",
      timestamp: "2024-01-26T08:15:00Z",
      distance: "1.2 miles"
    },
    {
      id: "3",
      type: "Online Harassment",
      severity: "low",
      location: "Residential Area",
      description: "Increased social media harassment reports",
      timestamp: "2024-01-25T16:45:00Z",
      distance: "2.1 miles"
    }
  ];

  const mockStats: CrimeStats = {
    totalIncidents: 23,
    riskLevel: "medium",
    trending: "down",
    commonCrimes: ["Cyber Fraud", "Identity Theft", "Online Scams"]
  };

  useEffect(() => {
    setAlerts(mockAlerts);
    setStats(mockStats);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      toast({
        title: "Notifications Enabled",
        description: "You'll receive real-time alerts when entering high-crime areas.",
      });
    } else {
      toast({
        title: "Notification Permission Denied",
        description: "Please enable notifications in your browser settings for real-time alerts.",
        variant: "destructive"
      });
    }
  };

  const getLocationString = () => {
    if (locationError) return "Location Access Denied";
    if (!latitude || !longitude) return "Getting location...";
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Crime Rate Alerts
            </h1>
            <p className="text-muted-foreground mt-2">
              Stay informed about safety incidents in your area
            </p>
          </div>
          <Button 
            onClick={enableNotifications}
            variant={notificationsEnabled ? "secondary" : "default"}
            className="flex items-center gap-2"
          >
            {notificationsEnabled ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            {notificationsEnabled ? "Notifications On" : "Enable Alerts"}
          </Button>
        </div>

        {/* Location & Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Location</CardTitle>
              <MapPin className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getLocationString()}</div>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
              {isInCrimeArea && (
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-destructive font-medium">In High-Risk Area</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <AlertTriangle className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold capitalize ${stats ? getRiskLevelColor(stats.riskLevel) : ''}`}>
                {stats?.riskLevel || 'Loading...'}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats?.trending === 'down' ? 'Decreasing' : stats?.trending === 'up' ? 'Increasing' : 'Stable'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Incidents</CardTitle>
              <Clock className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalIncidents || 0}</div>
              <p className="text-xs text-muted-foreground">
                Last 7 days in your area
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Common Crime Types */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Common Crime Types in Your Area</CardTitle>
              <CardDescription>
                Most reported digital safety incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.commonCrimes.map((crime, index) => (
                  <Badge key={index} variant="secondary">
                    {crime}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Geofence Alerts */}
        {geofenceAlerts.length > 0 && (
          <Card className="border-destructive bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Location Alerts
              </CardTitle>
              <CardDescription>
                You are currently in or near high-crime areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geofenceAlerts.map((alert) => (
                  <div key={alert.areaId} className="p-3 bg-background rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{alert.areaName}</h4>
                        <p className="text-sm text-muted-foreground">{alert.crimeType}</p>
                        <p className="text-xs text-muted-foreground">
                          Distance: {alert.distance}m • Entered: {new Date(alert.enteredAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant="destructive">{alert.severity.toUpperCase()}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nearby Crime Areas */}
        {nearbyAreas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Nearby Crime Areas</CardTitle>
              <CardDescription>
                High-risk areas within 1km of your location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nearbyAreas.map((area) => (
                  <div key={area.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{area.name}</h4>
                        <p className="text-sm text-muted-foreground">{area.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Navigation className="h-3 w-3" />
                          {Math.round(area.distance)}m away
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getSeverityColor(area.severity)}>
                          {area.severity.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{area.crimeType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Alerts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Regional Crime Alerts</h2>
          
          {alerts.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Active Alerts</AlertTitle>
              <AlertDescription>
                There are currently no active crime alerts in your area. Stay vigilant and report any suspicious activity.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {alert.type}
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location} • {alert.distance}
                        </CardDescription>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTimestamp(alert.timestamp)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{alert.description}</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Report Similar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrimeAlerts;