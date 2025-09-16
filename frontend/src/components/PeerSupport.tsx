import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Heart, 
  MessageSquare, 
  Plus, 
  ThumbsUp, 
  AlertTriangle,
  Shield,
  Users,
  Clock,
  Send
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { peerApi } from '../lib/api';
import { useUser } from '../hooks/useUserData';
import { useToast } from '../hooks/use-toast';

interface Post {
  id: string;
  userId: string;
  title?: string;
  content: string;
  tags?: string[];
  likes: number;
  anonymous: boolean;
  createdAt: Date;
  comments?: Comment[];
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  anonymous: boolean;
  createdAt: Date;
}

const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800', 
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-yellow-100 text-yellow-800',
  'bg-indigo-100 text-indigo-800'
];

const commonTags = [
  '#exam-stress',
  '#anxiety', 
  '#depression',
  '#homesickness',
  '#study-tips',
  '#success-story',
  '#relationships',
  '#academic-pressure'
];

const samplePosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    content: 'Finals are coming up and I\'m feeling overwhelmed. Has anyone found good study techniques that help with anxiety? I keep procrastinating because everything feels too much. 😔',
    tags: ['exam-stress', 'anxiety'],
    likes: 12,
    anonymous: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    comments: [
      {
        id: 'c1',
        postId: '1',
        userId: 'user2',
        content: 'I break down big tasks into tiny pieces - like just reading one page or doing 5 problems. It makes everything less scary! You\'ve got this! 💪',
        likes: 5,
        anonymous: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: '2',
    userId: 'user3',
    content: 'First semester away from home and missing family so much. Anyone else feeling this way? How do you cope with being far from everything familiar? 🏠',
    tags: ['homesickness', 'support'],
    likes: 18,
    anonymous: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: '3',
    userId: 'user4',
    content: 'Just wanted to share that I finally talked to a counselor after weeks of anxiety. It was scary but so worth it. To anyone hesitating - you deserve support and it\'s okay to ask for help! ❤️',
    tags: ['success-story', 'counseling'],
    likes: 25,
    anonymous: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  }
];

export default function PeerSupport() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] as string[] });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const { user } = useUser();
  const { toast } = useToast();

  // In a real app, these would be actual API calls
  const { data: apiPosts, isLoading } = useQuery({
    queryKey: ['/api/peer/posts'],
    queryFn: () => peerApi.getPosts(20),
    // Using sample data for now
    enabled: false
  });

  const createPostMutation = useMutation({
    mutationFn: (postData: any) => peerApi.createPost(postData),
    onSuccess: (newPost) => {
      setPosts(prev => [newPost, ...prev]);
      setShowCreatePost(false);
      setNewPost({ title: '', content: '', tags: [] });
      toast({
        title: "Post Created",
        description: "Your anonymous post has been shared with the community.",
      });
    },
    onError: () => {
      toast({
        title: "Post Failed",
        description: "There was an issue creating your post. Please try again.",
        variant: "destructive"
      });
    }
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => peerApi.likePost(postId),
    onSuccess: (_, postId) => {
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    }
  });

  const handleCreatePost = () => {
    if (!user?.id || !newPost.content.trim()) return;

    const postData = {
      userId: user.id,
      title: newPost.title.trim() || undefined,
      content: newPost.content.trim(),
      tags: newPost.tags,
      anonymous: true
    };

    // For demo, add locally
    const demoPost: Post = {
      id: Date.now().toString(),
      ...postData,
      likes: 0,
      createdAt: new Date()
    };
    setPosts(prev => [demoPost, ...prev]);
    setShowCreatePost(false);
    setNewPost({ title: '', content: '', tags: [] });
    
    toast({
      title: "Post Created",
      description: "Your anonymous post has been shared with the community.",
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim() || !user?.id) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      userId: user.id,
      content: newComment.trim(),
      likes: 0,
      anonymous: true,
      createdAt: new Date()
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...(post.comments || []), comment] }
        : post
    ));
    
    setNewComment('');
    
    toast({
      title: "Comment Added",
      description: "Your response has been posted anonymously.",
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getRandomColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  const getAnonymousInitials = (userId: string) => {
    // Generate consistent but anonymous initials based on user ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return chars[hash % 26] + chars[(hash * 2) % 26];
  };

  return (
    <div data-testid="peer-support" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Peer Support Community</h2>
        <p className="text-lg text-muted-foreground">
          Connect with fellow students in a safe, anonymous, and moderated space
        </p>
      </div>

      {/* Important Notice */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800">Important Reminder</p>
              <p className="text-sm text-yellow-700 mt-1">
                Peer support is valuable but not a substitute for professional help. 
                If you're in crisis, please contact a counselor or call 988 immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Share Your Experience</CardTitle>
              <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-post" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Anonymous Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input
                        data-testid="input-post-title"
                        placeholder="Title (optional)"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Textarea
                        data-testid="textarea-post-content"
                        placeholder="Share your thoughts, ask for advice, or offer support..."
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        required
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {commonTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10 text-xs"
                            onClick={() => {
                              const tagName = tag.substring(1);
                              if (!newPost.tags.includes(tagName)) {
                                setNewPost(prev => ({ 
                                  ...prev, 
                                  tags: [...prev.tags, tagName] 
                                }));
                              }
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {newPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newPost.tags.map((tag, index) => (
                            <Badge key={tag} className={getRandomColor(index)}>
                              #{tag}
                              <button
                                className="ml-2 hover:text-red-600"
                                onClick={() => setNewPost(prev => ({ 
                                  ...prev, 
                                  tags: prev.tags.filter(t => t !== tag) 
                                }))}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Your post will be shared anonymously. Personal information is never visible.
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCreatePost(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        data-testid="button-submit-post"
                        onClick={handleCreatePost}
                        disabled={!newPost.content.trim()}
                      >
                        Post Anonymously
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} data-testid={`post-${post.id}`} className="hover:shadow-md smooth-transition">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm">
                        {getAnonymousInitials(post.userId)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-foreground">Anonymous Student</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeAgo(post.createdAt)}
                        </span>
                        {post.tags && post.tags.map((tag, index) => (
                          <Badge key={tag} variant="secondary" className={`text-xs ${getRandomColor(index)}`}>
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {post.title && (
                        <h4 className="font-medium text-foreground mb-2">{post.title}</h4>
                      )}
                      
                      <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <button
                          data-testid={`button-like-${post.id}`}
                          onClick={() => handleLikePost(post.id)}
                          className="flex items-center space-x-2 hover:text-red-500 smooth-transition"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        
                        <button
                          data-testid={`button-comment-${post.id}`}
                          onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
                          className="flex items-center space-x-2 hover:text-blue-500 smooth-transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments?.length || 0} replies</span>
                        </button>
                      </div>
                      
                      {/* Comments Section */}
                      {selectedPost?.id === post.id && (
                        <div className="mt-6 space-y-4">
                          {/* Existing Comments */}
                          {post.comments?.map((comment) => (
                            <div key={comment.id} className="flex items-start space-x-3 pl-4 border-l-2 border-muted">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                                  {getAnonymousInitials(comment.userId)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <p className="text-sm text-foreground">{comment.content}</p>
                                </div>
                                <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                                  <span>{getTimeAgo(comment.createdAt)}</span>
                                  <button className="flex items-center space-x-1 hover:text-red-500">
                                    <Heart className="w-3 h-3" />
                                    <span>{comment.likes}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add Comment */}
                          <div className="flex items-start space-x-3 pl-4">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-muted">
                                <Users className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                data-testid={`textarea-comment-${post.id}`}
                                placeholder="Share your support or advice..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={2}
                              />
                              <div className="flex justify-end">
                                <Button 
                                  data-testid={`button-add-comment-${post.id}`}
                                  size="sm" 
                                  onClick={() => handleAddComment(post.id)}
                                  disabled={!newComment.trim()}
                                >
                                  <Send className="w-3 h-3 mr-2" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <Heart className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-sm text-foreground">Be kind and supportive</span>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                <span className="text-sm text-foreground">Respect anonymity</span>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm text-foreground">Keep it safe for everyone</span>
              </div>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span className="text-sm text-foreground">Report concerning content</span>
              </div>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {commonTags.map((tag, index) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`cursor-pointer hover:shadow-sm transition-all text-xs ${getRandomColor(index)}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need More Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button data-testid="button-ai-chat" variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Talk to AI Assistant
              </Button>
              <Button data-testid="button-book-counselor" variant="outline" size="sm" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Book Counselor
              </Button>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-red-800 text-xs font-medium mb-1">Crisis Support</p>
                <p className="text-red-700 text-xs">Call <strong>988</strong> for immediate help</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
