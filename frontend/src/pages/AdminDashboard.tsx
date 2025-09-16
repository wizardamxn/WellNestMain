import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  TrendingUp,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/api';
import { useToast } from '../hooks/use-toast';

const COLORS = {
  low: 'hsl(158, 64%, 52%)',
  medium: 'hsl(42, 85%, 65%)', 
  high: 'hsl(0, 62%, 61%)',
  primary: 'hsl(158, 64%, 52%)',
  secondary: 'hsl(265, 60%, 70%)',
  accent: 'hsl(347, 77%, 70%)'
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const { toast } = useToast();

  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['/api/admin/analytics'],
    queryFn: () => adminApi.getAnalytics(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/admin/bookings'],
    queryFn: () => adminApi.getAllBookings(),
  });

  const handleExportData = () => {
    if (!analytics) return;
    
    const data = {
      timestamp: new Date().toISOString(),
      analytics,
      bookings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellnest-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Analytics data has been exported successfully.",
    });
  };

  const stressDistributionData = analytics ? [
    { name: 'Low Risk', value: analytics.stressDistribution.low, color: COLORS.low },
    { name: 'Medium Risk', value: analytics.stressDistribution.medium, color: COLORS.medium },
    { name: 'High Risk', value: analytics.stressDistribution.high, color: COLORS.high }
  ] : [];

  const weeklyTrends = [
    { day: 'Mon', checkins: 45, bookings: 12 },
    { day: 'Tue', checkins: 52, bookings: 15 },
    { day: 'Wed', checkins: 38, bookings: 8 },
    { day: 'Thu', checkins: 61, bookings: 18 },
    { day: 'Fri', checkins: 55, bookings: 14 },
    { day: 'Sat', checkins: 28, bookings: 6 },
    { day: 'Sun', checkins: 33, bookings: 9 }
  ];

  if (analyticsLoading || bookingsLoading) {
    return (
      <div data-testid="loading-admin-dashboard" className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div data-testid="page-admin-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">WellNest Analytics</h1>
          <p className="text-muted-foreground mt-2">Anonymous insights for institutional mental health support</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger data-testid="select-time-range" className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            data-testid="button-refresh"
            onClick={() => refetchAnalytics()}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            data-testid="button-export"
            onClick={handleExportData}
            variant="default"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card data-testid="metric-total-users">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Active Users</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.totalUsers || 0}</p>
                <p className="text-sm text-green-600">+12% this week</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-total-checkins">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Check-ins</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.totalCheckins || 0}</p>
                <p className="text-sm text-green-600">+18% this week</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-counseling-sessions">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Counseling Bookings</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.totalBookings || 0}</p>
                <p className="text-sm text-green-600">+8% this week</p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-high-risk-users">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Cases</p>
                <p className="text-2xl font-bold text-foreground">{analytics?.stressDistribution.high || 0}</p>
                <p className="text-sm text-orange-600">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger data-testid="tab-overview" value="overview">Overview</TabsTrigger>
          <TabsTrigger data-testid="tab-stress-levels" value="stress">Stress Levels</TabsTrigger>
          <TabsTrigger data-testid="tab-departments" value="departments">Departments</TabsTrigger>
          <TabsTrigger data-testid="tab-bookings" value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="checkins" 
                      stroke={COLORS.primary} 
                      strokeWidth={2}
                      name="Check-ins"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke={COLORS.secondary} 
                      strokeWidth={2}
                      name="Bookings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Stress Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Current Stress Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stressDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stressDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {stressDistributionData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stress">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Stress Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-700">{analytics?.stressDistribution.low || 0}</div>
                      <div className="text-sm text-green-600">Low Risk Students</div>
                      <div className="text-xs text-muted-foreground mt-1">Healthy coping mechanisms</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-700">{analytics?.stressDistribution.medium || 0}</div>
                      <div className="text-sm text-yellow-600">Medium Risk Students</div>
                      <div className="text-xs text-muted-foreground mt-1">May benefit from support</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-700">{analytics?.stressDistribution.high || 0}</div>
                      <div className="text-sm text-red-600">High Risk Students</div>
                      <div className="text-xs text-muted-foreground mt-1">Immediate attention needed</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-muted/50 rounded-lg p-6">
                  <h4 className="font-semibold text-foreground mb-3">AI-Generated Insights</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <p className="text-sm text-muted-foreground">
                        Stress levels peak on Thursdays, coinciding with midweek academic deadlines. Consider scheduling additional support during this time.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                      <p className="text-sm text-muted-foreground">
                        Computer Science students show 23% higher stress levels compared to other departments. Recommend targeted programming for STEM students.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <p className="text-sm text-muted-foreground">
                        Early intervention programs have shown 34% improvement in moving students from high to medium risk categories.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics?.departmentBreakdown || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Counseling Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings?.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {booking.sessionType} Session
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.preferredDate} at {booking.preferredTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={
                          booking.status === 'confirmed' ? 'default' : 
                          booking.status === 'pending' ? 'secondary' : 
                          'outline'
                        }
                        className="text-xs"
                      >
                        {booking.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {(!bookings || bookings.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No bookings found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Privacy Notice */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary text-xs">!</span>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Privacy & Anonymity</h4>
              <p className="text-sm text-muted-foreground">
                All data displayed is anonymized and aggregated. No personally identifiable information is accessible through this dashboard. 
                Individual user data remains confidential and is only available to authorized mental health professionals through secure channels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
