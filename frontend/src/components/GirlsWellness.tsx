import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar,
  Heart,
  Flower,
  Users,
  Play,
  Download,
  Phone,
  AlertTriangle,
  Sparkles,
  Moon,
  Coffee,
  Brain
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const periodTips = [
  {
    phase: 'Menstrual Phase (Days 1-5)',
    icon: <Moon className="w-5 h-5" />,
    color: 'bg-red-100 text-red-800',
    tips: [
      'Lower intensity study sessions - your body needs energy for healing',
      'Focus on review and light reading rather than new complex concepts',
      'Take frequent breaks and practice gentle stretching',
      'Stay hydrated and maintain iron-rich diet'
    ],
    studyStrategy: 'Perfect time for organizing notes, reviewing flashcards, and catching up on lighter coursework.'
  },
  {
    phase: 'Follicular Phase (Days 1-13)',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'bg-green-100 text-green-800',
    tips: [
      'Energy levels start rising - great for tackling challenging subjects',
      'Enhanced focus and concentration abilities',
      'Excellent time for learning new concepts and skills',
      'Take advantage of improved memory retention'
    ],
    studyStrategy: 'Schedule your most difficult assignments and intensive study sessions during this phase.'
  },
  {
    phase: 'Ovulatory Phase (Days 14-16)',
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-800',
    tips: [
      'Peak cognitive performance and energy',
      'Best time for presentations and group work',
      'Enhanced verbal communication skills',
      'Confidence levels are typically highest'
    ],
    studyStrategy: 'Schedule exams, presentations, and important meetings during this peak performance window.'
  },
  {
    phase: 'Luteal Phase (Days 17-28)',
    icon: <Coffee className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-800',
    tips: [
      'Energy may fluctuate - plan accordingly',
      'Great for detailed work and editing',
      'Focus on completion rather than starting new projects',
      'Practice extra self-compassion and stress management'
    ],
    studyStrategy: 'Perfect for proofreading, organizing, and finishing up assignments before your period starts.'
  }
];

const relaxationActivities = [
  {
    title: 'Gentle Yoga for Periods',
    type: 'video',
    duration: '15 min',
    description: 'Soothing poses to relieve cramps and tension',
    icon: <Play className="w-4 h-4" />,
    color: 'bg-pink-100 text-pink-700'
  },
  {
    title: 'Period Pain Relief Audio',
    type: 'audio',
    duration: '20 min',
    description: 'Guided relaxation for menstrual discomfort',
    icon: <Play className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    title: 'Productivity During PMS Guide',
    type: 'guide',
    duration: '5 min read',
    description: 'Science-backed strategies for staying focused',
    icon: <Download className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    title: 'Nutrition for Energy',
    type: 'article',
    duration: '8 min read',
    description: 'Foods that support your cycle and energy levels',
    icon: <Download className="w-4 h-4" />,
    color: 'bg-green-100 text-green-700'
  }
];

const femaleCounselors = [
  {
    id: 'dr-rodriguez',
    name: 'Dr. Maria Rodriguez',
    specialty: "Women's Issues Specialist",
    languages: ['English', 'Spanish'],
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
    availability: 'Available Today'
  },
  {
    id: 'dr-sharma',
    name: 'Dr. Priya Sharma',
    specialty: 'Academic & Cultural Support',
    languages: ['English', 'Hindi'],
    image: 'https://images.unsplash.com/photo-1594824388989-503b1ba62979?w=100&h=100&fit=crop&crop=face',
    availability: 'Next Available: Tomorrow'
  },
  {
    id: 'dr-johnson',
    name: 'Dr. Aisha Johnson',
    specialty: 'Anxiety & Depression',
    languages: ['English'],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face',
    availability: 'Available This Week'
  }
];

const communityStories = [
  {
    id: 1,
    initials: 'MW',
    story: "This community helped me through my toughest semester. The period tracking tips were game-changers for my study schedule!",
    program: 'Medical Student',
    color: 'bg-pink-500'
  },
  {
    id: 2,
    initials: 'ES',
    story: "Found amazing study partners and learned so much about working with my cycle instead of against it. My grades improved significantly!",
    program: 'Engineering Student',
    color: 'bg-purple-500'
  },
  {
    id: 3,
    initials: 'KP',
    story: "The female counselors here really understand the unique challenges we face. Having that support made all the difference.",
    program: 'Psychology Student',
    color: 'bg-blue-500'
  }
];

export default function GirlsWellness() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBookFemaleCounselor = (counselorId: string) => {
    toast({
      title: "Booking System",
      description: "Opening counselor booking with female preference selected...",
    });
  };

  const handleAccessResource = (resource: any) => {
    toast({
      title: "Opening Resource",
      description: `Loading ${resource.title}...`,
    });
  };

  const handleJoinCommunity = () => {
    toast({
      title: "Community Access",
      description: "Opening peer support community with girls' wellness focus...",
    });
  };

  return (
    <div data-testid="girls-wellness" className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Flower className="w-12 h-12 text-pink-600" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Girls' Wellness Hub</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A dedicated space for female students to find support, resources, and community during their academic journey
        </p>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Period & Exam Support */}
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 card-hover">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Period & Study Harmony</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Specialized tips for managing studies during menstruation, including pain management and productivity strategies
            </p>
            <div className="space-y-2">
              {['Pain management techniques', 'Study schedule optimization', 'Nutrition and energy tips'].map((tip, index) => (
                <div key={index} className="flex items-center text-sm text-foreground">
                  <Heart className="w-3 h-3 text-pink-500 mr-2 flex-shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Female Counselors */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 card-hover">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Female Counselors</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Connect with specialized female counselors who understand unique challenges faced by women in academia
            </p>
            <Button 
              data-testid="button-book-female-counselor"
              onClick={() => handleBookFemaleCounselor('female-preference')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Book Female Counselor
            </Button>
          </CardContent>
        </Card>

        {/* Self-Care Resources */}
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200 card-hover">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Self-Care Toolkit</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Curated self-care practices, relaxation techniques, and wellness routines designed for busy female students
            </p>
            <div className="flex space-x-2">
              <Button 
                data-testid="button-guided-meditations"
                onClick={() => handleAccessResource({ title: 'Guided Meditations' })}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm"
              >
                Meditations
              </Button>
              <Button 
                data-testid="button-wellness-plans"
                onClick={() => handleAccessResource({ title: 'Wellness Plans' })}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-sm"
              >
                Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cycle-support" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger data-testid="tab-cycle-support" value="cycle-support">Cycle Support</TabsTrigger>
          <TabsTrigger data-testid="tab-resources" value="resources">Resources</TabsTrigger>
          <TabsTrigger data-testid="tab-counselors" value="counselors">Counselors</TabsTrigger>
          <TabsTrigger data-testid="tab-community" value="community">Community</TabsTrigger>
        </TabsList>

        {/* Cycle Support Tab */}
        <TabsContent value="cycle-support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-pink-600" />
                <span>Study Smart During Your Cycle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Your menstrual cycle affects energy, focus, and cognitive performance. Work with your body's natural rhythms for better academic success.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {periodTips.map((phase, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer card-hover ${selectedPhase === phase.phase ? 'ring-2 ring-pink-500' : ''}`}
                    onClick={() => setSelectedPhase(selectedPhase === phase.phase ? null : phase.phase)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${phase.color}`}>
                          {phase.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground text-sm">{phase.phase}</h4>
                          <p className="text-xs text-muted-foreground">Click to expand</p>
                        </div>
                      </div>
                      
                      {selectedPhase === phase.phase && (
                        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <h5 className="font-medium text-foreground text-sm mb-2">Study Strategy</h5>
                            <p className="text-xs text-muted-foreground">{phase.studyStrategy}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-foreground text-sm mb-2">Tips for this phase:</h5>
                            <ul className="space-y-1">
                              {phase.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-xs text-muted-foreground flex items-start space-x-2">
                                  <span className="text-pink-500 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Resources for Women</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relaxationActivities.map((activity, index) => (
                  <div 
                    key={index}
                    data-testid={`resource-${activity.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center space-x-4 p-3 border border-border rounded-lg hover:bg-muted/50 smooth-transition cursor-pointer"
                    onClick={() => handleAccessResource(activity)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{activity.type}</Badge>
                        <span className="text-xs text-muted-foreground">{activity.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'Period Tracker Template', desc: 'Study planning guide', icon: Download, color: 'text-pink-500' },
                  { title: 'Self-Care Checklist', desc: 'Daily wellness routine', icon: Heart, color: 'text-purple-500' },
                  { title: 'Confidence Building', desc: 'Affirmations & exercises', icon: Sparkles, color: 'text-blue-500' }
                ].map((resource, index) => (
                  <div 
                    key={index}
                    data-testid={`quick-resource-${index}`}
                    className="flex items-center space-x-3 p-3 bg-muted hover:bg-primary hover:text-white rounded-lg transition-colors group cursor-pointer"
                    onClick={() => handleAccessResource(resource)}
                  >
                    <resource.icon className={`w-4 h-4 ${resource.color} group-hover:text-white`} />
                    <div>
                      <p className="text-sm font-medium">{resource.title}</p>
                      <p className="text-xs opacity-70">{resource.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Counselors Tab */}
        <TabsContent value="counselors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Female Mental Health Professionals</CardTitle>
              <p className="text-muted-foreground">
                Our female counselors specialize in women's mental health and understand the unique challenges you face.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {femaleCounselors.map((counselor) => (
                <div key={counselor.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={counselor.image} alt={counselor.name} />
                    <AvatarFallback className="bg-pink-100 text-pink-600">
                      {counselor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{counselor.name}</h3>
                    <p className="text-sm text-muted-foreground">{counselor.specialty}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-muted-foreground">Languages:</span>
                        <span className="text-xs font-medium">{counselor.languages.join(', ')}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {counselor.availability}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    data-testid={`button-book-${counselor.id}`}
                    onClick={() => handleBookFemaleCounselor(counselor.id)}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Book Session
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Support */}
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Emergency Support for Women</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-red-800">Campus Women's Center</p>
                  <p className="text-red-700">(555) 123-SAFE</p>
                </div>
                <div>
                  <p className="font-medium text-red-800">Sexual Assault Hotline</p>
                  <p className="text-red-700">1-800-656-HOPE</p>
                </div>
                <div>
                  <p className="font-medium text-red-800">Mental Health Crisis</p>
                  <p className="text-red-700">988 Lifeline</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Women's Support Circle</CardTitle>
              <p className="text-muted-foreground">
                Join our safe space for female students to share experiences and support each other
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {communityStories.map((story) => (
                  <div key={story.id} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={`${story.color} text-white text-sm font-semibold`}>
                        {story.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-foreground italic mb-2">"{story.story}"</p>
                      <p className="text-xs text-muted-foreground">- {story.program}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                data-testid="button-join-circle"
                onClick={handleJoinCommunity}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-3"
              >
                Join the Circle
              </Button>
              
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  💝 A supportive community where female students can share experiences, ask questions, and support each other through academic and personal challenges.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
