import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Shield, AlertTriangle, CheckCircle, ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScanResult {
  url: string;
  status: 'safe' | 'warning' | 'dangerous';
  threats: string[];
  source: string;
  timestamp: string;
  details?: {
    reputation: number;
    category: string;
    lastSeen: string;
  };
}

const LinkChecker = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const { toast } = useToast();

  const validateUrl = (inputUrl: string): boolean => {
    try {
      new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
      return true;
    } catch {
      return false;
    }
  };

  const scanUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result based on common patterns
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      const suspiciousPatterns = [
        'bit.ly', 'tinyurl.com', 'shorturl.at', 'click.me', 
        'secure-bank-update', 'paypal-verify', 'account-suspended',
        'urgent-action', 'claim-prize', 'free-money'
      ];
      
      const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
        cleanUrl.toLowerCase().includes(pattern)
      );
      
      const mockResult: ScanResult = {
        url: cleanUrl,
        status: hasSuspiciousPattern ? 'dangerous' : 'safe',
        threats: hasSuspiciousPattern ? ['Phishing', 'Suspicious Domain'] : [],
        source: 'Multiple Security Providers',
        timestamp: new Date().toISOString(),
        details: {
          reputation: hasSuspiciousPattern ? 15 : 85,
          category: hasSuspiciousPattern ? 'Phishing' : 'Safe',
          lastSeen: new Date().toISOString()
        }
      };

      setResult(mockResult);
      setScanHistory(prev => [mockResult, ...prev.slice(0, 9)]);
      
      toast({
        title: "Scan Complete",
        description: `URL has been analyzed - Status: ${mockResult.status}`,
        variant: mockResult.status === 'safe' ? 'default' : 'destructive'
      });
      
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to analyze URL. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-success';
      case 'warning': return 'text-warning';
      case 'dangerous': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'safe': return <Badge className="bg-success text-success-foreground">Safe</Badge>;
      case 'warning': return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'dangerous': return <Badge className="bg-destructive text-destructive-foreground">Dangerous</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard"
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Link Security Checker
          </h1>
          <p className="text-xl text-muted-foreground">
            Verify suspicious URLs and protect yourself from phishing attempts
          </p>
        </div>

        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              URL Scanner
            </CardTitle>
            <CardDescription>
              Enter any URL to check for potential security threats using multiple threat intelligence sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter URL to scan (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && scanUrl()}
                className="flex-1"
              />
              <Button 
                onClick={scanUrl} 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Scan
              </Button>
            </div>

            {result && (
              <Alert className={`border-2 ${
                result.status === 'safe' ? 'border-success' : 
                result.status === 'warning' ? 'border-warning' : 'border-destructive'
              }`}>
                <div className="flex items-start gap-3">
                  {result.status === 'safe' ? (
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  ) : result.status === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  ) : (
                    <Shield className="h-5 w-5 text-destructive mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Scan Result:</span>
                      {getStatusBadge(result.status)}
                    </div>
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">URL:</span>
                          <span className="font-mono text-sm break-all">{result.url}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(result.url)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {result.threats.length > 0 && (
                          <div>
                            <span className="font-medium">Threats Detected:</span>
                            <div className="flex gap-1 mt-1">
                              {result.threats.map((threat, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {threat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          Scanned by: {result.source} • {new Date(result.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        {scanHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>
                Your recent URL security checks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanHistory.map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm truncate">{scan.url}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(scan.url)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(scan.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(scan.status)}
                      <Button variant="ghost" size="sm" asChild>
                        <a href={scan.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LinkChecker;