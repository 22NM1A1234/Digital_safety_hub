import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Clock, User, AlertTriangle, TrendingUp, FileText, Eye, MessageSquare, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Report {
  id: string;
  userId: string;
  caseId: string;
  type: string;
  urgency: "low" | "medium" | "high" | "critical";
  status: "pending" | "investigating" | "resolved" | "closed";
  description: string;
  location: string;
  timestamp: string;
  assignedAgent?: string;
}


interface ReportSummary {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  criticalReports: number;
}

const AdminDashboard = () => {
  const [searchUserId, setSearchUserId] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAdmin, userRole } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Report interface
      const transformedReports: Report[] = data?.map(report => ({
        id: report.id,
        userId: report.user_id,
        caseId: report.case_id,
        type: report.incident_type,
        urgency: report.urgency as "low" | "medium" | "high" | "critical",
        status: report.status as "pending" | "investigating" | "resolved" | "closed",
        description: report.description,
        location: report.location || 'Not specified',
        timestamp: report.created_at,
        assignedAgent: report.assigned_agent
      })) || [];

      setReports(transformedReports);
      setFilteredReports(transformedReports);

      // Calculate summary
      const newSummary: ReportSummary = {
        totalReports: transformedReports.length,
        pendingReports: transformedReports.filter(r => r.status === 'pending').length,
        resolvedReports: transformedReports.filter(r => r.status === 'resolved').length,
        criticalReports: transformedReports.filter(r => r.urgency === 'critical' || r.urgency === 'high').length
      };
      setSummary(newSummary);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleSearch = () => {
    if (!searchUserId.trim()) {
      setFilteredReports(reports);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const userReports = reports.filter(report => 
        report.userId.toLowerCase().includes(searchUserId.toLowerCase()) ||
        report.caseId.toLowerCase().includes(searchUserId.toLowerCase())
      );
      setFilteredReports(userReports);
      setLoading(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${userReports.length} reports for your search.`,
      });
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "destructive";
      case "investigating": return "secondary";
      case "resolved": return "default";
      case "closed": return "outline";
      default: return "outline";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isAdmin 
              ? 'Manage all incident reports and monitor system activity' 
              : 'Track your incident reports and view your case status'
            }
          </p>
          {userRole && (
            <Badge variant={isAdmin ? "default" : "secondary"} className="mt-2">
              {userRole.toUpperCase()} ACCESS
            </Badge>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{isAdmin ? 'All Reports' : 'My Reports'}</TabsTrigger>
            <TabsTrigger value="tracking">{isAdmin ? 'User Management' : 'Track My Cases'}</TabsTrigger>
            <TabsTrigger value="analytics">{isAdmin ? 'System Analytics' : 'My Activity'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{isAdmin ? 'Total Reports' : 'My Reports'}</CardTitle>
                  <AlertTriangle className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.totalReports || 0}</div>
                  <p className="text-xs text-muted-foreground">{isAdmin ? 'All reports in system' : 'Total reports submitted'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{summary?.pendingReports || 0}</div>
                  <p className="text-xs text-muted-foreground">Under investigation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <TrendingUp className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{summary?.resolvedReports || 0}</div>
                  <p className="text-xs text-muted-foreground">Cases closed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <AlertTriangle className="h-4 w-4 ml-auto text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{summary?.criticalReports || 0}</div>
                  <p className="text-xs text-muted-foreground">Urgent cases</p>
                </CardContent>
              </Card>
            </div>

            {/* Admin Search */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Reports</CardTitle>
                  <CardDescription>Search reports by case ID or user ID</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter case ID or user ID..."
                      value={searchUserId}
                      onChange={(e) => setSearchUserId(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>{isAdmin ? 'All Recent Reports' : 'My Recent Reports'}</CardTitle>
                <CardDescription>
                  {isAdmin 
                    ? 'Latest incident reports from all users' 
                    : 'Your latest incident reports and their current status'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                   {filteredReports.length === 0 ? (
                     <div className="text-center py-12">
                       <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                       <p className="text-lg font-medium text-foreground mb-2">
                         {loading ? 'Loading reports...' : isAdmin ? 'No reports found' : 'No reports submitted yet'}
                       </p>
                       <p className="text-muted-foreground mb-4">
                         {isAdmin 
                           ? 'No incident reports match your search criteria.' 
                           : "You haven't submitted any incident reports. Get started by reporting a new incident."
                         }
                       </p>
                       {!isAdmin && (
                         <Button asChild>
                           <a href="/report">
                             <AlertTriangle className="h-4 w-4 mr-2" />
                             Report New Incident
                           </a>
                         </Button>
                       )}
                     </div>
                   ) : (
                     filteredReports.slice(0, 10).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{report.caseId}</span>
                            <Badge variant={getUrgencyColor(report.urgency)}>
                              {report.urgency.toUpperCase()}
                            </Badge>
                            <Badge variant={getStatusColor(report.status)}>
                              {report.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{report.type}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {report.userId}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {report.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(report.timestamp)}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Track My Cases</CardTitle>
                <CardDescription>Case tracking functionality will be available soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Case tracking feature coming soon...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll be able to track the progress of your submitted reports here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Activity</CardTitle>
                <CardDescription>Your personal activity summary and report history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Personal activity dashboard coming soon...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will include your report history, trends, and personal insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;