import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, AlertTriangle, Search, MapPin, Mail, User, Calendar, Shield, Eye, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Report {
  id: string;
  case_id: string;
  incident_type: string;
  urgency: string;
  status: string;
  description: string;
  location?: string;
  created_at: string;
  updated_at: string;
  assigned_agent?: string;
  contact_email?: string;
  contact_phone?: string;
}

const Dashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchReports();
  }, [user, navigate]);

  useEffect(() => {
    // Filter reports based on search term
    const filtered = reports.filter(report => 
      report.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [reports, searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('incident_reports').select('*');
      
      // If not admin, only show user's own reports
      if (userRole !== 'admin') {
        query = query.eq('user_id', user?.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive"
        });
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'under_investigation': return 'default';
      case 'resolved': return 'default';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'under_investigation': return Eye;
      case 'resolved': return CheckCircle;
      case 'closed': return Shield;
      default: return Clock;
    }
  };

  const getIncidentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cybersecurity': return Shield;
      case 'fraud': return AlertTriangle;
      case 'harassment': return User;
      case 'data breach': return Shield;
      default: return FileText;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'outline';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSummaryStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const critical = reports.filter(r => r.urgency === 'critical').length;
    
    return { total, pending, resolved, critical };
  };

  const stats = getSummaryStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {userRole === 'admin' ? 'Admin Dashboard' : 'My Reports'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'admin' 
              ? 'Monitor and manage all incident reports'
              : 'Track your submitted incident reports and their status'
            }
          </p>
          <Badge variant="outline" className="mt-2">
            Role: {userRole || 'User'}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Reports</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {userRole === 'admin' ? 'All system reports' : 'Your submitted reports'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900 border-yellow-200 dark:border-orange-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.pending}</div>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Awaiting review
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-green-200 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Resolved</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.resolved}</div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Successfully closed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Critical</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.critical}</div>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    High priority cases
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                  Latest incident reports submitted to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No reports found</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/report')}
                    >
                      Submit Your First Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.slice(0, 5).map((report) => {
                      const StatusIcon = getStatusIcon(report.status);
                      const TypeIcon = getIncidentTypeIcon(report.incident_type);
                      return (
                        <div key={report.id} className="group relative p-6 border rounded-xl hover:shadow-lg transition-all duration-200 hover:border-primary/20 bg-gradient-to-r from-background to-muted/20">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <TypeIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {report.case_id}
                                  </Badge>
                                  <Badge variant={getUrgencyColor(report.urgency)} className="capitalize">
                                    {report.urgency}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <StatusIcon className="h-3 w-3" />
                                    <Badge variant={getStatusColor(report.status)} className="capitalize">
                                      {report.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {report.incident_type}
                                  </h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {report.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatTimestamp(report.created_at)}
                                    </div>
                                    {report.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {report.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Search Bar */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by case ID, incident type, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Reports</CardTitle>
                <CardDescription>
                  Detailed view of all incident reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredReports.length === 0 ? (
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No reports match your search' : 'No reports found'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredReports.map((report) => {
                      const StatusIcon = getStatusIcon(report.status);
                      const TypeIcon = getIncidentTypeIcon(report.incident_type);
                      return (
                        <Card key={report.id} className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex items-start space-x-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <TypeIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="outline" className="font-mono text-xs">
                                          {report.case_id}
                                        </Badge>
                                        <Badge variant={getUrgencyColor(report.urgency)} className="capitalize">
                                          {report.urgency}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                          <StatusIcon className="h-3 w-3" />
                                          <Badge variant={getStatusColor(report.status)} className="capitalize">
                                            {report.status.replace('_', ' ')}
                                          </Badge>
                                        </div>
                                      </div>
                                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                        {report.incident_type}
                                      </h3>
                                    </div>
                                    <div className="text-right text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatTimestamp(report.created_at)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {report.description}
                                  </p>
                                  
                                  <Separator />
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                    {report.location && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">Location:</span>
                                        <span className="font-medium">{report.location}</span>
                                      </div>
                                    )}
                                    {report.contact_email && (
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">Contact:</span>
                                        <span className="font-medium">{report.contact_email}</span>
                                      </div>
                                    )}
                                    {report.assigned_agent && (
                                      <div className="flex items-center gap-2">
                                        <User className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">Assigned to:</span>
                                        <span className="font-medium">{report.assigned_agent}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;