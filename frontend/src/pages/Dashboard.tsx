import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageCircle, 
  Heart, 
  Calendar, 
  BookOpen, 
  Music, 
  Users, 
  Flower,
  Phone,
  BarChart3
} from 'lucide-react';
import StreakTracker from '../components/StreakTracker';
import Chatbot from '../components/Chatbot';
import HealthCheckQuiz from '../components/HealthCheckQuiz';
import BookingSystem from '../components/BookingSystem';
import ResourceHub from '../components/ResourceHub';
import PeerSupport from '../components/PeerSupport';
import GirlsWellness from '../components/GirlsWellness';
import MoodMusic from '../components/MoodMusic';
import { useUser } from '../hooks/useUserData';
import { useLocation } from "wouter";

interface FeatureCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  color: string;
  component: React.ComponentType;
}

const features: FeatureCard[] = [
  {
    id: 'chatbot',
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'AI Support Chat',
    description: 'Get immediate, confidential support from our AI companion trained in mental health first-aid.',
    badge: 'Available 24/7',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
    component: Chatbot
  },
  {
    id: 'healthcheck',
    icon: <Heart className="w-6 h-6" />,
    title: 'Mental Health Check',
    description: 'Take a quick, confidential assessment to understand your current mental well-being.',
    badge: '5 min',
    color: 'bg-accent/10 text-accent hover:bg-accent/20',
    component: HealthCheckQuiz
  },
  {
    id: 'booking',
    icon: <Calendar className="w-6 h-6" />,
    title: 'Book Counselor',
    description: 'Schedule a private session with qualified mental health professionals.',
    badge: 'Confidential',
    color: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
    component: BookingSystem
  },
  {
    id: 'resources',
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Wellness Resources',
    description: 'Access videos, guides, and relaxation content in your preferred language.',
    badge: 'Free',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
    component: ResourceHub
  },
  {
    id: 'music',
    icon: <Music className="w-6 h-6" />,
    title: 'Mood Music',
    description: 'Listen to curated playlists that match your mood and support your well-being.',
    badge: 'Spotify',
    color: 'bg-green-100 text-green-700 hover:bg-green-200',
    component: MoodMusic
  },
  {
    id: 'peer',
    icon: <Users className="w-6 h-6" />,
    title: 'Peer Support',
    description: 'Connect with fellow students in a safe, moderated community space.',
    badge: 'Anonymous',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    component: PeerSupport
  },
  {
    id: 'girls',
    icon: <Flower className="w-6 h-6" />,
    title: "Girls' Wellness",
    description: 'Specialized support for female students with period care, productivity tips, and female counselors.',
    badge: 'For Her',
    color: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    component: GirlsWellness
  }
];

export default function Dashboard() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { user } = useUser();
  const [, setLocation] = useLocation();

  const handleEmergencySupport = () => {
    alert('Emergency Resources:\n\n• National Crisis Helpline: 988\n• Campus Safety: (555) 123-SAFE\n• Text HOME to 741741 for Crisis Text Line\n\nYou are not alone. Help is available 24/7.');
  };

  return (
    <div data-testid="page-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dashboard Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {user?.preferredName ? `Welcome back, ${user.preferredName}!` : 'Your Wellness Dashboard'}
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose the support that feels right for you today
        </p>
      </div>

      {/* Streak Tracker */}
      <StreakTracker />

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature) => {
          const Component = feature.component;
          
          return (
            <Card
      key={feature.id}
      onClick={() => setLocation(`/features/${feature.id}`)}
      className="card-hover smooth-transition cursor-pointer border-border hover:shadow-lg"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}
          >
            {feature.icon}
          </div>
          <Badge
            data-testid={`badge-${feature.id}`}
            variant="secondary"
            className="text-xs"
          >
            {feature.badge}
          </Badge>
        </div>

        <h3
          data-testid={`title-${feature.id}`}
          className="text-lg font-semibold text-foreground mb-2"
        >
          {feature.title}
        </h3>

        <p
          data-testid={`description-${feature.id}`}
          className="text-muted-foreground text-sm mb-4"
        >
          {feature.description}
        </p>

        <div
          className={`flex items-center text-sm font-medium ${
            feature.color.includes("primary")
              ? "text-primary"
              : feature.color.includes("accent")
              ? "text-accent"
              : feature.color.includes("secondary")
              ? "text-secondary"
              : feature.color.includes("green")
              ? "text-green-700"
              : feature.color.includes("blue")
              ? "text-blue-700"
              : "text-pink-700"
          }`}
        >
          <span>Open {feature.title}</span>
          <span className="ml-2">→</span>
        </div>
      </CardContent>
    </Card>
          );
        })}

        {/* Crisis Support Card */}
        <Card 
          data-testid="card-crisis"
          className="card-hover smooth-transition cursor-pointer border-destructive/20 bg-destructive/5"
          onClick={handleEmergencySupport}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-destructive" />
              </div>
              <Badge variant="destructive" className="text-xs">
                Emergency
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Crisis Support
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4">
              Immediate access to crisis helplines and emergency mental health resources.
            </p>
            
            <div className="flex items-center text-sm font-medium text-destructive">
              <span>Get help now</span>
              <span className="ml-2">→</span>
            </div>
          </CardContent>
        </Card>

        {/* Admin Dashboard Card (for demo) */}
        <Card 
          data-testid="card-admin"
          className="card-hover smooth-transition cursor-pointer border-slate-200 bg-slate-50"
          onClick={() => window.open('/admin', '_blank')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-slate-600" />
              </div>
              <Badge variant="secondary" className="text-xs bg-slate-200 text-slate-600">
                Staff Only
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Analytics Dashboard
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4">
              Anonymous insights and trends to improve campus mental health support.
            </p>
            
            <div className="flex items-center text-sm font-medium text-slate-600">
              <span>View analytics</span>
              <span className="ml-2">→</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Need immediate help?</h3>
          <p className="mb-4 opacity-90">Our crisis support is available 24/7</p>
          <div 
            data-testid="button-emergency-support"
            className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium cursor-pointer smooth-transition"
            onClick={handleEmergencySupport}
          >
            <Phone className="w-5 h-5" />
            <span>Emergency Support</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
