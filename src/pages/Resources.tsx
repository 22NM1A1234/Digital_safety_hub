import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Shield, AlertTriangle, Lock, Smartphone, CreditCard, Mail, Users, ExternalLink, BookOpen } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'guide' | 'tool' | 'article' | 'video';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
  readTime?: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen },
    { id: "phishing", name: "Phishing Protection", icon: Mail },
    { id: "passwords", name: "Password Security", icon: Lock },
    { id: "mobile", name: "Mobile Safety", icon: Smartphone },
    { id: "financial", name: "Financial Security", icon: CreditCard },
    { id: "privacy", name: "Privacy Protection", icon: Shield },
    { id: "social", name: "Social Media Safety", icon: Users },
  ];

  const resources: Resource[] = [
    {
      id: "1",
      title: "How to Spot Phishing Emails",
      description: "Learn to identify common signs of phishing attacks and protect yourself from email scams.",
      category: "phishing",
      type: "guide",
      difficulty: "beginner",
      readTime: "5 min"
    },
    {
      id: "2",
      title: "Creating Strong Passwords",
      description: "Best practices for creating and managing secure passwords that protect your accounts.",
      category: "passwords",
      type: "guide",
      difficulty: "beginner",
      readTime: "7 min"
    },
    {
      id: "3",
      title: "Two-Factor Authentication Setup",
      description: "Step-by-step guide to enabling 2FA on your most important accounts.",
      category: "passwords",
      type: "guide",
      difficulty: "intermediate",
      readTime: "10 min"
    },
    {
      id: "4",
      title: "Mobile Device Security Checklist",
      description: "Essential security settings and apps to protect your smartphone and tablet.",
      category: "mobile",
      type: "guide",
      difficulty: "intermediate",
      readTime: "8 min"
    },
    {
      id: "5",
      title: "Safe Online Banking Practices",
      description: "How to bank online safely and protect your financial information from cyber criminals.",
      category: "financial",
      type: "guide",
      difficulty: "beginner",
      readTime: "6 min"
    },
    {
      id: "6",
      title: "Social Media Privacy Settings",
      description: "Configure privacy settings on popular social media platforms to protect your personal information.",
      category: "social",
      type: "guide",
      difficulty: "beginner",
      readTime: "12 min"
    },
    {
      id: "7",
      title: "VPN Setup and Usage",
      description: "Understanding Virtual Private Networks and how to use them to protect your online privacy.",
      category: "privacy",
      type: "guide",
      difficulty: "intermediate",
      readTime: "15 min"
    },
    {
      id: "8",
      title: "Identifying Romance Scams",
      description: "Warning signs and red flags to watch out for in online dating and social interactions.",
      category: "social",
      type: "article",
      difficulty: "beginner",
      readTime: "8 min"
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Badge className="bg-success text-success-foreground">Beginner</Badge>;
      case 'intermediate': return <Badge className="bg-warning text-warning-foreground">Intermediate</Badge>;
      case 'advanced': return <Badge className="bg-destructive text-destructive-foreground">Advanced</Badge>;
      default: return <Badge variant="secondary">{difficulty}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'tool': return <Shield className="h-4 w-4" />;
      case 'article': return <Mail className="h-4 w-4" />;
      case 'video': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cyber Safety Resources
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn how to protect yourself online with our comprehensive security guides and tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">No resources found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or selecting a different category
                  </p>
                </div>
              ) : (
                filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(resource.type)}
                          <span className="text-sm text-muted-foreground capitalize">{resource.type}</span>
                        </div>
                        {getDifficultyBadge(resource.difficulty)}
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {resource.readTime && (
                            <span>{resource.readTime} read</span>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          {resource.url ? (
                            <>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open Guide
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-4 w-4 mr-1" />
                              Read More
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="mt-12">
              <Card className="bg-gradient-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Emergency Resources
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/90">
                    Important contacts and resources for immediate cybersecurity threats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">FBI Internet Crime Complaint Center</h4>
                      <p className="text-primary-foreground/90 text-sm mb-2">
                        Report internet crimes and cyber incidents to federal authorities
                      </p>
                      <Button variant="secondary" size="sm" asChild>
                        <a href="https://ic3.gov" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit IC3.gov
                        </a>
                      </Button>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">FTC Fraud Reporting</h4>
                      <p className="text-primary-foreground/90 text-sm mb-2">
                        Report fraud and scams to the Federal Trade Commission
                      </p>
                      <Button variant="secondary" size="sm" asChild>
                        <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Report Fraud
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;