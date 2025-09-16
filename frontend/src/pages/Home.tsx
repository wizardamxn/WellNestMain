import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Globe, ArrowRight, Phone } from 'lucide-react';
import { useUser } from '../hooks/useUserData';

const affirmations = [
  "You are stronger than you think, and we're here to support you.",
  "Your mental health matters, and taking care of it is a sign of strength.",
  "Every small step you take towards wellness is worth celebrating.",
  "You are not alone in this journey. We're here to walk with you.",
  "Your feelings are valid, and it's okay to ask for help.",
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { isLoggedIn, setUser } = useUser();
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  useEffect(() => {
    // Rotate affirmations every 10 seconds
    const interval = setInterval(() => {
      setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-login demo user for development
    if (!isLoggedIn) {
      setUser({
        id: 'demo-user-123',
        username: 'student',
        password: '',
        preferredName: 'Student',
        language: 'english',
        currentStreak: 7,
        longestStreak: 14,
        totalCheckins: 32,
        reminderTime: '09:00',
        pushNotifications: true,
        createdAt: new Date(),
      });
    }
  }, [isLoggedIn, setUser]);

  const handleGetStarted = () => {
    setLocation('/dashboard');
  };

  const handleEmergencySupport = () => {
    alert('Emergency Resources:\n\n• National Crisis Helpline: 988\n• Campus Safety: (555) 123-SAFE\n• Text HOME to 741741 for Crisis Text Line\n\nYou are not alone. Help is available 24/7.');
  };

  return (
    <div data-testid="page-home" className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen gradient-bg flex items-center justify-center px-4"   style={{
    backgroundImage: `url("/bg1S.jpg")`, // if the image is inside public/
    backgroundSize: "cover", // optional
    backgroundPosition: "center", // optional
  }}
>
        <div className="max-w-4xl mx-auto text-center">
          {/* Daily Affirmation Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50 mb-8">
            <Heart className="w-5 h-5 text-accent mr-3" />
            <span className="text-sm font-medium text-muted-foreground">Daily Affirmation</span>
          </div>
          
          {/* Main Affirmation */}
          <div className="mb-12">
            <h1 
              data-testid="text-affirmation"
              className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight fade-in"
              key={currentAffirmation}
            >
              {affirmations[currentAffirmation]}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Your safe space for mental well-being, designed for every student.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              data-testid="button-get-started"
              onClick={handleGetStarted}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-xl smooth-transition flex items-center space-x-2 shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button 
              data-testid="button-emergency"
              onClick={handleEmergencySupport}
              variant="outline"
              size="lg"
              className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 font-semibold px-8 py-4 rounded-xl smooth-transition flex items-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Emergency Help</span>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">100% Confidential</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Peer Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">Multilingual</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-destructive" />
              <span className="text-sm font-medium">Always Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-24 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comprehensive Mental Health Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI-powered conversations to peer support, we provide all the tools you need for your mental wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Support */}
            <div data-testid="card-ai-support" className="text-center p-8 rounded-xl bg-primary/5 border border-primary/20">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI Mental Health Companion</h3>
              <p className="text-muted-foreground">
                24/7 support with AI trained in mental health first-aid and crisis detection
              </p>
            </div>

            {/* Professional Support */}
            <div data-testid="card-professional-support" className="text-center p-8 rounded-xl bg-secondary/5 border border-secondary/20">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Professional Counselors</h3>
              <p className="text-muted-foreground">
                Book confidential sessions with qualified mental health professionals
              </p>
            </div>

            {/* Peer Community */}
            <div data-testid="card-peer-community" className="text-center p-8 rounded-xl bg-accent/5 border border-accent/20">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Peer Support Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow students in a safe, moderated environment
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div data-testid="stat-students-helped" className="text-3xl font-bold text-primary mb-1">2,500+</div>
              <div className="text-sm text-muted-foreground">Students Helped</div>
            </div>
            <div className="text-center">
              <div data-testid="stat-availability" className="text-3xl font-bold text-secondary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
            <div className="text-center">
              <div data-testid="stat-confidential" className="text-3xl font-bold text-accent mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Confidential</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to prioritize your mental health?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are taking control of their wellness journey.
          </p>
          <Button 
            data-testid="button-start-journey"
            onClick={handleGetStarted}
            variant="secondary"
            size="lg"
            className="font-semibold px-8 py-4"
          >
            Start Your Journey Today
          </Button>
        </div>
      </section>
    </div>
  );
}
