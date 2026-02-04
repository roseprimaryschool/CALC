
import React, { useState } from 'react';
import Auth from './Auth';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import SettingsModal from './SettingsModal';
import UserProfileModal from './UserProfileModal';
import { User, AppState, Message } from '../types';

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
      {/* Sidebar */}
      <Sidebar 
        currentUser={state.currentUser}
        users={state.users}
        messages={state.messages}
        activeChatId={activeChatId}
        onChatSelect={setActiveChatId}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={onLogout}
      />

      {/* Main Chat Area */}
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

      {/* Modals */}
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
