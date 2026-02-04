
export interface User {
  id: string;
  username: string;
  password?: string; // Added for mock authentication
  displayName: string;
  avatar: string;
  lastOnline: string;
  isMe?: boolean;
}

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string; // 'global' or userId
  text: string;
  timestamp: number;
  reactions: Reaction[];
}

export enum View {
  CALCULATOR,
  SOCIAL
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  messages: Message[];
}
