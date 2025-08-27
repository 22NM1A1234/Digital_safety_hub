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
      icon: Bell,
      title: "Crime Alerts",
      description: "Get real-time alerts about crime and safety incidents in your area.",
      href: "/crime-alerts",
      color: "text-warning"
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
    <div className="bg-background -m-4 sm:-m-6">
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 animate-slide-up">
              Protect Your Digital Life
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto animate-slide-up px-4">
              Report cyber threats, verify suspicious links, and access expert guidance to stay safe online
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up px-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 h-12 text-base">
                <Link to="/link-checker">Check Suspicious Link</Link>
              </Button>
              <Button asChild variant="hero" size="lg" className="h-12 text-base">
                <Link to="/report">Report Incident</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4">
                  <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
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
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Solution For Your Business
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              We make it easy for users to use our platform, that's why we provide the benefit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-4 sm:p-6 bg-card rounded-lg border border-border hover:shadow-sm transition-all duration-300 touch-manipulation">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link to={feature.href} className="text-primary text-xs sm:text-sm font-medium hover:underline touch-manipulation">
                    Learn more
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 sm:mb-6">
            Ready to Secure Your Digital Presence?
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-6 sm:mb-8">
            Join thousands of users who trust our platform to keep them safe online
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="h-12 text-base touch-manipulation">
              <Link to="/link-checker">Start Link Check</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="h-12 text-base touch-manipulation">
              <Link to="/resources">View Resources</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;