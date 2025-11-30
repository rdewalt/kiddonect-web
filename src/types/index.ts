export interface User {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  accountType: 'parent' | 'leader';
  kiddonectCode?: string;
  profilePictureUrl?: string;
  bio?: string;
  location?: string;
  createdAt: string;
}

export interface Kid {
  id: number;
  firstName: string;
  lastName: string;
  birthdate: string;
  interests?: string;
  allergies?: string;
  medicalNotes?: string;
  profilePictureUrl?: string;
}

export interface Event {
  eventCode: string;
  creatorSub: string;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  eventType?: string;
  ageGroup?: string;
  cost?: string;
  eventPictureUrl?: string;
  createdAt: string;
  creatorName?: string;
  creatorEmail?: string;
  isParticipant?: boolean;
  rsvpStatus?: 'going' | 'maybe' | 'not_going';
}

export interface EventParticipant {
  id: number;
  eventCode: string;
  parentSub: string;
  kidId?: number;
  rsvpStatus: 'going' | 'maybe' | 'not_going';
  responseMessage?: string;
  joinedAt: string;
  userName?: string;
  userEmail?: string;
}

export interface Connection {
  id: number;
  requesterSub: string;
  recipientSub: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  respondedAt?: string;
  requesterName?: string;
  requesterEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
}

export interface Conversation {
  id: number;
  participant1Sub: string;
  participant2Sub: string;
  lastMessageAt?: string;
  createdAt: string;
  otherUserName?: string;
  otherUserEmail?: string;
  otherUserSub?: string;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderSub: string;
  message: string;
  readAt?: string;
  createdAt: string;
  senderName?: string;
  isRead?: boolean;
}

export interface Photo {
  id: number;
  eventCode: string;
  uploaderSub: string;
  photoUrl: string;
  caption?: string;
  uploadedAt: string;
  uploaderName?: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
}

export interface PhotoComment {
  id: number;
  photoId: number;
  commenterSub: string;
  comment: string;
  createdAt: string;
  commenterName?: string;
  commenterEmail?: string;
}

export interface PhotoLike {
  id: number;
  photoId: number;
  userSub: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}
