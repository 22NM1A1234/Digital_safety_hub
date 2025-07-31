import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Clock, User, AlertTriangle, TrendingUp, FileText, Eye, MessageSquare, Database } from "lucide-react";
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

interface Case {
  id: string;
  userId: string;
  caseId: string;
  type: string;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  submittedAt: string;
  lastUpdated: string;
  description: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  occurredAt?: string;
  anonymous: boolean;
  assignedTo?: string;
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
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [userIdSearch, setUserIdSearch] = useState("");
  const { toast } = useToast();

  // Mock summary data
  const mockSummary: ReportSummary = {
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    criticalReports: 0
  };

  useEffect(() => {
    // Initialize with empty reports and reset summary
    setReports([]);
    setSummary(mockSummary);
    setFilteredReports([]);

    // Load cases from localStorage and mock data
    const storedReports = JSON.parse(localStorage.getItem('userReports') || '[]');
    
    // Convert stored reports to Case format
    const userCases: Case[] = storedReports.map((report: any) => ({
      id: report.id,
      userId: report.userId,
      caseId: report.caseId,
      type: report.type,
      status: report.status || 'pending',
      priority: report.urgency || 'medium',
      submittedAt: report.timestamp,
      lastUpdated: report.timestamp,
      description: report.description,
      location: report.location,
      contactEmail: report.contactEmail,
      contactPhone: report.contactPhone,
      occurredAt: report.occurredAt,
      anonymous: report.anonymous,
      assignedTo: report.assignedAgent
    }));

    // Mock cases for demonstration
    const mockCases: Case[] = [
      {
        id: "1",
        userId: "USER001",
        caseId: "DSH-ABC123",
        type: "Phishing/Email Scams",
        status: "investigating",
        priority: "high",
        submittedAt: "2024-01-15T10:30:00Z",
        lastUpdated: "2024-01-16T14:20:00Z",
        description: "Received suspicious email claiming to be from my bank asking for account verification...",
        location: "Downtown Area",
        contactEmail: "user@example.com",
        anonymous: false,
        assignedTo: "Agent Smith"
      },
      {
        id: "2",
        userId: "USER001", 
        caseId: "DSH-DEF456",
        type: "Cyberbullying/Online Harassment",
        status: "pending",
        priority: "medium",
        submittedAt: "2024-01-14T16:45:00Z",
        lastUpdated: "2024-01-14T16:45:00Z",
        description: "Being harassed on social media with threatening messages...",
        location: "University District",
        anonymous: false
      },
      {
        id: "3",
        userId: "USER002",
        caseId: "DSH-GHI789", 
        type: "Identity Theft",
        status: "resolved",
        priority: "critical",
        submittedAt: "2024-01-10T09:15:00Z",
        lastUpdated: "2024-01-13T11:30:00Z",
        description: "Someone opened credit cards in my name without authorization...",
        location: "Residential Area",
        anonymous: false,
        assignedTo: "Agent Johnson"
      }
    ];

    setCases([...userCases, ...mockCases]);
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

  // Cases filtering and search logic
  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const searchByUserId = () => {
    if (!userIdSearch.trim()) {
      toast({
        title: "Please enter a User ID or Case ID",
        description: "Enter your User ID or Case ID to search for your reports.",
        variant: "destructive"
      });
      return;
    }

    const userCases = cases.filter(case_ => 
      case_.userId.toLowerCase().includes(userIdSearch.toLowerCase()) ||
      case_.caseId.toLowerCase().includes(userIdSearch.toLowerCase())
    );

    if (userCases.length === 0) {
      toast({
        title: "No Reports Found",
        description: `No reports found for ID: ${userIdSearch}`,
        variant: "destructive"
      });
    } else {
      setSearchTerm(userIdSearch);
      toast({
        title: "Search Complete",
        description: `Found ${userCases.length} report(s) for ID: ${userIdSearch}`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'investigating': return <Badge className="bg-primary text-primary-foreground">Investigating</Badge>;
      case 'resolved': return <Badge className="bg-green-600 text-white">Resolved</Badge>;
      case 'closed': return <Badge variant="outline">Closed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low': return <Badge variant="outline" className="text-muted-foreground">Low</Badge>;
      case 'medium': return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'high': return <Badge className="bg-accent text-accent-foreground">High</Badge>;
      case 'critical': return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>;
      default: return <Badge variant="secondary">{priority}</Badge>;
    }
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">My Reports</TabsTrigger>
            <TabsTrigger value="cases">My Cases</TabsTrigger>
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
                  {reports.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground mb-2">No reports submitted yet</p>
                      <p className="text-muted-foreground mb-4">
                        You haven't submitted any incident reports. Get started by reporting a new incident.
                      </p>
                      <Button asChild>
                        <a href="/report">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Report New Incident
                        </a>
                      </Button>
                    </div>
                  ) : (
                    reports.slice(0, 5).map((report) => (
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

          <TabsContent value="cases" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      Case Dashboard
                    </CardTitle>
                    <CardDescription>
                      View and manage all your submitted incident reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search cases by ID, type, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="investigating">Investigating</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      {filteredCases.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg font-medium text-foreground mb-2">No cases found</p>
                          <p className="text-muted-foreground">
                            {searchTerm || statusFilter !== "all" 
                              ? "Try adjusting your search criteria" 
                              : "You haven't submitted any incident reports yet"
                            }
                          </p>
                        </div>
                      ) : (
                        filteredCases.map((case_) => (
                          <Card 
                            key={case_.id} 
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedCase?.id === case_.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedCase(case_)}
                          >
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-lg text-foreground mb-1">
                                    Case {case_.caseId}
                                  </h3>
                                  <p className="text-muted-foreground text-sm">{case_.type}</p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    User: {case_.userId}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {getStatusBadge(case_.status)}
                                  {getPriorityBadge(case_.priority)}
                                </div>
                              </div>
                              
                              <p className="text-foreground mb-4 line-clamp-2">
                                {case_.description}
                              </p>
                              
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Submitted: {new Date(case_.submittedAt).toLocaleDateString()}
                                  </span>
                                  {case_.assignedTo && (
                                    <span>Assigned to: {case_.assignedTo}</span>
                                  )}
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {selectedCase ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Case Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Case ID</h4>
                        <p className="text-muted-foreground font-mono">{selectedCase.caseId}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">User ID</h4>
                        <p className="text-muted-foreground font-mono">{selectedCase.userId}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Type</h4>
                        <p className="text-muted-foreground">{selectedCase.type}</p>
                      </div>
                      
                      <div className="flex gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Status</h4>
                          {getStatusBadge(selectedCase.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Priority</h4>
                          {getPriorityBadge(selectedCase.priority)}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground text-sm">{selectedCase.description}</p>
                      </div>
                      
                      {selectedCase.location && (
                        <div>
                          <h4 className="font-semibold mb-2">Location</h4>
                          <p className="text-muted-foreground text-sm">{selectedCase.location}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-semibold mb-2">Timeline</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>Submitted: {new Date(selectedCase.submittedAt).toLocaleString()}</p>
                          <p>Last Updated: {new Date(selectedCase.lastUpdated).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {selectedCase.assignedTo && (
                        <div>
                          <h4 className="font-semibold mb-2">Assigned Agent</h4>
                          <p className="text-muted-foreground">{selectedCase.assignedTo}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 pt-4">
                        <Button size="sm" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Add Update
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          Download Report
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          Contact Support
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Case Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center py-8">
                        Select a case from the list to view details
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/report">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report New Incident
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/link-checker">
                        <Search className="h-4 w-4 mr-2" />
                        Check Suspicious Link
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/resources">
                        <FileText className="h-4 w-4 mr-2" />
                        Get Help & Resources
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            {/* Search by ID Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  Search Your Reports
                </CardTitle>
                <CardDescription>
                  Enter your User ID or Case ID to find and track your submitted reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter User ID (e.g., USER001) or Case ID (e.g., DSH-ABC123)"
                      value={userIdSearch}
                      onChange={(e) => setUserIdSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchByUserId()}
                    />
                  </div>
                  <Button onClick={searchByUserId} className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
                
                {/* Search Results */}
                {searchTerm && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Search Results ({filteredCases.length} found)</h3>
                    <div className="space-y-4">
                      {filteredCases.map((case_) => (
                        <Card key={case_.id} className="border-l-4 border-l-primary">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-lg">
                                  Case {case_.caseId}
                                </h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    User: {case_.userId}
                                  </span>
                                  {case_.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {case_.location}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {getStatusBadge(case_.status)}
                                {getPriorityBadge(case_.priority)}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Type: </span>
                                <span className="text-muted-foreground">{case_.type}</span>
                              </div>
                              <div>
                                <span className="font-medium">Description: </span>
                                <span className="text-muted-foreground">{case_.description}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Submitted: {new Date(case_.submittedAt).toLocaleString()}
                              </div>
                              {case_.assignedTo && (
                                <div className="text-sm">
                                  <span className="font-medium">Assigned to: </span>
                                  <span className="text-muted-foreground">{case_.assignedTo}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
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