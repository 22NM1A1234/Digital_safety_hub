import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Clock, Eye, MessageSquare, AlertTriangle } from "lucide-react";

interface Case {
  id: string;
  type: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  submittedAt: string;
  lastUpdated: string;
  description: string;
  assignedTo?: string;
}

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // Mock data - in real app this would come from API
  const mockCases: Case[] = [
    {
      id: "DSH-ABC123",
      type: "Phishing/Email Scams",
      status: "investigating",
      priority: "high",
      submittedAt: "2024-01-15T10:30:00Z",
      lastUpdated: "2024-01-16T14:20:00Z",
      description: "Received suspicious email claiming to be from my bank asking for account verification...",
      assignedTo: "Agent Smith"
    },
    {
      id: "DSH-DEF456",
      type: "Cyberbullying/Online Harassment",
      status: "open",
      priority: "medium",
      submittedAt: "2024-01-14T16:45:00Z",
      lastUpdated: "2024-01-14T16:45:00Z",
      description: "Being harassed on social media with threatening messages..."
    },
    {
      id: "DSH-GHI789",
      type: "Identity Theft",
      status: "resolved",
      priority: "critical",
      submittedAt: "2024-01-10T09:15:00Z",
      lastUpdated: "2024-01-13T11:30:00Z",
      description: "Someone opened credit cards in my name without authorization...",
      assignedTo: "Agent Johnson"
    }
  ];

  const filteredCases = mockCases.filter(case_ => {
    const matchesSearch = case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="secondary">Open</Badge>;
      case 'investigating': return <Badge className="bg-primary text-primary-foreground">Investigating</Badge>;
      case 'resolved': return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            My Cases
          </h1>
          <p className="text-xl text-muted-foreground">
            Track and monitor your reported cybersecurity incidents
          </p>
        </div>

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
                      <SelectItem value="open">Open</SelectItem>
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
                                Case {case_.id}
                              </h3>
                              <p className="text-muted-foreground text-sm">{case_.type}</p>
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
                    <p className="text-muted-foreground font-mono">{selectedCase.id}</p>
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
                  
                  <div>
                    <h4 className="font-semibold mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        Submitted: {new Date(selectedCase.submittedAt).toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">
                        Last Updated: {new Date(selectedCase.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedCase.assignedTo && (
                    <div>
                      <h4 className="font-semibold mb-2">Assigned Agent</h4>
                      <p className="text-muted-foreground">{selectedCase.assignedTo}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 space-y-2">
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Agent
                    </Button>
                    <Button className="w-full" variant="outline">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Update Case
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Case</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Click on a case from the list to view its details
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild>
                  <a href="/report">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report New Incident
                  </a>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/link-checker">
                    <Search className="h-4 w-4 mr-2" />
                    Check Suspicious Link
                  </a>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Help
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cases;