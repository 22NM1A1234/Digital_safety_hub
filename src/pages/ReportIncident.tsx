import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Upload, FileText, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    incidentType: "",
    urgency: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    occurredAt: "",
    evidence: [] as File[],
    anonymous: false,
    location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const incidentTypes = [
    "Cyberbullying/Online Harassment",
    "Phishing/Email Scams",
    "Identity Theft",
    "Financial Fraud",
    "Malware/Virus Attack",
    "Data Breach",
    "Social Media Impersonation",
    "Romance/Dating Scams",
    "Investment/Cryptocurrency Scams",
    "Other"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low - No immediate threat" },
    { value: "medium", label: "Medium - Concerning but not urgent" },
    { value: "high", label: "High - Active threat or ongoing" },
    { value: "critical", label: "Critical - Immediate danger" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a report.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const reportData = {
        incident_type: formData.incidentType,
        urgency: formData.urgency,
        description: formData.description,
        incident_date: formData.occurredAt || null,
        location: formData.location || null,
        is_anonymous: formData.anonymous,
        contact_email: formData.anonymous ? null : (formData.contactEmail || user.email),
        contact_phone: formData.anonymous ? null : formData.contactPhone,
        evidence_files: formData.evidence.map(file => file.name)
      };

      console.log('Submitting report data:', reportData);

      const { data, error } = await supabase.functions.invoke('submit-report', {
        body: reportData  // Don't stringify - Supabase handles this automatically
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to submit report');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to submit report');
      }

      toast({
        title: "Report Submitted Successfully",
        description: `Your case ID is ${data.case_id}. Track your report in the User Dashboard.`,
      });

      // Reset form
      setFormData({
        incidentType: "",
        urgency: "",
        description: "",
        contactEmail: "",
        contactPhone: "",
        occurredAt: "",
        evidence: [],
        anonymous: false,
        location: ""
      });

    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      evidence: [...prev.evidence, ...files].slice(0, 5) // Max 5 files
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Report a Digital Threat
          </h1>
          <p className="text-xl text-muted-foreground">
            Safely report cybersecurity incidents with our secure, confidential system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Incident Report Form
                </CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us investigate your case effectively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incidentType">Type of Incident *</Label>
                      <Select 
                        value={formData.incidentType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, incidentType: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                        <SelectContent>
                          {incidentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level *</Label>
                      <Select 
                        value={formData.urgency} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Incident Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe what happened, including dates, times, and any relevant details..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occurredAt">When did this occur?</Label>
                    <Input
                      id="occurredAt"
                      type="datetime-local"
                      value={formData.occurredAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, occurredAt: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={formData.anonymous}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, anonymous: checked as boolean }))
                        }
                      />
                      <Label htmlFor="anonymous">Submit this report anonymously</Label>
                    </div>

                    {!formData.anonymous && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Contact Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
                          <Input
                            id="contactPhone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidence">Upload Evidence (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <Input
                        id="evidence"
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Label htmlFor="evidence" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">Click to upload files</span>
                        <span className="text-muted-foreground block text-sm mt-1">
                          Screenshots, documents, emails (Max 5 files, 10MB each)
                        </span>
                      </Label>
                    </div>
                    {formData.evidence.length > 0 && (
                      <div className="space-y-2">
                        {formData.evidence.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4" />
                            <span>{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  evidence: prev.evidence.filter((_, i) => i !== index)
                                }));
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting Report..." : "Submit Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Your Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Confidential Reporting</h4>
                  <p className="text-muted-foreground">
                    All reports are encrypted and handled with strict confidentiality by our security team.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Anonymous Option</h4>
                  <p className="text-muted-foreground">
                    You can submit reports anonymously, though providing contact information helps our investigation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quick Response</h4>
                  <p className="text-muted-foreground">
                    We aim to respond to all reports within 24 hours, with critical cases handled immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">Immediate Danger</p>
                  <p className="text-muted-foreground">Call local emergency services (911)</p>
                </div>
                <div>
                  <p className="font-semibold">FBI IC3</p>
                  <p className="text-muted-foreground">Internet Crime Complaint Center</p>
                  <p className="text-primary">ic3.gov</p>
                </div>
                <div>
                  <p className="font-semibold">FTC Fraud</p>
                  <p className="text-muted-foreground">Federal Trade Commission</p>
                  <p className="text-primary">reportfraud.ftc.gov</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;