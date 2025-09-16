import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Star, Crown, Calendar } from 'lucide-react';
import { useUser } from '../hooks/useUserData';

export default function StreakTracker() {
  const { user } = useUser();

  if (!user) return null;

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (streak >= 14) return 'bg-gradient-to-r from-orange-500 to-red-500';
    if (streak >= 7) return 'bg-gradient-to-r from-green-500 to-blue-500';
    return 'bg-gradient-to-r from-blue-400 to-purple-400';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Incredible dedication! You're a wellness champion! 🏆";
    if (streak >= 14) return "Two weeks strong! You're building amazing habits! 🌟";
    if (streak >= 7) return "One week streak! You're doing fantastic! 🔥";
    if (streak >= 3) return "Great start! Keep the momentum going! 💪";
    return "Every check-in matters. You're taking care of yourself! 💚";
  };

  const getBadges = (currentStreak: number, longestStreak: number, totalCheckins: number) => {
    const badges = [];
    
    if (currentStreak >= 3) badges.push({ icon: Flame, label: 'Consistent', color: 'bg-orange-100 text-orange-800' });
    if (currentStreak >= 7) badges.push({ icon: Star, label: 'Weekly Warrior', color: 'bg-yellow-100 text-yellow-800' });
    if (currentStreak >= 14) badges.push({ icon: Crown, label: 'Streak Master', color: 'bg-purple-100 text-purple-800' });
    if (longestStreak >= 30) badges.push({ icon: Crown, label: 'Legend', color: 'bg-pink-100 text-pink-800' });
    if (totalCheckins >= 50) badges.push({ icon: Calendar, label: 'Dedicated', color: 'bg-blue-100 text-blue-800' });
    
    return badges;
  };

  const badges = getBadges(user.currentStreak, user.longestStreak, user.totalCheckins);

  return (
    <Card data-testid="card-streak-tracker" className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Streak Info */}
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${getStreakColor(user.currentStreak)} rounded-full flex items-center justify-center`}>
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 data-testid="text-streak-count" className="text-xl font-semibold text-foreground">
                {user.currentStreak} Day Streak!
              </h3>
              <p data-testid="text-streak-message" className="text-sm text-muted-foreground">
                {getStreakMessage(user.currentStreak)}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div data-testid="text-current-streak" className="text-2xl font-bold text-primary">
                {user.currentStreak}
              </div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div className="text-center">
              <div data-testid="text-longest-streak" className="text-2xl font-bold text-secondary">
                {user.longestStreak}
              </div>
              <div className="text-xs text-muted-foreground">Longest</div>
            </div>
            <div className="text-center">
              <div data-testid="text-total-checkins" className="text-2xl font-bold text-accent">
                {user.totalCheckins}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map(({ icon: Icon, label, color }, index) => (
              <Badge 
                key={index} 
                data-testid={`badge-${label.toLowerCase().replace(' ', '-')}`}
                variant="secondary" 
                className={`${color} flex items-center space-x-1`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Visual Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress to next milestone</span>
            <span>
              {user.currentStreak >= 30 ? 'Max level!' : 
               user.currentStreak >= 14 ? `${30 - user.currentStreak} days to Legend` :
               user.currentStreak >= 7 ? `${14 - user.currentStreak} days to Streak Master` :
               `${7 - user.currentStreak} days to Weekly Warrior`}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getStreakColor(user.currentStreak)} transition-all duration-500`}
              style={{ 
                width: `${user.currentStreak >= 30 ? 100 : 
                         user.currentStreak >= 14 ? ((user.currentStreak - 14) / 16) * 100 :
                         user.currentStreak >= 7 ? ((user.currentStreak - 7) / 7) * 100 :
                         (user.currentStreak / 7) * 100}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
