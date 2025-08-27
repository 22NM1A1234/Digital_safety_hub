import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, AlertTriangle, FileText, MessageCircle, TrendingUp, Bell, MapPin } from "lucide-react";
import { useAlerts } from "@/contexts/AlertContext";
import heroImage from "@/assets/hero-cybersecurity.jpg";

const Home = () => {
  const { alerts, unreadCount } = useAlerts();
  
  const features = [
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Complete digital protection with advanced threat detection and real-time monitoring for all your online activities.",
      href: "/link-checker",
      variant: "default"
    },
    {
      icon: Search,
      title: "Threat Detection",
      description: "Advanced AI-powered scanning to identify and neutralize phishing attempts, malware, and suspicious content.",
      href: "/report",
      variant: "primary"
    },
    {
      icon: AlertTriangle,
      title: "Incident Response", 
      description: "Rapid response system for reporting and tracking cybersecurity incidents with expert guidance.",
      href: "/crime-alerts",
      variant: "default"
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
              <Button asChild variant="hero" size="lg">
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

      {/* Recent Alerts Section */}
      {alerts.length > 0 && (
        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-l-4 border-l-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-warning" />
                  Recent Safety Alerts ({unreadCount} new)
                </CardTitle>
                <CardDescription>
                  Latest crime and safety alerts in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 2).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                        {alert.location && (
                          <p className="text-xs text-muted-foreground mt-1">📍 {alert.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link to="/crime-alerts">View All Alerts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our services
            </h2>
            <p className="text-4xl md:text-5xl font-bold text-foreground max-w-4xl mx-auto">
              Services for your digital security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isHighlighted = feature.variant === "primary";
              return (
                <Card 
                  key={index} 
                  className={`
                    ${isHighlighted 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-muted/30 border-border'
                    } 
                    hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 rounded-2xl p-8 text-center
                  `}
                >
                  <CardHeader className="pb-4">
                    <div className={`
                      w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center
                      ${isHighlighted 
                        ? 'bg-warning text-warning-foreground' 
                        : 'bg-primary text-primary-foreground'
                      }
                    `}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className={`text-2xl font-bold ${isHighlighted ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <CardDescription className={`text-base leading-relaxed mb-6 ${isHighlighted ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                      {feature.description}
                    </CardDescription>
                    <Button 
                      asChild 
                      variant={isHighlighted ? "secondary" : "default"}
                      className="font-semibold"
                    >
                      <Link to={feature.href} className="inline-flex items-center gap-2">
                        LEARN MORE 
                        <span className="text-lg">→</span>
                      </Link>
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
            <Button asChild size="lg" variant="secondary">
              <Link to="/resources">View Resources</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;