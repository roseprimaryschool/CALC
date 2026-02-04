
import React from 'react';
import { User, Message } from '../types.ts';

interface SidebarProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  activeChatId: string;
  onChatSelect: (id: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  users, 
  messages, 
  activeChatId, 
  onChatSelect, 
  onOpenSettings,
  onLogout 
}) => {
  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const getLatestMessage = (chatId: string) => {
    const chatMsgs = messages.filter(m => 
      chatId === 'global' ? m.receiverId === 'global' :
      (m.senderId === currentUser.id && m.receiverId === chatId) ||
      (m.senderId === chatId && m.receiverId === currentUser.id)
    );
    return chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1].text : 'Start a conversation';
  };

  return (
    <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/50">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <button 
          onClick={onOpenSettings}
          className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <span className="font-bold text-lg">Chats</span>
        <button 
          onClick={onLogout}
          className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-red-500"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
      <div className="px-4 py-6 bg-slate-800/30">
        <div className="flex items-center gap-3">
          <img src={currentUser.avatar} alt="Me" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900" />
          <div>
            <h3 className="font-bold text-white">{currentUser.displayName}</h3>
            <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Online</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-1">
          <button 
            onClick={() => onChatSelect('global')}
            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${activeChatId === 'global' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${activeChatId === 'global' ? 'bg-indigo-500' : 'bg-slate-700'}`}>🌍</div>
            <div className="flex-1 text-left">
              <h4 className={`font-semibold ${activeChatId === 'global' ? 'text-white' : 'text-slate-200'}`}>Global Room</h4>
              <p className={`text-xs truncate max-w-[140px] ${activeChatId === 'global' ? 'text-indigo-100' : 'text-slate-500'}`}>{getLatestMessage('global')}</p>
            </div>
          </button>
          <div className="pt-4 pb-2 px-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Direct Messages</p>
          </div>
          {otherUsers.map(user => (
            <button 
              key={user.id}
              onClick={() => onChatSelect(user.id)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${activeChatId === user.id ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800'}`}
            >
              <div className="relative">
                <img src={user.avatar} alt={user.displayName} className="w-12 h-12 rounded-2xl object-cover" />
                {user.lastOnline === 'Online' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-900 rounded-full" />}
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-semibold ${activeChatId === user.id ? 'text-white' : 'text-slate-200'}`}>{user.displayName}</h4>
                <p className={`text-xs truncate max-w-[140px] ${activeChatId === user.id ? 'text-indigo-100' : 'text-slate-500'}`}>{getLatestMessage(user.id)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
