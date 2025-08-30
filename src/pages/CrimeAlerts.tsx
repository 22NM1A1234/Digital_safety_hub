import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useGeofencing } from "@/hooks/useGeofencing";
import { useReverseGeocoding } from "@/hooks/useReverseGeocoding";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { UserProfileSetup } from "@/components/UserProfileSetup";
import { MapPin, AlertTriangle, Clock, TrendingUp, Bell, BellRing, Navigation, Shield, User, BarChart3, TrendingDown, Activity, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

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
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const { toast } = useToast();
  const { profile, isProfileComplete } = useUserProfile();
  const { latitude, longitude, error: locationError, accuracy } = useGeolocation({ 
    enableHighAccuracy: true, 
    timeout: 15000,
    maximumAge: 60000
  });
  const { locationName, loading: locationNameLoading } = useReverseGeocoding(latitude, longitude);
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

  // Chart data
  const weeklyTrendData = [
    { day: 'Mon', incidents: 5, cyberFraud: 2, identityTheft: 2, harassment: 1 },
    { day: 'Tue', incidents: 3, cyberFraud: 1, identityTheft: 1, harassment: 1 },
    { day: 'Wed', incidents: 8, cyberFraud: 4, identityTheft: 2, harassment: 2 },
    { day: 'Thu', incidents: 2, cyberFraud: 1, identityTheft: 0, harassment: 1 },
    { day: 'Fri', incidents: 6, cyberFraud: 3, identityTheft: 2, harassment: 1 },
    { day: 'Sat', incidents: 4, cyberFraud: 2, identityTheft: 1, harassment: 1 },
    { day: 'Sun', incidents: 3, cyberFraud: 1, identityTheft: 1, harassment: 1 }
  ];

  const crimeTypeData = [
    { name: 'Cyber Fraud', value: 45, color: '#ef4444' },
    { name: 'Identity Theft', value: 30, color: '#f97316' },
    { name: 'Online Scams', value: 15, color: '#eab308' },
    { name: 'Data Breach', value: 7, color: '#06b6d4' },
    { name: 'Other', value: 3, color: '#6b7280' }
  ];

  const areaRiskData = [
    { area: 'Downtown', risk: 85, incidents: 12 },
    { area: 'University', risk: 60, incidents: 8 },
    { area: 'Residential', risk: 35, incidents: 5 },
    { area: 'Business', risk: 70, incidents: 9 },
    { area: 'Shopping', risk: 45, incidents: 6 }
  ];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#6b7280'];

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
    
    const coordinates = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    
    if (locationNameLoading) {
      return `${coordinates} • Getting location name...`;
    }
    
    if (locationName) {
      // Show accuracy info if available
      const accuracyText = accuracy && accuracy < 100 
        ? ` (±${Math.round(accuracy)}m)` 
        : '';
      return `${locationName} • ${coordinates}${accuracyText}`;
    }
    
    return coordinates;
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
          <div className="flex gap-2">
            <Button
              onClick={() => setShowProfileSetup(!showProfileSetup)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              {isProfileComplete ? 'Update Profile' : 'Setup Profile'}
            </Button>
            <Button 
              onClick={enableNotifications}
              variant={notificationsEnabled ? "secondary" : "default"}
              className="flex items-center gap-2"
            >
              {notificationsEnabled ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              {notificationsEnabled ? "Notifications On" : "Enable Alerts"}
            </Button>
          </div>
        </div>

        {/* Profile Setup Modal */}
        {showProfileSetup && (
          <div className="mb-6">
            <UserProfileSetup />
          </div>
        )}

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

        {/* Visual Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Weekly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                Weekly Crime Trends
              </CardTitle>
              <CardDescription>
                Daily incident reports over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-success" />
                  <span>23% decrease from last week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crime Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Crime Type Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of digital crime types in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={crimeTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {crimeTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Area Risk Analysis */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Risk Analysis by Area
            </CardTitle>
            <CardDescription>
              Comparative risk assessment across different city areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={areaRiskData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="risk" 
                  fill="hsl(var(--primary))" 
                  name="Risk Score"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="incidents" 
                  fill="hsl(var(--destructive))" 
                  name="Incidents"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {areaRiskData.map((area, index) => (
                <div key={area.area} className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="font-semibold text-sm">{area.area}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Risk: {area.risk}% | {area.incidents} incidents
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">3.2 min</p>
                  <p className="text-xs text-success">-15% faster</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved Cases</p>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-success">+5% this week</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-success">+8% growth</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prevention Rate</p>
                  <p className="text-2xl font-bold">76%</p>
                  <p className="text-xs text-success">+12% improvement</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-12">
              <div className="text-center max-w-3xl mx-auto">
                <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Take Control of Your Digital Safety
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Don't wait for crime to find you. Stay ahead with real-time alerts, comprehensive reporting tools, and expert safety resources. Join thousands who trust SafeGuard for their digital protection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <a href="/report-incident">
                      Report Incident Now
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="/resources">
                      Safety Resources
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="/link-checker">
                      Check Suspicious Links
                    </a>
                  </Button>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">1,247+</div>
                    <div className="text-sm text-muted-foreground">Protected Users</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Section */}
        <footer className="pt-12 pb-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                SafeGuard
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your comprehensive digital safety platform. Stay protected, stay informed, stay safe.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Security Tools</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/crime-alerts" className="text-muted-foreground hover:text-primary transition-colors">
                    Crime Alerts
                  </a>
                </li>
                <li>
                  <a href="/link-checker" className="text-muted-foreground hover:text-primary transition-colors">
                    Link Checker
                  </a>
                </li>
                <li>
                  <a href="/report-incident" className="text-muted-foreground hover:text-primary transition-colors">
                    Report Incident
                  </a>
                </li>
                <li>
                  <a href="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                    AI Assistant
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                    Profile Settings
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                    Sign In
                  </a>
                </li>
                <li>
                  <button 
                    onClick={enableNotifications}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    Enable Notifications
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 SafeGuard. All rights reserved. Protecting your digital world, one alert at a time.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default CrimeAlerts;