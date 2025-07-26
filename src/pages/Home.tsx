import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, AlertTriangle, FileText, MessageCircle, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-cybersecurity.jpg";

const Home = () => {
  const features = [
    {
      icon: Search,
      title: "Link Checker",
      description: "Verify suspicious links and URLs for phishing attempts using advanced threat detection.",
      href: "/link-checker",
      color: "text-primary"
    },
    {
      icon: AlertTriangle,
      title: "Report Incidents",
      description: "Safely report cyberbullying, scams, and other digital threats with our secure system.",
      href: "/report",
      color: "text-warning"
    },
    {
      icon: FileText,
      title: "Track Cases",
      description: "Monitor the status of your reported incidents and receive updates on investigations.",
      href: "/cases",
      color: "text-success"
    },
    {
      icon: MessageCircle,
      title: "Get Help",
      description: "Chat with our AI assistant for immediate cybersecurity guidance and support.",
      href: "/chat",
      color: "text-accent"
    }
  ];

  const stats = [
    { label: "Threats Detected", value: "15,847", icon: Shield },
    { label: "Cases Resolved", value: "12,340", icon: FileText },
    { label: "Users Protected", value: "50,000+", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              Protect Your Digital Life
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-slide-up">
              Report cyber threats, verify suspicious links, and access expert guidance to stay safe online
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/link-checker">Check Suspicious Link</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/report">Report Incident</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Digital Protection
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform provides all the tools you need to stay safe in the digital world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
                  <CardHeader>
                    <Icon className={`h-12 w-12 ${feature.color} mb-4`} />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">
                      {feature.description}
                    </CardDescription>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={feature.href}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Secure Your Digital Presence?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of users who trust our platform to keep them safe online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/link-checker">Start Link Check</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/resources">View Resources</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;