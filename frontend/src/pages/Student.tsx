import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Bell,
  Sparkles,
  User,
  Sun,
  Moon,
  Cloud,
  Award,
  Flame,
  Brain,
  Target,
  Calendar,
  Activity,
  BookOpen,
  Coffee,
  Music,
  Zap,
  Smile,
  BarChart3,
  Star,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Shield,
  Trophy,
} from "lucide-react";

// --- Enhanced Hooks ---
const useUser = () => {
  const [user] = useState({
    name: "Alex Chen",
    level: 12,
    xp: 2750,
    nextLevelXp: 3000,
    streak: 7,
    totalSessions: 45,
    wellnessScore: 78,
  });
  return { user };
};

const useGreeting = () => {
  const [greeting, setGreeting] = useState({
    message: "Welcome",
    Icon: Sun,
    color: "text-yellow-500",
  });
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)
      setGreeting({
        message: "Good morning,",
        Icon: Sun,
        color: "text-yellow-500",
      });
    else if (hour < 18)
      setGreeting({
        message: "Good afternoon,",
        Icon: Cloud,
        color: "text-blue-500",
      });
    else
      setGreeting({
        message: "Good evening,",
        Icon: Moon,
        color: "text-purple-500",
      });
  }, []);
  return greeting;
};

// --- Advanced Profile Component ---
const EnhancedProfile = () => {
  const [journalText, setJournalText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Daily Meditation",
      progress: 70,
      target: 30,
      unit: "days",
    },
    {
      id: 2,
      title: "Reduce Screen Time",
      progress: 45,
      target: 4,
      unit: "hours",
    },
    { id: 3, title: "Sleep Schedule", progress: 85, target: 8, unit: "hours" },
  ]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    unit: "days",
  });

  const moodEmojis = [
    { emoji: "😢", label: "Very Sad", value: 1, color: "text-red-500" },
    { emoji: "😔", label: "Sad", value: 2, color: "text-orange-500" },
    { emoji: "😐", label: "Neutral", value: 3, color: "text-gray-500" },
    { emoji: "😊", label: "Happy", value: 4, color: "text-green-500" },
    { emoji: "😄", label: "Very Happy", value: 5, color: "text-emerald-500" },
  ];

  const handleMoodAnalysis = async () => {
    if (!journalText.trim()) return;
    setIsLoading(true);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis(
        "Your reflection shows resilience and self-awareness. The mix of excitement and nervousness you're feeling about exams is completely natural. Consider breaking your study goals into smaller, manageable chunks to help reduce anxiety while maintaining that positive energy."
      );
      setIsLoading(false);
    }, 2000);
  };

  const handleAddGoal = () => {
    if (newGoal.title.trim() && newGoal.target.trim()) {
      const goal = {
        id: goals.length + 1,
        title: newGoal.title,
        progress: 0,
        target: parseInt(newGoal.target),
        unit: newGoal.unit,
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: "", target: "", unit: "days" });
      setShowAddGoal(false);
    }
  };

  return (
    <Tabs defaultValue="journal" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="journal" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Journal
        </TabsTrigger>
        <TabsTrigger value="goals" className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Goals
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Insights
        </TabsTrigger>
      </TabsList>

      <TabsContent value="journal" className="space-y-6">
        {/* Mood Selector */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">
            How are you feeling today?
          </h3>
          <div className="flex gap-3 justify-between">
            {moodEmojis.map((moodOption) => (
              <button
                key={moodOption.value}
                onClick={() => setMood(moodOption.value)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all hover:scale-110 ${
                  mood === moodOption.value
                    ? "bg-primary/20 border-2 border-primary shadow-lg"
                    : "bg-secondary/20 border border-border hover:bg-secondary/30"
                }`}
              >
                <span className="text-2xl mb-1">{moodOption.emoji}</span>
                <span className={`text-xs ${moodOption.color}`}>
                  {moodOption.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Entry */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Daily Reflection</h3>
          <Textarea
            placeholder="What's on your mind today? Share your thoughts, feelings, or experiences..."
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            rows={6}
            className="bg-background/50 border-border/50 focus:border-primary resize-none"
          />
          <Button
            onClick={handleMoodAnalysis}
            disabled={isLoading || !journalText.trim()}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all group"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Get Wellness Insights
              </>
            )}
          </Button>
        </div>

        {/* Analysis Result */}
        {analysis && (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Brain className="w-4 h-4 mr-2 text-primary" />
                AI Wellness Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">
                {analysis}
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="secondary" className="text-xs">
                  Mindfulness
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Study Tips
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Anxiety Management
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Recent Achievements</h3>
          <div className="space-y-2">
            {[
              {
                icon: Award,
                color: "text-yellow-500",
                title: "7-Day Journaling Streak",
                desc: "Consistency champion!",
              },
              {
                icon: Heart,
                color: "text-red-500",
                title: "First Mood Analysis",
                desc: "Self-awareness unlocked",
              },
              {
                icon: Star,
                color: "text-blue-500",
                title: "Wellness Explorer",
                desc: "Completed profile setup",
              },
            ].map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-all"
              >
                <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="goals" className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Wellness Goals</h3>
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className="bg-gradient-to-r from-background to-secondary/5 border-border/50"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">{goal.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {goal.progress}%
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Target: {goal.target} {goal.unit}
                </p>
              </CardContent>
            </Card>
          ))}
          {!showAddGoal ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAddGoal(true)}
            >
              <Target className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          ) : (
            <Card className="p-4 space-y-3">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Goal title"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Target"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target: e.target.value })
                    }
                    className="flex-1 p-2 border border-border rounded-md bg-background"
                  />
                  <select
                    value={newGoal.unit}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, unit: e.target.value })
                    }
                    className="p-2 border border-border rounded-md bg-background"
                  >
                    <option value="days">days</option>
                    <option value="hours">hours</option>
                    <option value="weeks">weeks</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddGoal} className="flex-1">
                  Add Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="insights" className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">78</div>
              <p className="text-xs text-muted-foreground">Wellness Score</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-500">45</div>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

// --- Pomodoro Timer Component ---
const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // focus, break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Switch mode
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        setMode("focus");
        setTimeLeft(25 * 60); // 25 minute focus
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress =
    mode === "focus"
      ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
      : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-indigo-500" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="relative">
          <div className="text-4xl font-bold text-foreground">
            {formatTime(timeLeft)}
          </div>
          <Badge
            className={`mt-2 ${
              mode === "focus" ? "bg-indigo-500" : "bg-green-500"
            }`}
          >
            {mode === "focus" ? "Focus Time" : "Break Time"}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => setIsActive(!isActive)}
            className="flex-1"
            variant={isActive ? "secondary" : "default"}
          >
            {isActive ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Duolingo-Style Streak Tracker ---
const DuolingoStreakTracker = () => {
  const [streaks, setStreaks] = useState<{
    [key: string]: {
      current: number;
      longest: number;
      shields: number;
      lastActivity: string;
    };
  }>({
    journal: {
      current: 7,
      longest: 12,
      shields: 2,
      lastActivity: new Date().toDateString(),
    },
    meditation: {
      current: 3,
      longest: 8,
      shields: 1,
      lastActivity: new Date().toDateString(),
    },
    exercise: {
      current: 5,
      longest: 15,
      shields: 0,
      lastActivity: new Date().toDateString(),
    },
    sleep: {
      current: 12,
      longest: 20,
      shields: 3,
      lastActivity: new Date().toDateString(),
    },
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  const streakData = [
    {
      key: "journal",
      label: "Daily Journaling",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "Reflect on your day",
    },
    {
      key: "meditation",
      label: "Mindfulness",
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      description: "Find your inner peace",
    },
    {
      key: "exercise",
      label: "Physical Activity",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      description: "Move your body",
    },
    {
      key: "sleep",
      label: "Sleep Schedule",
      icon: Moon,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      description: "Rest and recharge",
    },
  ];

  const handleActivityComplete = (activityKey: string) => {
    const today = new Date().toDateString();
    const activity = streaks[activityKey];

    if (activity.lastActivity !== today) {
      const newStreak = activity.current + 1;
      const newLongest = Math.max(newStreak, activity.longest);

      setStreaks((prev) => ({
        ...prev,
        [activityKey]: {
          ...prev[activityKey],
          current: newStreak,
          longest: newLongest,
          lastActivity: today,
        },
      }));

      // Celebration for milestones
      if (newStreak % 7 === 0) {
        const activityLabel = streakData.find(
          (s) => s.key === activityKey
        )?.label;
        setCelebrationMessage(
          `Amazing! ${newStreak} day streak in ${activityLabel}!`
        );
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      // Award streak shield every 7 days
      if (newStreak % 7 === 0) {
        setStreaks((prev) => ({
          ...prev,
          [activityKey]: {
            ...prev[activityKey],
            shields: prev[activityKey].shields + 1,
          },
        }));
      }
    }
  };

  const useStreakShield = (activityKey: string) => {
    if (streaks[activityKey].shields > 0) {
      setStreaks((prev) => ({
        ...prev,
        [activityKey]: {
          ...prev[activityKey],
          shields: prev[activityKey].shields - 1,
          lastActivity: new Date().toDateString(),
        },
      }));
      const activityLabel = streakData.find(
        (s) => s.key === activityKey
      )?.label;
      alert(
        `Streak shield used! Your ${activityLabel} streak is protected for today.`
      );
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🏆";
    if (streak >= 21) return "💎";
    if (streak >= 14) return "⭐";
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "✨";
    return "🌱";
  };

  const getMotivationalMessage = (streak: number) => {
    if (streak >= 30) return "Legendary commitment!";
    if (streak >= 21) return "You're unstoppable!";
    if (streak >= 14) return "Amazing consistency!";
    if (streak >= 7) return "Keep the fire burning!";
    if (streak >= 3) return "Building momentum!";
    return "Every journey starts with a single step";
  };

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-500">
          <Card className="max-w-sm mx-4 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-lg font-bold mb-2">Streak Milestone!</h3>
              <p className="text-sm text-muted-foreground">
                {celebrationMessage}
              </p>
              <div className="mt-4 text-2xl">🛡️ +1 Streak Shield Earned!</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Wellness Streaks
            </div>
            <div className="text-sm text-muted-foreground">
              Total:{" "}
              {Object.values(streaks).reduce((sum, s) => sum + s.current, 0)}{" "}
              days
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {streakData.map((item) => {
            const streak = streaks[item.key];
            const isToday = streak.lastActivity === new Date().toDateString();

            return (
              <Card
                key={item.key}
                className={`${item.bgColor} ${item.borderColor} border`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <div>
                        <h4 className="font-medium text-sm">{item.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl">
                          {getStreakEmoji(streak.current)}
                        </span>
                        <span className="text-lg font-bold">
                          {streak.current}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Best: {streak.longest}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {getMotivationalMessage(streak.current)}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: streak.shields }).map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            🛡️
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!isToday ? (
                        <Button
                          onClick={() => handleActivityComplete(item.key)}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          Complete Today
                        </Button>
                      ) : (
                        <Button
                          disabled
                          size="sm"
                          className="flex-1 bg-green-500/20 text-green-700 cursor-not-allowed"
                        >
                          ✅ Completed Today
                        </Button>
                      )}

                      {streak.shields > 0 && !isToday && (
                        <Button
                          onClick={() => useStreakShield(item.key)}
                          size="sm"
                          variant="outline"
                          className="border-yellow-500/50 hover:bg-yellow-500/10"
                        >
                          🛡️ Use Shield
                        </Button>
                      )}
                    </div>

                    {/* Streak visualization */}
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: Math.min(streak.current, 7) }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${item.color.replace(
                              "text-",
                              "bg-"
                            )}`}
                          />
                        )
                      )}
                      {streak.current > 7 && (
                        <div className="text-xs text-muted-foreground ml-1">
                          +{streak.current - 7}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Weekly Challenge */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-500" />
                Weekly Challenge
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Complete all 4 activities for 3 days this week to earn a special
                badge!
              </p>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs
                    ${
                      i < 2
                        ? "bg-purple-500 border-purple-500 text-white"
                        : "border-purple-500/30"
                    }`}
                  >
                    {i < 2 ? "✓" : i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </>
  );
};

// --- Wellness Dashboard Component ---
const WellnessDashboard = () => {
  const metrics = [
    {
      label: "Mood Avg",
      value: "7.2/10",
      icon: Smile,
      color: "text-green-500",
      trend: "+0.5",
    },
    {
      label: "Sleep Quality",
      value: "8.1/10",
      icon: Moon,
      color: "text-blue-500",
      trend: "+1.2",
    },
    {
      label: "Stress Level",
      value: "4.2/10",
      icon: Zap,
      color: "text-yellow-500",
      trend: "-0.8",
    },
    {
      label: "Focus Score",
      value: "76%",
      icon: Target,
      color: "text-purple-500",
      trend: "+12%",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          Wellness Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-background/30 text-center"
            >
              <metric.icon className={`w-5 h-5 ${metric.color} mx-auto mb-1`} />
              <div className="font-bold text-sm">{metric.value}</div>
              <div className="text-xs text-muted-foreground">
                {metric.label}
              </div>
              <div
                className={`text-xs ${
                  metric.trend.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {metric.trend} this week
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// --- Quick Actions Hub ---
const QuickActionsHub = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  const actions = [
    {
      icon: Coffee,
      label: "Take Break",
      color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20",
      onClick: () => {
        alert(
          "Time for a break! Step away from your screen for 5-10 minutes. Try some deep breathing or a quick walk."
        );
      },
    },
    {
      icon: Music,
      label: "Relaxing Music",
      color: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20",
      onClick: () => {
        alert(
          "Opening relaxing music playlist... (This would integrate with Spotify API)"
        );
      },
    },
    {
      icon: Brain,
      label: "Meditation",
      color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20",
      onClick: () => {
        alert(
          "Starting guided meditation session... (This would open meditation app)"
        );
      },
    },
    {
      icon: Bell,
      label: "Set Reminder",
      color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
      onClick: () => {
        const reminder = prompt("What would you like to be reminded about?");
        if (reminder) {
          setNotifications([...notifications, reminder]);
          alert(`Reminder set: "${reminder}"`);
        }
      },
    },
  ];

  return (
    <Card className="bg-card/60 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-3 flex flex-col gap-2 ${action.color} transition-all hover:scale-105`}
              onClick={action.onClick}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {notifications.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Your Reminders:</h4>
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="p-2 bg-blue-50 border border-blue-200 rounded text-xs"
              >
                {notification}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Animated Background ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
  </div>
);

// --- Main Component ---
export default function EnhancedStudent() {
  const { user } = useUser();
  const { message: greetingMessage, Icon: GreetingIcon, color } = useGreeting();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Add custom animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
      }
      .animate-blob { animation: blob 7s infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
      .animate-gradient { animation: gradient 15s ease infinite; }
      @keyframes gradient {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />

      {/* Enhanced Hero Section */}
      <header className="relative pt-20 pb-12 text-center overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              size="sm"
              variant="ghost"
              className="bg-primary/10 hover:bg-primary/20"
              onClick={() => {
                const notification = prompt("Add a notification:");
                if (notification) {
                  setNotifications([...notifications, notification]);
                  alert(`Notification added: "${notification}"`);
                }
              }}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notifications.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPrivacy(!showPrivacy)}
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </Button>
          </div>
          {/* Greeting Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 text-sm mb-6 animate-in slide-in-from-top duration-1000">
            <GreetingIcon className={`w-5 h-5 ${color}`} />
            <span>
              {greetingMessage} <strong>{user?.name}</strong>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 mb-6 animate-in slide-in-from-top duration-1000 delay-200">
            Your Wellness
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
              Command Center
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-in slide-in-from-top duration-1000 delay-300">
            Empowering students with AI-driven insights, personalized wellness
            tracking, and comprehensive mental health support.
          </p>

          {/* Stats Cards */}
          <div className="flex justify-center gap-6 flex-wrap animate-in slide-in-from-bottom duration-1000 delay-500">
            <Card className="bg-card/60 backdrop-blur border-border/50 p-4">
              <div className="text-2xl font-bold text-primary">
                Level {user.level}
              </div>
              <div className="text-sm text-muted-foreground">
                Wellness Level
              </div>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/50 p-4">
              <div className="text-2xl font-bold text-emerald-500">
                {user.streak} Days
              </div>
              <div className="text-sm text-muted-foreground">
                Current Streak
              </div>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/50 p-4">
              <div className="text-2xl font-bold text-blue-500">
                {user.wellnessScore}%
              </div>
              <div className="text-sm text-muted-foreground">
                Wellness Score
              </div>
            </Card>
          </div>
        </div>
      </header>

      {/* Enhanced Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Profile Section */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="bg-card/60 backdrop-blur-lg border-border/50 shadow-xl animate-in slide-in-from-left duration-1000">
              <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  Personal Wellness Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-6">
                    <EnhancedProfile />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6">
              <div className="animate-in slide-in-from-right duration-1000 delay-200">
                <PomodoroTimer />
              </div>
              <div className="animate-in slide-in-from-right duration-1000 delay-300">
                <DuolingoStreakTracker />
              </div>
              <div className="animate-in slide-in-from-right duration-1000 delay-400">
                <WellnessDashboard />
              </div>
              <div className="animate-in slide-in-from-right duration-1000 delay-500">
                <QuickActionsHub />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Data Collection</h4>
                <p className="text-sm text-muted-foreground">
                  We only collect wellness data you choose to share. All data is
                  encrypted and stored securely.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Anonymous Mode</h4>
                <p className="text-sm text-muted-foreground">
                  You can use the app anonymously without creating an account.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Data Deletion</h4>
                <p className="text-sm text-muted-foreground">
                  You can delete your data at any time from the settings page.
                </p>
              </div>
              <Button onClick={() => setShowPrivacy(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Display */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-40 max-w-sm">
          <Card className="bg-card/95 backdrop-blur border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Your Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-2 bg-blue-50 border border-blue-200 rounded text-sm"
                >
                  {notification}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setNotifications([])}
                className="w-full mt-2"
              >
                Clear All
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:scale-110 transition-all z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Sparkles className="w-6 h-6" />
      </Button>
    </div>
  );
}
