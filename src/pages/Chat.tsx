import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Shield, AlertTriangle, HelpCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'quick-reply' | 'normal';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Digital Safety Assistant. I'm here to help you with cybersecurity questions, identify threats, and provide guidance on staying safe online. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "How do I spot phishing emails?",
    "Is this link safe to click?",
    "Help with password security",
    "Report a cyber incident",
    "Social media privacy tips"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('phishing') || message.includes('email')) {
      return "🎣 **Phishing Protection Tips:**\n\n• Check sender's email address carefully\n• Look for spelling/grammar errors\n• Hover over links to see real URLs\n• Never enter passwords from email links\n• When in doubt, contact the company directly\n\nWould you like me to help you analyze a specific email?";
    }
    
    if (message.includes('password')) {
      return "🔒 **Password Security Best Practices:**\n\n• Use unique passwords for each account\n• Make passwords 12+ characters long\n• Include uppercase, lowercase, numbers, symbols\n• Use a password manager\n• Enable two-factor authentication\n\nNeed help setting up 2FA or choosing a password manager?";
    }
    
    if (message.includes('link') || message.includes('url')) {
      return "🔍 **Link Safety Check:**\n\nI can help you verify suspicious links! You can:\n\n• Use our Link Checker tool for automated scanning\n• Look for these red flags:\n  - Shortened URLs (bit.ly, tinyurl)\n  - Misspelled domains\n  - Urgent language\n  - Requests for personal info\n\nWould you like me to guide you to our Link Checker tool?";
    }
    
    if (message.includes('social media') || message.includes('privacy')) {
      return "🔐 **Social Media Privacy Tips:**\n\n• Review privacy settings regularly\n• Limit personal information sharing\n• Be cautious with friend requests\n• Don't share location in real-time\n• Think before posting personal details\n\nWant specific guidance for Facebook, Instagram, or Twitter?";
    }
    
    if (message.includes('report') || message.includes('incident')) {
      return "🚨 **Reporting Cyber Incidents:**\n\nI can help you report various threats:\n\n• Cyberbullying/harassment\n• Phishing attempts\n• Identity theft\n• Financial fraud\n• Malware attacks\n\nFor immediate reporting, use our Incident Report form. For emergencies, contact local authorities first. Would you like me to guide you to the reporting tool?";
    }
    
    if (message.includes('scam') || message.includes('fraud')) {
      return "⚠️ **Common Scam Warning Signs:**\n\n• Urgent language (\"Act now!\")\n• Requests for personal/financial info\n• Too-good-to-be-true offers\n• Pressure to send money quickly\n• Poor spelling/grammar\n\nIf you've encountered a potential scam, consider reporting it through our incident form. Need help with a specific situation?";
    }

    return "I'm here to help with cybersecurity questions! I can assist with:\n\n• Identifying phishing and scams\n• Password and account security\n• Social media privacy\n• Reporting cyber incidents\n• Mobile device safety\n• Online shopping security\n\nWhat specific cybersecurity topic would you like to learn about?";
  };

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(content),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            Cybersecurity Help Chat
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Get instant help and guidance from our AI security assistant
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Card className="h-[500px] sm:h-[600px] flex flex-col shadow-elegant">
              <CardHeader className="border-b p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Security Assistant
                  <Badge className="bg-success text-success-foreground ml-2 text-xs">Online</Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  Ask questions about cybersecurity, report threats, or get safety tips
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] md:max-w-[75%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                        <AvatarFallback className={
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent text-accent-foreground'
                        }>
                          {message.sender === 'user' ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-lg p-2 sm:p-3 min-w-0 flex-1 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm break-words overflow-wrap-anywhere hyphens-auto">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-1 sm:mt-2 ${
                          message.sender === 'user' 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 sm:gap-3 justify-start">
                    <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-2 sm:p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>
              
              <div className="border-t p-3 sm:p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about cybersecurity..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button 
                    onClick={() => sendMessage()} 
                    disabled={!inputMessage.trim()}
                    size="sm"
                    className="h-10 w-10 sm:h-auto sm:w-auto sm:px-3 touch-manipulation"
                  >
                    <Send className="w-4 h-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2 hidden sm:inline">Send</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Quick Questions */}
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 sm:p-6 pt-0">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto py-2 sm:py-3 px-3 text-wrap touch-manipulation"
                    onClick={() => sendMessage(reply)}
                  >
                    <span className="text-xs sm:text-sm leading-tight whitespace-normal break-words hyphens-auto">
                      {reply}
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Actions */}
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Emergency Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
                <Button className="w-full h-auto py-2 sm:py-3 px-3 touch-manipulation" variant="destructive" asChild>
                  <a href="/report" className="flex items-center justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm leading-tight whitespace-normal break-words">
                      Report Incident
                    </span>
                  </a>
                </Button>
                <Button className="w-full h-auto py-2 sm:py-3 px-3 touch-manipulation" variant="outline" asChild>
                  <a href="/link-checker" className="flex items-center justify-start">
                    <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm leading-tight whitespace-normal break-words">
                      Check Suspicious Link
                    </span>
                  </a>
                </Button>
                <Button className="w-full h-auto py-2 sm:py-3 px-3 touch-manipulation" variant="outline" asChild>
                  <a href="/resources" className="flex items-center justify-start">
                    <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm leading-tight whitespace-normal break-words">
                      View Safety Guides
                    </span>
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Chat Features - Hidden on smaller screens to save space */}
            <Card className="hidden sm:block">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Chat Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">24/7 Availability</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">Our AI assistant is always available to help</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Instant Responses</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">Get immediate guidance on cybersecurity topics</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Expert Knowledge</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm">Trained on latest cybersecurity best practices</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;