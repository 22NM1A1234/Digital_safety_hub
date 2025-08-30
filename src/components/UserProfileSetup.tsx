import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useToast } from '@/hooks/use-toast';
import { Phone, User, UserPlus } from 'lucide-react';
import { validatePhoneNumber, validateZapierWebhook, sanitizeInput } from '@/utils/validation';

export const UserProfileSetup: React.FC = () => {
  const { profile, updateProfile } = useUserProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phoneNumber: profile?.phoneNumber || '',
    emergencyContact: '',
    zapierWebhook: profile?.zapierWebhook || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(formData.name);
    const sanitizedPhone = sanitizeInput(formData.phoneNumber);
    const sanitizedWebhook = sanitizeInput(formData.zapierWebhook);
    
    if (!sanitizedName || !sanitizedPhone) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please fill in your name and phone number.',
        variant: 'destructive'
      });
      return;
    }

    // Validate phone number
    if (!validatePhoneNumber(sanitizedPhone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number (10-15 digits).',
        variant: 'destructive'
      });
      return;
    }

    // Validate Zapier webhook if provided
    if (sanitizedWebhook && !validateZapierWebhook(sanitizedWebhook)) {
      toast({
        title: 'Invalid Webhook URL',
        description: 'Please enter a valid Zapier webhook URL.',
        variant: 'destructive'
      });
      return;
    }

    const emergencyContacts = profile?.emergencyContacts || [];
    if (formData.emergencyContact && !emergencyContacts.includes(formData.emergencyContact)) {
      emergencyContacts.push(formData.emergencyContact);
    }

    updateProfile({
      name: sanitizedName,
      phoneNumber: sanitizedPhone,
      emergencyContacts,
      zapierWebhook: sanitizedWebhook
    });

    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully. SMS alerts are now enabled.',
    });
  };

  const addEmergencyContact = () => {
    if (!formData.emergencyContact) return;
    
    const sanitizedContact = sanitizeInput(formData.emergencyContact);
    
    if (!validatePhoneNumber(sanitizedContact)) {
      toast({
        title: 'Invalid Emergency Contact',
        description: 'Please enter a valid phone number.',
        variant: 'destructive'
      });
      return;
    }
    
    const emergencyContacts = profile?.emergencyContacts || [];
    if (!emergencyContacts.includes(sanitizedContact)) {
      emergencyContacts.push(sanitizedContact);
      updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        emergencyContacts,
        zapierWebhook: formData.zapierWebhook
      });
      setFormData(prev => ({ ...prev, emergencyContact: '' }));
      
      toast({
        title: 'Emergency Contact Added',
        description: 'Emergency contact has been added successfully.',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Setup
        </CardTitle>
        <CardDescription>
          Enter your details to receive SMS alerts when entering crime areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zapier">Zapier Webhook URL (for SMS alerts)</Label>
            <Input
              id="zapier"
              type="url"
              value={formData.zapierWebhook}
              onChange={(e) => setFormData(prev => ({ ...prev, zapierWebhook: e.target.value }))}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
            />
            <p className="text-xs text-muted-foreground">
              Create a Zapier webhook that sends SMS when triggered. Leave empty to disable SMS alerts.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency">Emergency Contact (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="emergency"
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="+91 9876543210"
              />
              <Button type="button" onClick={addEmergencyContact} size="sm">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {profile?.emergencyContacts && profile.emergencyContacts.length > 0 && (
            <div className="space-y-2">
              <Label>Emergency Contacts</Label>
              <div className="space-y-1">
                {profile.emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {contact}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};