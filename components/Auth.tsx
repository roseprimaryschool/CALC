
import React, { useState } from 'react';
import { User, AppState } from '../types.ts';

interface AuthProps {
  onAuth: (user: User) => void;
  onSignUp: (user: User) => void;
  state: AppState;
}

const Auth: React.FC<AuthProps> = ({ onAuth, onSignUp, state }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const normalizedUsername = username.toLowerCase().trim();

    if (isLogin) {
      const foundUser = state.users.find(u => u.username === normalizedUsername);
      if (foundUser && foundUser.password === password) {
        onAuth(foundUser);
      } else {
        setError('Invalid username or password');
      }
    } else {
      const exists = state.users.find(u => u.username === normalizedUsername);
      if (exists) {
        setError('Username already taken');
        return;
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: normalizedUsername,
        password: password,
        displayName: displayName || username,
        avatar: `https://picsum.photos/seed/${username}/200`,
        lastOnline: 'Online',
        isMe: true
      };
      onSignUp(newUser);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-indigo-600/20 rounded-2xl mb-4">
            <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2a3 3 0 01-3 3H6a3 3 0 01-3-3v-4.586l4.707-4.707A1 1 0 006.293 8l-2-2 1.414-1.414 2 2a1 1 0 001.414 0l4.707-4.707V12a3 3 0 013 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 114 0 2 2 0 01-4 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Secure Login' : 'Create Account'}
          </h2>
          <p className="text-slate-400 mt-2">Credentials verified by the vault</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Username"
              required
            />
          </div>

          {!isLogin && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="How you appear to others"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            {isLogin ? 'Unlock Account' : 'Register Securely'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
