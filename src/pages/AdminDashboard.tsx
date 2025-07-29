import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Clock, User, AlertTriangle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // Mock reports data - in real app, this would come from API
  const mockReports: Report[] = [
    {
      id: "1",
      userId: "USER001",
      caseId: "DSH-ABC123",
      type: "Cyber Fraud",
      urgency: "high",
      status: "investigating",
      description: "Phishing email targeting banking credentials",
      location: "Downtown Area",
      timestamp: "2024-01-26T10:30:00Z",
      assignedAgent: "Agent Smith"
    },
    {
      id: "2",
      userId: "USER001",
      caseId: "DSH-DEF456",
      type: "Identity Theft",
      urgency: "medium",
      status: "resolved",
      description: "Unauthorized use of personal information",
      location: "University District",
      timestamp: "2024-01-25T14:20:00Z",
      assignedAgent: "Agent Johnson"
    },
    {
      id: "3",
      userId: "USER002",
      caseId: "DSH-GHI789",
      type: "Online Harassment",
      urgency: "critical",
      status: "pending",
      description: "Persistent cyberbullying and threats",
      location: "Residential Area",
      timestamp: "2024-01-26T09:15:00Z"
    }
  ];

  const mockSummary: ReportSummary = {
    totalReports: 156,
    pendingReports: 23,
    resolvedReports: 98,
    criticalReports: 5
  };

  useEffect(() => {
    setReports(mockReports);
    setSummary(mockSummary);
    setFilteredReports(mockReports);
  }, []);

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
            User Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your incident reports and view your case status
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">My Reports</TabsTrigger>
            <TabsTrigger value="tracking">Track My Cases</TabsTrigger>
            <TabsTrigger value="analytics">My Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Reports</CardTitle>
                  <AlertTriangle className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.totalReports || 0}</div>
                  <p className="text-xs text-muted-foreground">Total reports submitted</p>
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

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>My Recent Reports</CardTitle>
                <CardDescription>Your latest incident reports and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Track My Cases</CardTitle>
                <CardDescription>Search your reports by User ID or Case ID to view status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter User ID or Case ID (e.g., USER001, DSH-ABC123)"
                      value={searchUserId}
                      onChange={(e) => setSearchUserId(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={loading} className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <Card>
              <CardHeader>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  {filteredReports.length > 0 
                    ? `Found ${filteredReports.length} report(s)` 
                    : "No reports found"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {report.caseId}
                              <Badge variant={getUrgencyColor(report.urgency)}>
                                {report.urgency.toUpperCase()}
                              </Badge>
                              <Badge variant={getStatusColor(report.status)}>
                                {report.status.toUpperCase()}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                User: {report.userId}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {report.location}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatTimestamp(report.timestamp)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold">Type:</h4>
                            <p className="text-sm">{report.type}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Description:</h4>
                            <p className="text-sm">{report.description}</p>
                          </div>
                          {report.assignedAgent && (
                            <div>
                              <h4 className="font-semibold">Assigned Agent:</h4>
                              <p className="text-sm">{report.assignedAgent}</p>
                            </div>
                          )}
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              Add Update
                            </Button>
                            <Button size="sm" variant="outline">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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