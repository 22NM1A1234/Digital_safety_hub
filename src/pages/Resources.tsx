import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Search, Shield, AlertTriangle, Lock, Smartphone, CreditCard, Mail, Users, ExternalLink, BookOpen, X } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'guide' | 'tool' | 'article' | 'video';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
  readTime?: string;
  content: string;
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
      readTime: "5 min",
      content: `
        <h2>What is Phishing?</h2>
        <p>Phishing is a type of cyber attack where criminals impersonate legitimate organizations to steal sensitive information like passwords, credit card details, or personal data.</p>
        
        <h2>Warning Signs of Phishing Emails</h2>
        <ul>
          <li><strong>Urgent or threatening language:</strong> "Your account will be closed!" or "Immediate action required!"</li>
          <li><strong>Generic greetings:</strong> "Dear Customer" instead of your actual name</li>
          <li><strong>Suspicious sender addresses:</strong> Check for misspellings or unfamiliar domains</li>
          <li><strong>Unexpected attachments:</strong> Don't open attachments from unknown senders</li>
          <li><strong>Suspicious links:</strong> Hover over links to see the real destination</li>
          <li><strong>Poor grammar and spelling:</strong> Professional organizations rarely send emails with obvious errors</li>
          <li><strong>Requests for sensitive information:</strong> Legitimate companies don't ask for passwords via email</li>
        </ul>
        
        <h2>How to Protect Yourself</h2>
        <ol>
          <li><strong>Verify the sender:</strong> Contact the organization directly using official contact information</li>
          <li><strong>Don't click suspicious links:</strong> Type URLs directly into your browser</li>
          <li><strong>Use spam filters:</strong> Enable email security features</li>
          <li><strong>Keep software updated:</strong> Install security patches regularly</li>
          <li><strong>Trust your instincts:</strong> If something feels wrong, it probably is</li>
        </ol>
        
        <h2>What to Do If You've Been Phished</h2>
        <ul>
          <li>Change your passwords immediately</li>
          <li>Contact your bank and credit card companies</li>
          <li>Monitor your accounts for suspicious activity</li>
          <li>Report the incident to authorities</li>
        </ul>
      `
    },
    {
      id: "2",
      title: "Creating Strong Passwords",
      description: "Best practices for creating and managing secure passwords that protect your accounts.",
      category: "passwords",
      type: "guide",
      difficulty: "beginner",
      readTime: "7 min",
      content: `
        <h2>Why Strong Passwords Matter</h2>
        <p>Weak passwords are one of the easiest ways for cybercriminals to gain access to your accounts. A strong password is your first line of defense against unauthorized access.</p>
        
        <h2>Characteristics of Strong Passwords</h2>
        <ul>
          <li><strong>Length:</strong> At least 12 characters (longer is better)</li>
          <li><strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, and symbols</li>
          <li><strong>Uniqueness:</strong> Different password for each account</li>
          <li><strong>Unpredictability:</strong> Avoid personal information or common patterns</li>
        </ul>
        
        <h2>Password Creation Methods</h2>
        <h3>1. Passphrase Method</h3>
        <p>Create a memorable sentence and modify it:</p>
        <ul>
          <li>Original: "I love pizza on Friday nights"</li>
          <li>Modified: "1L0v3P1zz@0nFr1d4yN1ght5!"</li>
        </ul>
        
        <h3>2. Random Password Generator</h3>
        <p>Use a password manager to generate truly random passwords like: "K9#mP$vL2@nX8wQ"</p>
        
        <h2>Password Management Tips</h2>
        <ol>
          <li><strong>Use a password manager:</strong> Tools like Bitwarden, 1Password, or LastPass</li>
          <li><strong>Enable two-factor authentication:</strong> Add an extra layer of security</li>
          <li><strong>Change compromised passwords:</strong> Update immediately if a service is breached</li>
          <li><strong>Don't reuse passwords:</strong> Each account should have a unique password</li>
        </ol>
        
        <h2>What to Avoid</h2>
        <ul>
          <li>Personal information (birthdays, names, addresses)</li>
          <li>Common passwords ("password123", "qwerty")</li>
          <li>Sequential numbers or letters</li>
          <li>Writing passwords down in visible places</li>
        </ul>
      `
    },
    {
      id: "3",
      title: "Two-Factor Authentication Setup",
      description: "Step-by-step guide to enabling 2FA on your most important accounts.",
      category: "passwords",
      type: "guide",
      difficulty: "intermediate",
      readTime: "10 min",
      content: `
        <h2>What is Two-Factor Authentication (2FA)?</h2>
        <p>2FA adds an extra layer of security by requiring two different authentication factors: something you know (password) and something you have (phone, app, or hardware token).</p>
        
        <h2>Types of 2FA</h2>
        <h3>1. SMS Text Messages</h3>
        <ul>
          <li><strong>Pros:</strong> Easy to set up, works on any phone</li>
          <li><strong>Cons:</strong> Vulnerable to SIM swapping attacks</li>
        </ul>
        
        <h3>2. Authenticator Apps</h3>
        <ul>
          <li><strong>Recommended apps:</strong> Google Authenticator, Authy, Microsoft Authenticator</li>
          <li><strong>Pros:</strong> More secure than SMS, works offline</li>
          <li><strong>Cons:</strong> Can be lost if phone is damaged</li>
        </ul>
        
        <h3>3. Hardware Tokens</h3>
        <ul>
          <li><strong>Examples:</strong> YubiKey, Google Titan</li>
          <li><strong>Pros:</strong> Most secure option, phishing-resistant</li>
          <li><strong>Cons:</strong> Cost, can be lost</li>
        </ul>
        
        <h2>Setting Up 2FA - Step by Step</h2>
        <h3>For Gmail/Google Account:</h3>
        <ol>
          <li>Go to myaccount.google.com</li>
          <li>Click "Security" in the left menu</li>
          <li>Under "Signing in to Google," click "2-Step Verification"</li>
          <li>Click "Get Started" and follow the prompts</li>
          <li>Choose your preferred second factor (phone, app, or token)</li>
          <li>Save your backup codes in a secure location</li>
        </ol>
        
        <h3>For Other Services:</h3>
        <ol>
          <li>Log into your account settings</li>
          <li>Look for "Security," "Privacy," or "Account" settings</li>
          <li>Find "Two-Factor Authentication" or "2FA"</li>
          <li>Choose your preferred method</li>
          <li>Follow the setup instructions</li>
          <li>Test the setup before logging out</li>
        </ol>
        
        <h2>Priority Accounts for 2FA</h2>
        <ol>
          <li>Email accounts (Gmail, Outlook, Yahoo)</li>
          <li>Banking and financial services</li>
          <li>Social media accounts</li>
          <li>Cloud storage (Google Drive, Dropbox, iCloud)</li>
          <li>Work-related accounts</li>
          <li>Password managers</li>
        </ol>
        
        <h2>Backup and Recovery</h2>
        <ul>
          <li><strong>Save backup codes:</strong> Store them securely offline</li>
          <li><strong>Set up multiple methods:</strong> Don't rely on just one device</li>
          <li><strong>Update contact info:</strong> Keep recovery options current</li>
        </ul>
      `
    },
    {
      id: "4",
      title: "Mobile Device Security Checklist",
      description: "Essential security settings and apps to protect your smartphone and tablet.",
      category: "mobile",
      type: "guide",
      difficulty: "intermediate",
      readTime: "8 min",
      content: `
        <h2>Basic Security Settings</h2>
        <h3>Screen Lock</h3>
        <ul>
          <li>Use a strong PIN (6+ digits), pattern, or biometric lock</li>
          <li>Set auto-lock to 1-2 minutes of inactivity</li>
          <li>Disable lock screen notifications for sensitive apps</li>
        </ul>
        
        <h3>System Updates</h3>
        <ul>
          <li>Enable automatic security updates</li>
          <li>Install iOS/Android updates promptly</li>
          <li>Keep all apps updated</li>
        </ul>
        
        <h2>App Security</h2>
        <h3>App Permissions</h3>
        <ul>
          <li>Review permissions before installing apps</li>
          <li>Regularly audit app permissions in settings</li>
          <li>Deny unnecessary permissions (camera, location, contacts)</li>
        </ul>
        
        <h3>App Sources</h3>
        <ul>
          <li>Only download from official app stores</li>
          <li>Avoid sideloading apps from unknown sources</li>
          <li>Read app reviews and check developer credentials</li>
        </ul>
        
        <h2>Network Security</h2>
        <h3>Wi-Fi Safety</h3>
        <ul>
          <li>Avoid public Wi-Fi for sensitive activities</li>
          <li>Use a VPN on public networks</li>
          <li>Forget public Wi-Fi networks after use</li>
          <li>Disable auto-connect to open networks</li>
        </ul>
        
        <h3>Bluetooth Security</h3>
        <ul>
          <li>Turn off Bluetooth when not in use</li>
          <li>Set device to non-discoverable</li>
          <li>Only pair with trusted devices</li>
        </ul>
        
        <h2>Data Protection</h2>
        <h3>Backup and Encryption</h3>
        <ul>
          <li>Enable device encryption</li>
          <li>Set up automatic cloud backups</li>
          <li>Use encrypted backup options</li>
        </ul>
        
        <h3>Remote Security</h3>
        <ul>
          <li>Enable Find My Device/Find My iPhone</li>
          <li>Set up remote wipe capability</li>
          <li>Configure location tracking for lost devices</li>
        </ul>
        
        <h2>Recommended Security Apps</h2>
        <ul>
          <li><strong>VPN:</strong> NordVPN, ExpressVPN, or Surfshark</li>
          <li><strong>Password Manager:</strong> Bitwarden, 1Password</li>
          <li><strong>Authenticator:</strong> Google Authenticator, Authy</li>
          <li><strong>Secure Messaging:</strong> Signal, WhatsApp</li>
        </ul>
        
        <h2>Red Flags to Watch For</h2>
        <ul>
          <li>Unexpected battery drain</li>
          <li>Unusual data usage</li>
          <li>Slow performance</li>
          <li>Unknown apps appearing</li>
          <li>Frequent crashes or freezing</li>
        </ul>
      `
    },
    {
      id: "5",
      title: "Safe Online Banking Practices",
      description: "How to bank online safely and protect your financial information from cyber criminals.",
      category: "financial",
      type: "guide",
      difficulty: "beginner",
      readTime: "6 min",
      content: `
        <h2>Before You Bank Online</h2>
        <h3>Device Security</h3>
        <ul>
          <li>Use your personal device, not public computers</li>
          <li>Ensure your device has updated antivirus software</li>
          <li>Keep your operating system and browser updated</li>
        </ul>
        
        <h3>Network Safety</h3>
        <ul>
          <li>Use secure, private Wi-Fi networks</li>
          <li>Avoid public Wi-Fi for banking</li>
          <li>Look for "https://" and the padlock icon</li>
        </ul>
        
        <h2>Safe Banking Habits</h2>
        <h3>Login Security</h3>
        <ul>
          <li>Always type your bank's URL directly or use bookmarks</li>
          <li>Never click links in emails claiming to be from your bank</li>
          <li>Use strong, unique passwords for each banking account</li>
          <li>Enable two-factor authentication if available</li>
        </ul>
        
        <h3>During Your Session</h3>
        <ul>
          <li>Log out completely when finished</li>
          <li>Don't save banking passwords in browsers</li>
          <li>Clear browser cache and cookies after banking</li>
          <li>Never leave your device unattended while logged in</li>
        </ul>
        
        <h2>Monitoring Your Accounts</h2>
        <h3>Regular Checks</h3>
        <ul>
          <li>Check accounts at least weekly</li>
          <li>Set up account alerts for transactions</li>
          <li>Review monthly statements carefully</li>
          <li>Monitor credit reports regularly</li>
        </ul>
        
        <h3>Mobile Banking Apps</h3>
        <ul>
          <li>Download apps only from official app stores</li>
          <li>Verify the app developer is your actual bank</li>
          <li>Enable app-specific PINs or biometric locks</li>
          <li>Log out after each session</li>
        </ul>
        
        <h2>Red Flags and Scams</h2>
        <h3>Phishing Attempts</h3>
        <ul>
          <li>Emails asking for account information</li>
          <li>Urgent messages about account problems</li>
          <li>Links to fake banking websites</li>
          <li>Phone calls requesting sensitive information</li>
        </ul>
        
        <h3>What Banks Will Never Do</h3>
        <ul>
          <li>Ask for passwords via email or phone</li>
          <li>Request sensitive information through text</li>
          <li>Send urgent threats to close accounts</li>
          <li>Ask you to verify information by clicking links</li>
        </ul>
        
        <h2>If Something Goes Wrong</h2>
        <ol>
          <li>Contact your bank immediately</li>
          <li>Change your passwords</li>
          <li>Monitor accounts closely</li>
          <li>File a police report if necessary</li>
          <li>Consider placing fraud alerts on credit reports</li>
        </ol>
      `
    },
    {
      id: "6",
      title: "Social Media Privacy Settings",
      description: "Configure privacy settings on popular social media platforms to protect your personal information.",
      category: "social",
      type: "guide",
      difficulty: "beginner",
      readTime: "12 min",
      content: `
        <h2>General Privacy Principles</h2>
        <ul>
          <li>Think before you post - once online, it's often permanent</li>
          <li>Limit who can see your posts and personal information</li>
          <li>Be cautious about location sharing</li>
          <li>Regularly review and update privacy settings</li>
        </ul>
        
        <h2>Facebook Privacy Settings</h2>
        <h3>Account Settings</h3>
        <ol>
          <li>Go to Settings & Privacy > Settings</li>
          <li>Click "Privacy" in the left menu</li>
          <li>Set "Who can see your future posts" to "Friends"</li>
          <li>Limit who can look you up using email/phone number</li>
          <li>Turn off search engine indexing</li>
        </ol>
        
        <h3>Profile Information</h3>
        <ul>
          <li>Limit who can see your friend list</li>
          <li>Hide your email and phone number</li>
          <li>Restrict access to photos and tagged content</li>
          <li>Review timeline and tagging settings</li>
        </ul>
        
        <h2>Instagram Privacy Settings</h2>
        <h3>Account Privacy</h3>
        <ol>
          <li>Go to Settings > Privacy</li>
          <li>Switch to a private account</li>
          <li>Control who can message you</li>
          <li>Limit story sharing and saving</li>
          <li>Turn off activity status</li>
        </ol>
        
        <h3>Story and Post Settings</h3>
        <ul>
          <li>Hide your story from specific people</li>
          <li>Turn off story resharing</li>
          <li>Disable location services</li>
          <li>Control comment permissions</li>
        </ul>
        
        <h2>Twitter/X Privacy Settings</h2>
        <h3>Basic Privacy</h3>
        <ol>
          <li>Go to Settings and Privacy > Privacy and Safety</li>
          <li>Control who can find you by email/phone</li>
          <li>Limit photo tagging</li>
          <li>Protect your tweets (make account private)</li>
        </ol>
        
        <h3>Data and Personalization</h3>
        <ul>
          <li>Limit ad personalization</li>
          <li>Control data sharing with partners</li>
          <li>Manage location information</li>
          <li>Review apps connected to your account</li>
        </ul>
        
        <h2>LinkedIn Privacy Settings</h2>
        <h3>Profile Visibility</h3>
        <ol>
          <li>Go to Settings & Privacy > Visibility</li>
          <li>Control who can see your profile and activity</li>
          <li>Limit who can see your connections</li>
          <li>Turn off active status</li>
        </ol>
        
        <h3>Communication Preferences</h3>
        <ul>
          <li>Control who can send you messages</li>
          <li>Limit connection requests</li>
          <li>Manage email and notification settings</li>
        </ul>
        
        <h2>TikTok Privacy Settings</h2>
        <h3>Account Privacy</h3>
        <ol>
          <li>Go to Settings and Privacy > Privacy</li>
          <li>Switch to a private account</li>
          <li>Control who can view your videos</li>
          <li>Limit who can send messages</li>
          <li>Turn off location services</li>
        </ol>
        
        <h2>Best Practices Across All Platforms</h2>
        <ul>
          <li><strong>Regular audits:</strong> Review settings quarterly</li>
          <li><strong>Friend requests:</strong> Only accept people you know</li>
          <li><strong>Third-party apps:</strong> Regularly review connected apps</li>
          <li><strong>Location sharing:</strong> Turn off unless necessary</li>
          <li><strong>Personal information:</strong> Minimize what you share publicly</li>
        </ul>
        
        <h2>What Not to Share</h2>
        <ul>
          <li>Full birth date</li>
          <li>Home address</li>
          <li>Phone numbers</li>
          <li>Travel plans in real-time</li>
          <li>Financial information</li>
          <li>Relationship status changes immediately</li>
        </ul>
      `
    },
    {
      id: "7",
      title: "VPN Setup and Usage",
      description: "Understanding Virtual Private Networks and how to use them to protect your online privacy.",
      category: "privacy",
      type: "guide",
      difficulty: "intermediate",
      readTime: "15 min",
      content: `
        <h2>What is a VPN?</h2>
        <p>A Virtual Private Network (VPN) creates an encrypted tunnel between your device and a VPN server, hiding your IP address and encrypting your internet traffic.</p>
        
        <h2>Benefits of Using a VPN</h2>
        <ul>
          <li><strong>Privacy protection:</strong> Hide your browsing activity from ISPs</li>
          <li><strong>Security on public Wi-Fi:</strong> Protect data on unsecured networks</li>
          <li><strong>Geographic restrictions:</strong> Access content from different regions</li>
          <li><strong>Prevent tracking:</strong> Limit website and advertiser tracking</li>
        </ul>
        
        <h2>When to Use a VPN</h2>
        <h3>Essential Situations</h3>
        <ul>
          <li>Public Wi-Fi networks (airports, cafes, hotels)</li>
          <li>Online banking and shopping</li>
          <li>Accessing sensitive work information remotely</li>
          <li>Traveling to countries with internet restrictions</li>
        </ul>
        
        <h3>Optional but Recommended</h3>
        <ul>
          <li>General web browsing for privacy</li>
          <li>Streaming services</li>
          <li>Torrenting or P2P file sharing</li>
          <li>Gaming to reduce lag or access servers</li>
        </ul>
        
        <h2>Choosing a VPN Service</h2>
        <h3>Key Features to Look For</h3>
        <ul>
          <li><strong>No-log policy:</strong> Service doesn't store your activity</li>
          <li><strong>Strong encryption:</strong> AES-256 or similar</li>
          <li><strong>Kill switch:</strong> Disconnects internet if VPN fails</li>
          <li><strong>Multiple server locations:</strong> Choose from various countries</li>
          <li><strong>Good speed:</strong> Minimal impact on connection speed</li>
        </ul>
        
        <h3>Recommended VPN Providers</h3>
        <ul>
          <li><strong>NordVPN:</strong> Strong security, large server network</li>
          <li><strong>ExpressVPN:</strong> Fast speeds, user-friendly</li>
          <li><strong>Surfshark:</strong> Unlimited devices, budget-friendly</li>
          <li><strong>CyberGhost:</strong> Good for streaming, easy to use</li>
          <li><strong>ProtonVPN:</strong> Strong privacy focus, free tier available</li>
        </ul>
        
        <h2>Setting Up a VPN</h2>
        <h3>On Windows/Mac</h3>
        <ol>
          <li>Choose and sign up for a VPN service</li>
          <li>Download the app from the provider's website</li>
          <li>Install and log in with your credentials</li>
          <li>Choose a server location</li>
          <li>Click connect and verify your new IP address</li>
        </ol>
        
        <h3>On Mobile Devices</h3>
        <ol>
          <li>Download the VPN app from App Store/Google Play</li>
          <li>Log in with your account credentials</li>
          <li>Grant necessary permissions</li>
          <li>Select a server and connect</li>
          <li>Enable auto-connect for untrusted networks</li>
        </ol>
        
        <h3>Router Setup (Advanced)</h3>
        <ol>
          <li>Check if your router supports VPN</li>
          <li>Access router admin panel</li>
          <li>Find VPN section in settings</li>
          <li>Enter VPN provider's configuration details</li>
          <li>Test connection and enable for all devices</li>
        </ol>
        
        <h2>VPN Best Practices</h2>
        <h3>Security Tips</h3>
        <ul>
          <li>Always verify the VPN is connected before browsing</li>
          <li>Use kill switch feature to prevent data leaks</li>
          <li>Choose servers closest to your location for speed</li>
          <li>Don't use free VPNs for sensitive activities</li>
        </ul>
        
        <h3>Performance Optimization</h3>
        <ul>
          <li>Test different server locations for best speed</li>
          <li>Use dedicated streaming servers when available</li>
          <li>Disconnect when not needed to save bandwidth</li>
          <li>Update VPN apps regularly</li>
        </ul>
        
        <h2>VPN Limitations</h2>
        <ul>
          <li>May slow down internet connection</li>
          <li>Some services block VPN traffic</li>
          <li>Not 100% anonymous (provider can still see traffic)</li>
          <li>May be illegal in some countries</li>
          <li>Can interfere with local network services</li>
        </ul>
        
        <h2>Alternatives and Additional Tools</h2>
        <ul>
          <li><strong>Tor Browser:</strong> For maximum anonymity</li>
          <li><strong>Secure DNS:</strong> Use Cloudflare (1.1.1.1) or Quad9</li>
          <li><strong>HTTPS Everywhere:</strong> Force secure connections</li>
          <li><strong>Privacy-focused browsers:</strong> Firefox with privacy extensions</li>
        </ul>
      `
    },
    {
      id: "8",
      title: "Identifying Romance Scams",
      description: "Warning signs and red flags to watch out for in online dating and social interactions.",
      category: "social",
      type: "article",
      difficulty: "beginner",
      readTime: "8 min",
      content: `
        <h2>What Are Romance Scams?</h2>
        <p>Romance scams occur when criminals create fake profiles on dating sites or social media to build relationships with victims, ultimately to steal money or personal information.</p>
        
        <h2>Common Romance Scam Tactics</h2>
        <h3>Profile Creation</h3>
        <ul>
          <li>Use stolen photos of attractive people</li>
          <li>Create detailed but fake biographical information</li>
          <li>Claim to be military personnel, doctors, or oil rig workers</li>
          <li>Often claim to be widowed or divorced</li>
        </ul>
        
        <h3>Relationship Building</h3>
        <ul>
          <li>Express strong emotions very quickly</li>
          <li>Write lengthy, romantic messages</li>
          <li>Claim to feel an instant connection</li>
          <li>Share fabricated personal stories to build trust</li>
        </ul>
        
        <h2>Red Flags to Watch For</h2>
        <h3>Communication Patterns</h3>
        <ul>
          <li><strong>Too perfect too fast:</strong> Immediate declarations of love</li>
          <li><strong>Avoids phone calls or video chats:</strong> Always has excuses</li>
          <li><strong>Grammar and language:</strong> Poor English or inconsistent patterns</li>
          <li><strong>Generic messages:</strong> Responses that could apply to anyone</li>
        </ul>
        
        <h3>Profile Red Flags</h3>
        <ul>
          <li>Limited photos or professional-looking images</li>
          <li>Inconsistencies in their story over time</li>
          <li>Claims to live nearby but can't meet in person</li>
          <li>Profile created recently with minimal information</li>
        </ul>
        
        <h3>Behavioral Warning Signs</h3>
        <ul>
          <li>Wants to move communication off the dating platform quickly</li>
          <li>Asks many personal questions but avoids answering yours</li>
          <li>Stories don't add up when questioned</li>
          <li>Becomes angry or defensive when you ask for proof</li>
        </ul>
        
        <h2>Financial Request Tactics</h2>
        <h3>Common Scenarios</h3>
        <ul>
          <li><strong>Emergency situations:</strong> Sudden illness, accident, or arrest</li>
          <li><strong>Travel expenses:</strong> Money needed to visit you</li>
          <li><strong>Work-related issues:</strong> Stuck overseas, equipment problems</li>
          <li><strong>Family emergencies:</strong> Sick relative or child in trouble</li>
        </ul>
        
        <h3>Money Request Methods</h3>
        <ul>
          <li>Wire transfers (untraceable)</li>
          <li>Gift cards or prepaid cards</li>
          <li>Cryptocurrency</li>
          <li>Money transfer apps</li>
          <li>Fake check schemes</li>
        </ul>
        
        <h2>How to Protect Yourself</h2>
        <h3>Verification Steps</h3>
        <ol>
          <li><strong>Reverse image search:</strong> Check if photos appear elsewhere online</li>
          <li><strong>Video chat:</strong> Insist on live video calls</li>
          <li><strong>Ask specific questions:</strong> Request details about their location or work</li>
          <li><strong>Trust your instincts:</strong> If something feels wrong, it probably is</li>
        </ol>
        
        <h3>Safe Dating Practices</h3>
        <ul>
          <li>Meet in public places for first dates</li>
          <li>Tell friends or family about your plans</li>
          <li>Don't share personal financial information</li>
          <li>Take relationships slowly</li>
          <li>Verify identity before sharing sensitive details</li>
        </ul>
        
        <h2>If You Suspect a Scam</h2>
        <h3>Immediate Actions</h3>
        <ol>
          <li>Stop all communication immediately</li>
          <li>Don't send any money or gifts</li>
          <li>Report the profile to the dating platform</li>
          <li>Save all conversations and evidence</li>
        </ol>
        
        <h3>If You've Been Scammed</h3>
        <ol>
          <li>Contact your bank or credit card company</li>
          <li>Report to the FTC at ReportFraud.ftc.gov</li>
          <li>File a complaint with IC3.gov</li>
          <li>Consider placing fraud alerts on your credit</li>
          <li>Seek emotional support from friends, family, or counselors</li>
        </ol>
        
        <h2>Emotional Recovery</h2>
        <p>Being a victim of a romance scam can be emotionally devastating. Remember:</p>
        <ul>
          <li>You are not to blame - scammers are skilled manipulators</li>
          <li>It's normal to feel embarrassed, but don't let it prevent you from seeking help</li>
          <li>Consider counseling or support groups</li>
          <li>Don't give up on genuine relationships</li>
          <li>Learn from the experience to protect yourself in the future</li>
        </ul>
        
        <h2>Resources for Help</h2>
        <ul>
          <li><strong>FTC Romance Scam Information:</strong> consumer.ftc.gov</li>
          <li><strong>AARP Fraud Watch:</strong> aarp.org/fraudwatch</li>
          <li><strong>Better Business Bureau Scam Tracker:</strong> bbb.org/scamtracker</li>
          <li><strong>Dating platform support:</strong> Report suspicious profiles immediately</li>
        </ul>
      `
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
                        <Dialog>
                          <DialogTrigger asChild>
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
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {getTypeIcon(resource.type)}
                                {resource.title}
                              </DialogTitle>
                              <DialogDescription>
                                {resource.description}
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh] pr-4">
                              <div 
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: resource.content }}
                              />
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
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