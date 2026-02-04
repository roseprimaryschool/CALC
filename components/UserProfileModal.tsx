
import React from 'react';
import { User } from '../types';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onStartChat: (id: string) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onStartChat }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="relative h-40 bg-gradient-to-br from-indigo-600 to-purple-700">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-8 pb-10 -mt-16 text-center">
          <img src={user.avatar} alt={user.displayName} className="w-32 h-32 rounded-[2rem] object-cover mx-auto ring-8 ring-slate-900 shadow-2xl" />
          
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">{user.displayName}</h2>
            <p className="text-slate-400 font-medium mt-1">@{user.username}</p>
          </div>

          <div className="mt-8 py-4 px-6 bg-slate-800/50 rounded-3xl border border-slate-800 inline-block">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${user.lastOnline === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{user.lastOnline}</span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <button 
              onClick={() => onStartChat(user.id)}
              className="col-span-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
