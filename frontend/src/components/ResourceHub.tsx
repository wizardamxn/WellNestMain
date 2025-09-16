import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Play, 
  Download, 
  BookOpen, 
  Headphones,
  Clock,
  Globe,
  Filter,
  Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '../lib/api';
import { useToast } from '../hooks/use-toast';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'article' | 'guide';
  content: string;
  language: string;
  category: string;
  duration?: number;
  description?: string;
  rating?: number;
  isPopular?: boolean;
}

const categories = [
  { value: 'all', label: 'All Resources' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'stress', label: 'Stress Management' },
  { value: 'depression', label: 'Depression' },
  { value: 'sleep', label: 'Sleep & Rest' },
  { value: 'study', label: 'Study Skills' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'self-care', label: 'Self-Care' }
];

const languages = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'हिंदी (Hindi)' },
  { value: 'tamil', label: 'தமிழ் (Tamil)' },
  { value: 'bengali', label: 'বাংলা (Bengali)' }
];

const sampleResources: Resource[] = [
  {
    id: '1',
    title: 'Breathing Techniques for Anxiety',
    type: 'video',
    content: 'https://www.youtube.com/embed/YRPh_GaiL8s',
    language: 'english',
    category: 'anxiety',
    duration: 8,
    description: 'Learn simple yet effective breathing exercises to manage anxiety and panic attacks.',
    rating: 4.8,
    isPopular: true
  },
  {
    id: '2',
    title: 'Guided Sleep Meditation',
    type: 'audio',
    content: 'audio-meditation.mp3',
    language: 'english',
    category: 'sleep',
    duration: 20,
    description: 'A soothing meditation to help you relax and fall asleep peacefully.',
    rating: 4.9,
    isPopular: true
  },
  {
    id: '3',
    title: 'Managing Exam Stress',
    type: 'article',
    content: 'Complete guide content...',
    language: 'english',
    category: 'stress',
    duration: 10,
    description: 'Comprehensive strategies for handling academic pressure and performing your best during exams.',
    rating: 4.7
  },
  {
    id: '4',
    title: 'Mental Health First Aid Guide',
    type: 'guide',
    content: 'PDF guide content...',
    language: 'english',
    category: 'self-care',
    description: 'Essential guide for recognizing mental health issues and providing initial support.',
    rating: 4.6
  },
  {
    id: '5',
    title: 'योग और मानसिक स्वास्थ्य',
    type: 'video',
    content: 'https://www.youtube.com/embed/sample',
    language: 'hindi',
    category: 'self-care',
    duration: 15,
    description: 'योग और मानसिक स्वास्थ्य के बीच संबंध और सरल योग तकनीकें।',
    rating: 4.5
  }
];

export default function ResourceHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedType, setSelectedType] = useState('all');
  const { toast } = useToast();

  // In a real app, this would fetch from the API
  const { data: resources = sampleResources, isLoading } = useQuery({
    queryKey: ['/api/resources', selectedCategory === 'all' ? undefined : selectedCategory, selectedLanguage],
    queryFn: () => resourcesApi.getResources(
      selectedCategory === 'all' ? undefined : selectedCategory,
      selectedLanguage
    ),
    // Using sample data for now
    enabled: false
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesLanguage = resource.language === selectedLanguage;
    
    return matchesSearch && matchesType && matchesLanguage;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4 text-red-600" />;
      case 'audio': return <Headphones className="w-4 h-4 text-green-600" />;
      case 'article': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'guide': return <Download className="w-4 h-4 text-purple-600" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'guide': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResourceAccess = (resource: Resource) => {
    if (resource.type === 'video') {
      window.open(resource.content, '_blank');
    } else if (resource.type === 'guide') {
      // Simulate PDF download
      toast({
        title: "Download Started",
        description: `${resource.title} is being downloaded.`,
      });
    } else {
      toast({
        title: "Opening Resource",
        description: `Loading ${resource.title}...`,
      });
    }
  };

  return (
    <div data-testid="resource-hub" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Wellness Resource Hub</h2>
        <p className="text-lg text-muted-foreground">
          Free mental health resources in multiple languages to support your wellness journey
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  data-testid="search-resources"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="filter-category" className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger data-testid="filter-type" className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="guide">Guides</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger data-testid="filter-language" className="w-40">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger data-testid="tab-all" value="all">All Resources</TabsTrigger>
          <TabsTrigger data-testid="tab-videos" value="video">Videos</TabsTrigger>
          <TabsTrigger data-testid="tab-audio" value="audio">Audio</TabsTrigger>
          <TabsTrigger data-testid="tab-articles" value="article">Articles</TabsTrigger>
          <TabsTrigger data-testid="tab-guides" value="guide">Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {/* Popular Resources */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Popular Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources
                .filter(resource => resource.isPopular)
                .map((resource) => (
                <Card key={resource.id} className="card-hover smooth-transition cursor-pointer" onClick={() => handleResourceAccess(resource)}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <h4 data-testid={`resource-title-${resource.id}`} className="font-medium text-foreground text-sm line-clamp-1">
                          {resource.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          {resource.duration && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {resource.duration} min
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                    {resource.rating && (
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(resource.rating!) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">
                          {resource.rating}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Resources */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">All Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card 
                  key={resource.id} 
                  data-testid={`resource-card-${resource.id}`}
                  className="card-hover smooth-transition cursor-pointer" 
                  onClick={() => handleResourceAccess(resource)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {resource.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {resource.category}
                          </Badge>
                          {resource.duration && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {resource.duration} min
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {resource.rating && (
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(resource.rating!) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">
                            {resource.rating}
                          </span>
                        </div>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`text-xs ${
                          resource.type === 'video' ? 'text-red-600 hover:text-red-700' :
                          resource.type === 'audio' ? 'text-green-600 hover:text-green-700' :
                          resource.type === 'article' ? 'text-blue-600 hover:text-blue-700' :
                          'text-purple-600 hover:text-purple-700'
                        }`}
                      >
                        {getTypeIcon(resource.type)}
                        <span className="ml-2">
                          {resource.type === 'video' ? 'Watch' :
                           resource.type === 'audio' ? 'Listen' :
                           resource.type === 'article' ? 'Read' :
                           'Download'}
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Type-specific tabs would filter the same resources */}
        {['video', 'audio', 'article', 'guide'].map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .filter(resource => resource.type === type)
                .map((resource) => (
                <Card 
                  key={resource.id} 
                  className="card-hover smooth-transition cursor-pointer" 
                  onClick={() => handleResourceAccess(resource)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {resource.title}
                        </h4>
                        {resource.duration && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {resource.duration} min • {resource.language}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      {getTypeIcon(resource.type)}
                      <span className="ml-2">
                        {resource.type === 'video' ? 'Watch Video' :
                         resource.type === 'audio' ? 'Play Audio' :
                         resource.type === 'article' ? 'Read Article' :
                         'Download Guide'}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to find relevant resources.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
