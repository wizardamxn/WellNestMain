import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  Settings,
  BarChart3,
  Crown,
  Flame,
  Star,
  Calendar,
  Bell,
  Globe,
  Phone,
  AlertTriangle,
  Heart,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '../lib/api';
import { useUser } from '../hooks/useUserData';
import { useToast } from '../hooks/use-toast';

// Sample mood data for the past week
const moodData = [
  { day: 'Mon', mood: 3.5, energy: 3.2, stress: 2.8 },
  { day: 'Tue', mood: 4.1, energy: 3.8, stress: 2.3 },
  { day: 'Wed', mood: 3.2, energy: 2.9, stress: 3.5 },
  { day: 'Thu', mood: 4.5, energy: 4.2, stress: 1.8 },
  { day: 'Fri', mood: 4.3, energy: 4.0, stress: 2.0 },
  { day: 'Sat', mood: 3.8, energy: 3.5, stress: 2.5 },
  { day: 'Sun', mood: 4.0, energy: 3.7, stress: 2.2 }
];

const achievements = [
  {
    id: 'first-checkin',
    title: 'First Check-in',
    description: 'Completed your first wellness check-in',
    icon: <Heart className="w-4 h-4" />,
    color: 'bg-pink-100 text-pink-700',
    earned: true,
    date: '2 weeks ago'
  },
  {
    id: 'week-streak',
    title: 'Weekly Warrior',
    description: '7 consecutive days of check-ins',
    icon: <Flame className="w-4 h-4" />,
    color: 'bg-orange-100 text-orange-700',
    earned: true,
    date: '1 week ago'
  },
  {
    id: 'month-streak',
    title: 'Consistency Champion',
    description: '30 days of regular wellness tracking',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-700',
    earned: false,
    progress: 23
  },
  {
    id: 'resource-explorer',
    title: 'Resource Explorer',
    description: 'Accessed 10 different wellness resources',
    icon: <Star className="w-4 h-4" />,
    color: 'bg-yellow-100 text-yellow-700',
    earned: true,
    date: '3 days ago'
  },
  {
    id: 'community-supporter',
    title: 'Community Supporter',
    description: 'Helped fellow students in peer support',
    icon: <Award className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700',
    earned: false,
    progress: 2
  }
];

export default function Profile() {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    preferredName: user?.preferredName || '',
    language: user?.language || 'english',
    reminderTime: user?.reminderTime || '09:00',
    pushNotifications: user?.pushNotifications ?? true
  });

  const updateUserMutation = useMutation({
    mutationFn: (updates: any) => userApi.updateUser(user?.id || '', updates),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast({
        title: "Profile Updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an issue updating your profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSaveSettings = () => {
    updateUserMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContact = (type: string) => {
    const contacts = {
      crisis: 'tel:988',
      campus: 'tel:5551234567',
      text: 'sms:741741'
    };
    
    if (type === 'text') {
      toast({
        title: "Crisis Text Line",
        description: "Text HOME to 741741 for immediate support",
      });
    } else {
      window.open(contacts[type as keyof typeof contacts]);
    }
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Incredible! You're a wellness legend! 🏆";
    if (streak >= 14) return "Amazing consistency! Keep it up! 🌟";
    if (streak >= 7) return "One week strong! You're building great habits! 🔥";
    if (streak >= 3) return "Great start! Momentum is building! 💪";
    return "Every step counts! You're on your way! 💚";
  };

  if (!user) {
    return (
      <div data-testid="profile-loading" className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="profile-component" className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                {user.preferredName || user.username}
              </h2>
              <p className="text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Flame className="w-3 h-3" />
                  <span>{user.currentStreak} day streak</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <BarChart3 className="w-3 h-3" />
                  <span>{user.totalCheckins} check-ins</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger data-testid="tab-overview" value="overview">Overview</TabsTrigger>
          <TabsTrigger data-testid="tab-mood-history" value="mood">Mood History</TabsTrigger>
          <TabsTrigger data-testid="tab-achievements" value="achievements">Achievements</TabsTrigger>
          <TabsTrigger data-testid="tab-settings" value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wellness Streak */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{user.currentStreak}</h3>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-xs text-orange-700 mt-2">{getStreakMessage(user.currentStreak)}</p>
              </CardContent>
            </Card>

            {/* Longest Streak */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{user.longestStreak}</h3>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                {user.longestStreak >= 30 && (
                  <Badge className="mt-2 bg-purple-100 text-purple-700">Legend Status</Badge>
                )}
              </CardContent>
            </Card>

            {/* Total Check-ins */}
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{user.totalCheckins}</h3>
                <p className="text-sm text-muted-foreground">Total Check-ins</p>
                <div className="mt-2">
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min((user.totalCheckins / 100) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {100 - user.totalCheckins > 0 ? `${100 - user.totalCheckins} to milestone` : 'Milestone reached!'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Completed wellness check-in</p>
                    <p className="text-xs text-muted-foreground">Today at 9:15 AM</p>
                  </div>
                  <Badge variant="outline" className="text-green-700">Completed</Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Earned "Resource Explorer" achievement</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">New!</Badge>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Booked counseling session</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                  <Badge variant="outline" className="text-purple-700">Scheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mood History Tab */}
        <TabsContent value="mood" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Mood Trends</CardTitle>
              <p className="text-muted-foreground">Track your emotional wellbeing over time</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={moodData}>
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[1, 5]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="hsl(var(--secondary))" 
                      fill="hsl(var(--secondary))" 
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">Mood</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-sm text-muted-foreground">Energy</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mood Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Positive Trends</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Your mood improved 15% this week</li>
                    <li>• Energy levels are more consistent</li>
                    <li>• Thursday was your best day</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Consider midweek stress management</li>
                    <li>• Your weekend routine seems to work well</li>
                    <li>• Keep up the regular check-ins</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Your Achievements</span>
              </CardTitle>
              <p className="text-muted-foreground">Celebrate your wellness journey milestones</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    data-testid={`achievement-${achievement.id}`}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.earned 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-muted bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned ? achievement.color : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        
                        {achievement.earned ? (
                          <Badge className="mt-2 bg-green-100 text-green-700">
                            Earned {achievement.date}
                          </Badge>
                        ) : achievement.progress !== undefined ? (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/30</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ width: `${(achievement.progress! / 30) * 100}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline" className="mt-2">
                            Not earned yet
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredName">Preferred Name</Label>
                    <Input
                      data-testid="input-preferred-name"
                      id="preferredName"
                      value={formData.preferredName}
                      onChange={(e) => handleInputChange('preferredName', e.target.value)}
                      placeholder="How would you like to be addressed?"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={formData.language} 
                      onValueChange={(value) => handleInputChange('language', value)}
                    >
                      <SelectTrigger data-testid="select-language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                        <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Daily Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded to check in with your wellness</p>
                    </div>
                    <Switch
                      data-testid="switch-notifications"
                      checked={formData.pushNotifications}
                      onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                    />
                  </div>
                  
                  {formData.pushNotifications && (
                    <div>
                      <Label htmlFor="reminderTime">Reminder Time</Label>
                      <Input
                        data-testid="input-reminder-time"
                        id="reminderTime"
                        type="time"
                        value={formData.reminderTime}
                        onChange={(e) => handleInputChange('reminderTime', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <Button 
                data-testid="button-save-settings"
                onClick={handleSaveSettings}
                disabled={updateUserMutation.isPending}
                className="w-full"
              >
                {updateUserMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                Save Settings
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Resources */}
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>Emergency Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  data-testid="button-crisis-helpline"
                  onClick={() => handleEmergencyContact('crisis')}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Crisis Line: 988</span>
                </Button>
                
                <Button
                  data-testid="button-campus-counseling"
                  onClick={() => handleEmergencyContact('campus')}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Campus Counseling
                </Button>
                
                <Button
                  data-testid="button-crisis-text"
                  onClick={() => handleEmergencyContact('text')}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Text Support
                </Button>
              </div>
              
              <div className="bg-destructive/10 rounded-lg p-4">
                <p className="text-sm text-destructive">
                  <strong>Remember:</strong> If you're experiencing thoughts of self-harm or suicide, 
                  please reach out immediately. You are not alone, and help is always available.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
