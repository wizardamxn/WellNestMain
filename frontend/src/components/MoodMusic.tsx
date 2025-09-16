import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Brain,
  Leaf,
  Zap,
  Moon,
  Headphones,
  ExternalLink,
  Clock,
  Heart,
  Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../lib/api';
import { useToast } from '../hooks/use-toast';

interface Mood {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  benefits: string[];
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  image?: string;
  external_url?: string;
  tracks_total?: number;
}

interface Track {
  id: string;
  name: string;
  artists: string;
  duration: number;
  preview_url?: string;
  external_url?: string;
}

const moods: Mood[] = [
  {
    id: 'focus',
    name: 'Focus',
    icon: <Brain className="w-8 h-8" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    description: 'Deep concentration & productivity',
    benefits: ['Enhanced focus', 'Reduced distractions', 'Better retention', 'Sustained attention']
  },
  {
    id: 'relax',
    name: 'Relax',
    icon: <Leaf className="w-8 h-8" />,
    color: 'text-green-700',
    bgColor: 'bg-green-50 hover:bg-green-100 border-green-200',
    description: 'Calm & peaceful moments',
    benefits: ['Stress reduction', 'Lower anxiety', 'Muscle relaxation', 'Mental clarity']
  },
  {
    id: 'energize',
    name: 'Energize',
    icon: <Zap className="w-8 h-8" />,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    description: 'Boost motivation & energy',
    benefits: ['Increased motivation', 'Physical energy', 'Positive mood', 'Workout boost']
  },
  {
    id: 'calm',
    name: 'Sleep',
    icon: <Moon className="w-8 h-8" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    description: 'Gentle & soothing sounds',
    benefits: ['Better sleep', 'Anxiety relief', 'Deep relaxation', 'Night routine']
  }
];

const musicBenefits = [
  {
    icon: <Brain className="w-6 h-6 text-blue-600" />,
    title: 'Improved Focus',
    description: 'Music can enhance concentration and cognitive performance during study sessions'
  },
  {
    icon: <Heart className="w-6 h-6 text-green-600" />,
    title: 'Stress Relief',
    description: 'Calming melodies help reduce cortisol levels and promote relaxation'
  },
  {
    icon: <Zap className="w-6 h-6 text-orange-600" />,
    title: 'Mood Boost',
    description: 'Uplifting music triggers endorphin release, improving overall mood'
  },
  {
    icon: <Moon className="w-6 h-6 text-purple-600" />,
    title: 'Better Sleep',
    description: 'Gentle sounds help regulate sleep patterns and improve rest quality'
  }
];

export default function MoodMusic() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ['/api/music/playlists', selectedMood],
    queryFn: () => musicApi.getMoodPlaylists(selectedMood!),
    enabled: !!selectedMood,
  });

  const { data: tracks, isLoading: tracksLoading } = useQuery({
    queryKey: ['/api/music/playlist', playlists?.[0]?.id, 'tracks'],
    queryFn: () => musicApi.getPlaylistTracks(playlists![0].id),
    enabled: !!(playlists && playlists.length > 0),
  });

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setCurrentlyPlaying(null);
    setIsPlaying(false);
  };

  const handlePlayTrack = (track: Track) => {
    if (currentlyPlaying?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(track);
      setIsPlaying(true);
    }

    if (track.preview_url) {
      // In a real app, this would control audio playback
      toast({
        title: "Playing Preview",
        description: `${track.name} by ${track.artists}`,
      });
    } else {
      toast({
        title: "Full Track on Spotify",
        description: "Preview not available, opening full track on Spotify...",
      });
      if (track.external_url) {
        window.open(track.external_url, '_blank');
      }
    }
  };

  const handleOpenSpotify = (url: string) => {
    window.open(url, '_blank');
    toast({
      title: "Opening Spotify",
      description: "Redirecting to Spotify for full access...",
    });
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div data-testid="mood-music" className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Music className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Mood Music</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Let music guide your emotions and enhance your wellbeing with curated playlists for every mood
        </p>
      </div>

      <Tabs defaultValue="moods" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger data-testid="tab-moods" value="moods">Choose Mood</TabsTrigger>
          <TabsTrigger data-testid="tab-player" value="player" disabled={!selectedMood}>
            Music Player
          </TabsTrigger>
          <TabsTrigger data-testid="tab-benefits" value="benefits">Benefits</TabsTrigger>
        </TabsList>

        {/* Mood Selection */}
        <TabsContent value="moods" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">How are you feeling right now?</h3>
            <p className="text-muted-foreground">Choose the mood that matches your current state or desired feeling</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moods.map((mood) => (
              <Card 
                key={mood.id}
                data-testid={`mood-${mood.id}`}
                className={`cursor-pointer card-hover smooth-transition border-2 ${
                  selectedMood === mood.id 
                    ? `ring-2 ring-${mood.color.split('-')[1]}-500 ${mood.bgColor}` 
                    : `${mood.bgColor} border-transparent hover:border-${mood.color.split('-')[1]}-300`
                }`}
                onClick={() => handleMoodSelect(mood.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full bg-white/50 flex items-center justify-center mx-auto mb-4 ${mood.color}`}>
                    {mood.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${mood.color}`}>{mood.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{mood.description}</p>
                  
                  <div className="space-y-1">
                    {mood.benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="flex items-center justify-center text-xs text-muted-foreground">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  {selectedMood === mood.id && (
                    <Badge className="mt-4 bg-white/80 text-foreground">Selected</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedMood && (
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-foreground mb-2">Great choice!</h4>
                <p className="text-muted-foreground mb-4">
                  {moods.find(m => m.id === selectedMood)?.name} music can help you achieve your goals. 
                  Click the "Music Player" tab to start listening.
                </p>
                <Button 
                  data-testid="button-go-to-player"
                  onClick={() => {
                    const playerTab = document.querySelector('[value="player"]') as HTMLElement;
                    playerTab?.click();
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  Start Listening
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Music Player */}
        <TabsContent value="player" className="space-y-6">
          {selectedMood && (
            <>
              {/* Current Mood Display */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center`}>
                      {moods.find(m => m.id === selectedMood)?.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {moods.find(m => m.id === selectedMood)?.name} Music
                      </h3>
                      <p className="text-muted-foreground">
                        {moods.find(m => m.id === selectedMood)?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Playlists */}
              {playlistsLoading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading playlists...</p>
                  </CardContent>
                </Card>
              ) : playlists && playlists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.slice(0, 6).map((playlist) => (
                    <Card key={playlist.id} data-testid={`playlist-${playlist.id}`} className="card-hover cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Music className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground text-sm line-clamp-1">{playlist.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {playlist.description || 'Curated playlist for your mood'}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {playlist.tracks_total || 0} tracks
                              </Badge>
                              {playlist.external_url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenSpotify(playlist.external_url!);
                                  }}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Spotify
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Connect to Spotify</h3>
                    <p className="text-muted-foreground mb-4">
                      To access personalized playlists, connect your Spotify account.
                    </p>
                    <Button 
                      data-testid="button-connect-spotify"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => toast({
                        title: "Spotify Integration",
                        description: "Spotify connection would be configured here in a full implementation.",
                      })}
                    >
                      Connect Spotify
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Track List */}
              {tracks && tracks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Music className="w-5 h-5" />
                      <span>Track Preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tracks.slice(0, 10).map((track, index) => (
                        <div 
                          key={track.id}
                          data-testid={`track-${index}`}
                          className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer smooth-transition ${
                            currentlyPlaying?.id === track.id ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => handlePlayTrack(track)}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0"
                          >
                            {currentlyPlaying?.id === track.id && isPlaying ? 
                              <Pause className="w-4 h-4" /> : 
                              <Play className="w-4 h-4" />
                            }
                          </Button>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{track.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{track.artists}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(track.duration)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Player Controls */}
              {currentlyPlaying && (
                <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{currentlyPlaying.name}</h4>
                        <p className="text-sm opacity-80">{currentlyPlaying.artists}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <SkipForward className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Benefits */}
        <TabsContent value="benefits" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">The Science of Music & Wellbeing</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Research shows that music has powerful effects on our brain, emotions, and overall mental health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {musicBenefits.map((benefit, index) => (
              <Card key={index} data-testid={`benefit-${index}`} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Research Insights */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>Research Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Cognitive Benefits</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Classical music can improve spatial-temporal reasoning by up to 23%</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Background music at 70dB can enhance creative thinking</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Instrumental music reduces cognitive load during complex tasks</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Emotional Benefits</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Music therapy reduces anxiety symptoms by 38% on average</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Listening to music releases dopamine and endorphins</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>Slow tempo music lowers cortisol levels and blood pressure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
