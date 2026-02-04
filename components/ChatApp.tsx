
import React, { useState } from 'react';
import Auth from './Auth.tsx';
import Sidebar from './Sidebar.tsx';
import ChatWindow from './ChatWindow.tsx';
import SettingsModal from './SettingsModal.tsx';
import UserProfileModal from './UserProfileModal.tsx';
import { User, AppState, Message } from '../types.ts';

interface ChatAppProps {
  state: AppState;
  onLogin: (user: User) => void;
  onSignUp: (user: User) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onSendMessage: (text: string, receiverId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const ChatApp: React.FC<ChatAppProps> = ({ 
  state, 
  onLogin, 
  onSignUp,
  onLogout, 
  onUpdateUser, 
  onSendMessage, 
  onAddReaction 
}) => {
  const [activeChatId, setActiveChatId] = useState<string>('global');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileViewUser, setProfileViewUser] = useState<User | null>(null);

  if (!state.currentUser) {
    return <Auth onAuth={onLogin} onSignUp={onSignUp} state={state} />;
  }

  const activeUser = state.users.find(u => u.id === activeChatId);
  const chatTitle = activeChatId === 'global' ? 'Global Chatroom' : (activeUser?.displayName || 'Chat');

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 relative overflow-hidden">
      <Sidebar 
        currentUser={state.currentUser}
        users={state.users}
        messages={state.messages}
        activeChatId={activeChatId}
        onChatSelect={setActiveChatId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={onLogout}
      />
      <ChatWindow 
        title={chatTitle}
        messages={state.messages}
        activeChatId={activeChatId}
        currentUser={state.currentUser}
        users={state.users}
        onSendMessage={onSendMessage}
        onAddReaction={onAddReaction}
        onViewProfile={(u) => setProfileViewUser(u)}
      />
      {isSettingsOpen && (
        <SettingsModal 
          user={state.currentUser} 
          onClose={() => setIsSettingsOpen(false)} 
          onUpdate={onUpdateUser}
        />
      )}
      {profileViewUser && (
        <UserProfileModal 
          user={profileViewUser} 
          onClose={() => setProfileViewUser(null)}
          onStartChat={(id) => {
            setActiveChatId(id);
            setProfileViewUser(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatApp;
