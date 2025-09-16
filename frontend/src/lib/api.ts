import { apiRequest } from "./queryClient";
import type { 
  User, 
  InsertUser, 
  MoodEntry, 
  InsertMoodEntry,
  HealthAssessment,
  InsertHealthAssessment,
  Booking,
  InsertBooking,
  PeerPost,
  InsertPeerPost,
  PeerComment,
  InsertPeerComment,
  ChatSession,
  Resource
} from "@shared/schema";

// Auth API
export const authApi = {
  register: async (userData: InsertUser): Promise<{ user: User }> => {
    const res = await apiRequest("POST", "/api/auth/register", userData);
    return res.json();
  },
  
  login: async (credentials: { username: string; password: string }): Promise<{ user: User }> => {
    const res = await apiRequest("POST", "/api/auth/login", credentials);
    return res.json();
  }
};

// User API
export const userApi = {
  getUser: async (id: string): Promise<User> => {
    const res = await apiRequest("GET", `/api/users/${id}`);
    return res.json();
  },
  
  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    const res = await apiRequest("PUT", `/api/users/${id}`, updates);
    return res.json();
  }
};

// Mood API
export const moodApi = {
  createMoodEntry: async (entry: InsertMoodEntry): Promise<MoodEntry> => {
    const res = await apiRequest("POST", "/api/mood", entry);
    return res.json();
  },
  
  getMoodEntries: async (userId: string, limit?: number): Promise<MoodEntry[]> => {
    const params = limit ? `?limit=${limit}` : '';
    const res = await apiRequest("GET", `/api/mood/${userId}${params}`);
    return res.json();
  }
};

// Assessment API
export const assessmentApi = {
  createAssessment: async (data: { userId: string; responses: Record<string, number> }): Promise<{
    assessment: HealthAssessment;
    insights: string;
    recommendations: string[];
  }> => {
    const res = await apiRequest("POST", "/api/assessment", data);
    return res.json();
  },
  
  getLatestAssessment: async (userId: string): Promise<HealthAssessment | null> => {
    const res = await apiRequest("GET", `/api/assessment/${userId}/latest`);
    return res.json();
  }
};

// Booking API
export const bookingApi = {
  createBooking: async (booking: InsertBooking): Promise<Booking> => {
    const res = await apiRequest("POST", "/api/bookings", booking);
    return res.json();
  },
  
  getBookings: async (userId: string): Promise<Booking[]> => {
    const res = await apiRequest("GET", `/api/bookings/${userId}`);
    return res.json();
  }
};

// Peer Support API
export const peerApi = {
  createPost: async (post: InsertPeerPost): Promise<PeerPost> => {
    const res = await apiRequest("POST", "/api/peer/posts", post);
    return res.json();
  },
  
  getPosts: async (limit?: number): Promise<PeerPost[]> => {
    const params = limit ? `?limit=${limit}` : '';
    const res = await apiRequest("GET", `/api/peer/posts${params}`);
    return res.json();
  },
  
  createComment: async (comment: InsertPeerComment): Promise<PeerComment> => {
    const res = await apiRequest("POST", "/api/peer/comments", comment);
    return res.json();
  },
  
  getComments: async (postId: string): Promise<PeerComment[]> => {
    const res = await apiRequest("GET", `/api/peer/comments/${postId}`);
    return res.json();
  },
  
  likePost: async (postId: string): Promise<void> => {
    await apiRequest("POST", `/api/peer/posts/${postId}/like`);
  }
};

// Chat API
export const chatApi = {
  sendMessage: async (data: { userId: string; message: string }): Promise<{
    response: string;
    riskLevel: 'low' | 'medium' | 'high';
    suggestedActions: string[];
  }> => {
    const res = await apiRequest("POST", "/api/chat", data);
    return res.json();
  },
  
  getChatSession: async (userId: string): Promise<ChatSession | null> => {
    const res = await apiRequest("GET", `/api/chat/${userId}`);
    return res.json();
  }
};

// Music API
export const musicApi = {
  getMoodPlaylists: async (mood: string): Promise<any[]> => {
    const res = await apiRequest("GET", `/api/music/playlists/${mood}`);
    return res.json();
  },
  
  getPlaylistTracks: async (playlistId: string): Promise<any[]> => {
    const res = await apiRequest("GET", `/api/music/playlist/${playlistId}/tracks`);
    return res.json();
  }
};

// Resources API
export const resourcesApi = {
  getResources: async (category?: string, language?: string): Promise<Resource[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (language) params.append('language', language);
    const query = params.toString() ? `?${params.toString()}` : '';
    
    const res = await apiRequest("GET", `/api/resources${query}`);
    return res.json();
  }
};

// Admin API
export const adminApi = {
  getAnalytics: async (): Promise<{
    totalUsers: number;
    totalCheckins: number;
    totalBookings: number;
    stressDistribution: { low: number; medium: number; high: number };
    departmentBreakdown: any[];
  }> => {
    const res = await apiRequest("GET", "/api/admin/analytics");
    return res.json();
  },
  
  getAllBookings: async (): Promise<Booking[]> => {
    const res = await apiRequest("GET", "/api/admin/bookings");
    return res.json();
  }
};
