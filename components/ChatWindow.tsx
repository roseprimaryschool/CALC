
import React, { useState, useRef, useEffect } from 'react';
import { Message, User, Reaction } from '../types.ts';
import { EMOJIS } from '../constants.ts';

interface ChatWindowProps {
  title: string;
  messages: Message[];
  activeChatId: string;
  currentUser: User;
  users: User[];
  onSendMessage: (text: string, receiverId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onViewProfile: (user: User) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  title, 
  messages, 
  activeChatId, 
  currentUser, 
  users, 
  onSendMessage,
  onAddReaction,
  onViewProfile
}) => {
  const [inputText, setInputText] = useState('');
  const [longPressMessage, setLongPressMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<number | null>(null);

  const filteredMessages = messages.filter(m => {
    if (activeChatId === 'global') return m.receiverId === 'global';
    return (m.senderId === currentUser.id && m.receiverId === activeChatId) ||
           (m.senderId === activeChatId && m.receiverId === currentUser.id);
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [filteredMessages, activeChatId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText, activeChatId);
    setInputText('');
  };

  const startPress = (msgId: string) => {
    pressTimer.current = window.setTimeout(() => setLongPressMessage(msgId), 600);
  };

  const cancelPress = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  const getSender = (id: string) => users.find(u => u.id === id) || currentUser;

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${activeChatId === 'global' ? 'bg-indigo-600/20' : ''}`}>
             {activeChatId === 'global' ? '🌍' : (
               <img src={users.find(u => u.id === activeChatId)?.avatar} className="w-10 h-10 rounded-xl object-cover cursor-pointer" alt="" onClick={() => { const u = users.find(u => u.id === activeChatId); if (u) onViewProfile(u); }} />
             )}
          </div>
          <div>
            <h2 className="font-bold text-lg text-white leading-tight">{title}</h2>
            <p className="text-xs text-slate-500">{activeChatId === 'global' ? `${users.length + 1} members` : (users.find(u => u.id === activeChatId)?.lastOnline || 'Offline')}</p>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" onClick={() => setLongPressMessage(null)}>
        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const sender = getSender(msg.senderId);
          const showSender = activeChatId === 'global' && !isMe;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2 duration-300`} onMouseDown={() => startPress(msg.id)} onMouseUp={cancelPress} onMouseLeave={cancelPress} onTouchStart={() => startPress(msg.id)} onTouchEnd={cancelPress}>
              <div className="flex items-end gap-2 max-w-[80%]">
                {!isMe && <img src={sender.avatar} className="w-8 h-8 rounded-lg object-cover mb-1 cursor-pointer" alt="" onClick={() => onViewProfile(sender)} />}
                <div className="relative">
                  {showSender && <p className="text-[10px] font-bold text-slate-500 mb-1 ml-1">{sender.displayName}</p>}
                  <div className={`p-4 rounded-3xl relative ${isMe ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    {msg.reactions.length > 0 && (
                      <div className={`absolute -bottom-3 ${isMe ? 'right-0' : 'left-0'} flex gap-1`}>
                        {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => (
                          <div key={emoji} className="bg-slate-700 border border-slate-600 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <span>{emoji}</span>
                            <span className="font-bold">{msg.reactions.filter(r => r.emoji === emoji).length}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[9px] text-slate-600 mt-1 uppercase font-bold tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {longPressMessage === msg.id && (
                <div className={`absolute z-20 bg-slate-800 border border-slate-700 p-2 rounded-2xl shadow-2xl flex gap-2 animate-in fade-in zoom-in duration-200 ${isMe ? '-translate-x-full' : 'translate-x-12'}`}>
                  {EMOJIS.map(e => <button key={e} onClick={() => { onAddReaction(msg.id, e); setLongPressMessage(null); }} className="text-lg hover:scale-125 transition-transform">{e}</button>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSend} className="relative flex items-center gap-3">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-slate-500 pr-16" placeholder="Type your message..." />
          <button type="submit" disabled={!inputText.trim()} className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-90 disabled:opacity-50 disabled:scale-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
