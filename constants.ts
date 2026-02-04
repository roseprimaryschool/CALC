
import { User } from './types';

export const STORAGE_KEY = 'secret_social_app_data_v2';

export const INITIAL_USERS: User[] = [
  {
    id: 'system_gemini',
    username: 'gemini',
    displayName: 'Gemini',
    avatar: 'https://img.freepik.com/free-vector/starry-night-sky-background_52683-100236.jpg', // Professional AI look
    lastOnline: 'Online'
  }
];

export const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🚀', '💯'];
