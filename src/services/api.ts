import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import type {
  User,
  Kid,
  Event,
  EventParticipant,
  Connection,
  Conversation,
  Message,
  Photo,
  PhotoComment,
  ApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.kiddonect.com';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.client.interceptors.request.use(async (config) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get auth token:', error);
      }
      return config;
    });
  }

  // ==================== AUTH & PROFILE ====================

  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    accountType: 'parent' | 'leader';
  }): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.post('/api/signup', data);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/api/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.put('/api/profile', data);
    return response.data;
  }

  async generateKiddonectCode(): Promise<ApiResponse<{ code: string }>> {
    const response = await this.client.post('/api/kiddonect-code');
    return response.data;
  }

  async validateCode(code: string): Promise<ApiResponse<User>> {
    const response = await this.client.post('/api/validate-code', { code });
    return response.data;
  }

  // ==================== KIDS ====================

  async getKids(): Promise<ApiResponse<Kid[]>> {
    const response = await this.client.get('/api/kids');
    return response.data;
  }

  async addKid(data: Omit<Kid, 'id'>): Promise<ApiResponse<Kid>> {
    const response = await this.client.post('/api/kids', data);
    return response.data;
  }

  async updateKid(id: number, data: Partial<Kid>): Promise<ApiResponse<Kid>> {
    const response = await this.client.put(`/api/kids/${id}`, data);
    return response.data;
  }

  async deleteKid(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.delete(`/api/kids/${id}`);
    return response.data;
  }

  // ==================== EVENTS ====================

  async getEvents(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<ApiResponse<Event[]>> {
    const response = await this.client.get('/api/events', { params });
    return response.data;
  }

  async getMyEvents(): Promise<ApiResponse<Event[]>> {
    const response = await this.client.get('/api/events/my-events');
    return response.data;
  }

  async getEvent(eventCode: string): Promise<ApiResponse<Event>> {
    const response = await this.client.get(`/api/events/${eventCode}`);
    return response.data;
  }

  async createEvent(data: {
    title: string;
    description?: string;
    eventDate: string;
    location?: string;
    maxParticipants?: number;
    eventType?: string;
    ageGroup?: string;
    cost?: string;
  }): Promise<ApiResponse<Event>> {
    const response = await this.client.post('/api/events', data);
    return response.data;
  }

  async updateEvent(eventCode: string, data: Partial<Event>): Promise<ApiResponse<Event>> {
    const response = await this.client.put(`/api/events/${eventCode}`, data);
    return response.data;
  }

  async deleteEvent(eventCode: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.delete(`/api/events/${eventCode}`);
    return response.data;
  }

  async rsvpToEvent(
    eventCode: string,
    data: {
      kidId?: number;
      rsvpStatus: 'going' | 'maybe' | 'not_going';
      responseMessage?: string;
    }
  ): Promise<ApiResponse<EventParticipant>> {
    const response = await this.client.post(`/api/events/${eventCode}/rsvp`, data);
    return response.data;
  }

  async getEventParticipants(eventCode: string): Promise<ApiResponse<EventParticipant[]>> {
    const response = await this.client.get(`/api/events/${eventCode}/participants`);
    return response.data;
  }

  // ==================== CONNECTIONS ====================

  async getConnections(): Promise<ApiResponse<Connection[]>> {
    const response = await this.client.get('/api/connections');
    return response.data;
  }

  async getPendingRequests(): Promise<ApiResponse<Connection[]>> {
    const response = await this.client.get('/api/connections/pending');
    return response.data;
  }

  async sendConnectionRequest(data: {
    recipientCode: string;
    message?: string;
  }): Promise<ApiResponse<Connection>> {
    const response = await this.client.post('/api/connections/request', data);
    return response.data;
  }

  async respondToConnection(
    connectionId: number,
    action: 'accept' | 'reject'
  ): Promise<ApiResponse<Connection>> {
    const response = await this.client.post('/api/connections/respond', {
      connectionId,
      action,
    });
    return response.data;
  }

  async removeConnection(connectionId: number): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.delete(`/api/connections/${connectionId}`);
    return response.data;
  }

  // ==================== MESSAGING ====================

  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    const response = await this.client.get('/api/conversations');
    return response.data;
  }

  async getConversation(conversationId: number): Promise<ApiResponse<Conversation>> {
    const response = await this.client.get(`/api/conversations/${conversationId}`);
    return response.data;
  }

  async createConversation(otherUserSub: string): Promise<ApiResponse<Conversation>> {
    const response = await this.client.post('/api/conversations', { otherUserSub });
    return response.data;
  }

  async getMessages(conversationId: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Message[]>> {
    const response = await this.client.get(`/api/conversations/${conversationId}/messages`, {
      params,
    });
    return response.data;
  }

  async sendMessage(
    conversationId: number,
    message: string
  ): Promise<ApiResponse<Message>> {
    const response = await this.client.post(`/api/conversations/${conversationId}/messages`, {
      message,
    });
    return response.data;
  }

  async markMessageAsRead(messageId: number): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.put(`/api/messages/${messageId}/read`);
    return response.data;
  }

  // ==================== PHOTOS ====================

  async getEventPhotos(eventCode: string): Promise<ApiResponse<Photo[]>> {
    const response = await this.client.get(`/api/events/${eventCode}/photos`);
    return response.data;
  }

  async uploadPhoto(
    eventCode: string,
    file: File,
    caption?: string
  ): Promise<ApiResponse<Photo>> {
    // First, request upload URL
    const urlResponse = await this.client.post(`/api/events/${eventCode}/photos/upload-url`, {
      fileName: file.name,
      fileType: file.type,
    });

    const { uploadUrl, photoKey } = urlResponse.data;

    // Upload to S3
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    // Confirm upload
    const response = await this.client.post(`/api/events/${eventCode}/photos`, {
      photoKey,
      caption,
    });

    return response.data;
  }

  async deletePhoto(photoId: number): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.delete(`/api/photos/${photoId}`);
    return response.data;
  }

  async likePhoto(photoId: number): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.post(`/api/photos/${photoId}/like`);
    return response.data;
  }

  async unlikePhoto(photoId: number): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.delete(`/api/photos/${photoId}/like`);
    return response.data;
  }

  async getPhotoComments(photoId: number): Promise<ApiResponse<PhotoComment[]>> {
    const response = await this.client.get(`/api/photos/${photoId}/comments`);
    return response.data;
  }

  async addPhotoComment(
    photoId: number,
    comment: string
  ): Promise<ApiResponse<PhotoComment>> {
    const response = await this.client.post(`/api/photos/${photoId}/comments`, { comment });
    return response.data;
  }

  async deletePhotoComment(commentId: number): Promise<ApiResponse<{ message: string }>> {
    const response = await this.client.delete(`/api/photos/comments/${commentId}`);
    return response.data;
  }
}

export const api = new ApiService();
export default api;
