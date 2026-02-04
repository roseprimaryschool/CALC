
import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator.tsx';
import ChatApp from './components/ChatApp.tsx';
import { View, User, Message, AppState } from './types.ts';
import { STORAGE_KEY, INITIAL_USERS } from './constants.ts';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.CALCULATOR);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const systemUsers = INITIAL_USERS;
      const userCreatedAccounts = parsed.users.filter((u: User) => !u.id.startsWith('system_'));
      return {
        ...parsed,
        users: [...systemUsers, ...userCreatedAccounts]
      };
    }
    return {
      currentUser: null,
      users: INITIAL_USERS,
      messages: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleUnlock = () => {
    setView(View.SOCIAL);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUser: user }));
  };

  const handleSignUp = (user: User) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      users: [...prev.users, user]
    }));
  };

  const handleSendMessage = async (text: string, receiverId: string) => {
    if (!state.currentUser) return;
    
    const userMessageId = Math.random().toString(36).substr(2, 9);
    const newMessage: Message = {
      id: userMessageId,
      senderId: state.currentUser.id,
      receiverId,
      text,
      timestamp: Date.now(),
      reactions: []
    };

    const updatedMessages = [...state.messages, newMessage];
    setState(prev => ({
      ...prev,
      messages: updatedMessages
    }));

    if (receiverId === 'system_gemini') {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const chatHistory = updatedMessages
          .filter(m => 
            (m.senderId === state.currentUser?.id && m.receiverId === 'system_gemini') ||
            (m.senderId === 'system_gemini' && m.receiverId === state.currentUser?.id)
          )
          .map(m => ({
            role: m.senderId === 'system_gemini' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }));

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: chatHistory,
          config: {
             systemInstruction: "You are Gemini, a highly intelligent and empathetic AI assistant living inside a secure, dark-themed social application. You are chatting with a user in a private 1-on-1 message. Be helpful, concise, and maintain the persona of a sleek, modern chat partner."
          }
        });

        const aiText = response.text || "I'm processing that... give me a moment.";

        const geminiMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: 'system_gemini',
          receiverId: state.currentUser.id,
          text: aiText,
          timestamp: Date.now(),
          reactions: []
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, geminiMessage]
        }));
      } catch (error) {
        console.error("Gemini AI failed to respond:", error);
        const errorMessage: Message = {
          id: 'err-' + Date.now(),
          senderId: 'system_gemini',
          receiverId: state.currentUser!.id,
          text: "My neural link is currently unstable. Please check your connection or try again later.",
          timestamp: Date.now(),
          reactions: []
        };
        setState(prev => ({ ...prev, messages: [...prev.messages, errorMessage] }));
      }
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!state.currentUser) return;
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(m => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.find(r => r.userId === state.currentUser?.id && r.emoji === emoji);
        if (existing) {
          return {
            ...m,
            reactions: m.reactions.filter(r => !(r.userId === state.currentUser?.id && r.emoji === emoji))
          };
        }
        return {
          ...m,
          reactions: [...m.reactions, { emoji, userId: state.currentUser!.id }]
        };
      })
    }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  if (view === View.CALCULATOR) {
    return <Calculator onUnlock={handleUnlock} />;
  }

  return (
    <ChatApp 
      state={state}
      onLogin={handleLogin}
      onSignUp={handleSignUp}
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
      onSendMessage={handleSendMessage}
      onAddReaction={handleAddReaction}
    />
  );
};

export default App;
