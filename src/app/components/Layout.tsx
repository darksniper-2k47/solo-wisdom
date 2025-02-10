'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../contexts/ThemeContext';
import Image from 'next/image';
import { characters, topics } from '../lib/data';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const { theme } = useTheme();

  // Get current character/topic from URL
  const getCurrentContext = () => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length >= 2) {
      const type = segments[0]; // 'chat' or 'topic'
      const id = segments[1];   // character or topic id
      return { type, id };
    }
    return null;
  };

  // Load chat history on client side only
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    setChatHistory(history);
  }, []);

  // Delete chat function
  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const updatedHistory = history.filter((chat: any) => chat.id !== chatId);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    setChatHistory(updatedHistory);
  };

  // Clear all chats function
  const clearAllChats = () => {
    localStorage.setItem('chatHistory', '[]');
    setChatHistory([]);
    router.push('/');
  };

  // Group chats by character/topic
  const groupedChats = chatHistory.reduce((groups: any, chat: any) => {
    const key = chat.characterId || chat.topicId || 'general';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(chat);
    return groups;
  }, {});

  // Get current context chats
  const currentContext = getCurrentContext();
  const currentKey = currentContext?.id || 'general';
  const currentChats = groupedChats[currentKey] || [];

  // Update navigation function
  const navigateToChat = (key: string, chatId: string) => {
    if (key === 'general') {
      router.push(`/?chat=${chatId}`);
    } else {
      const isCharacter = characters.find(c => c.id === key);
      if (isCharacter) {
        router.push(`/chat/${key}?chat=${chatId}`);
      } else {
        router.push(`/topic/${key}?chat=${chatId}`);
      }
    }
  };

  // Update new chat function
  const startNewChat = () => {
    const currentContext = getCurrentContext();
    
    if (currentContext) {
      if (currentContext.type === 'chat') {
        // For character chats
        router.push(`/chat/${currentContext.id}`);
      } else if (currentContext.type === 'topic') {
        // For topic chats
        router.push(`/topic/${currentContext.id}`);
      }
    } else {
      // If no context, go to home
      router.push('/');
    }
    
    // Clear current chat from localStorage
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    localStorage.setItem('chatHistory', JSON.stringify(history));
  };

  return (
    <div className="flex h-screen bg-stone-100 dark:bg-stone-900">
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-200 
        transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden border-r border-stone-300 dark:border-stone-800 shadow-lg`}>
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link 
              href="/" 
              className="text-xl font-serif flex-1 text-stone-900 dark:text-stone-200 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              Biblical Wisdom
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 p-2"
            >
              <span className="material-icons text-xl">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
          </div>
          
          {/* New Chat Button */}
          <button 
            onClick={startNewChat}
            className="flex items-center p-2 bg-amber-600 hover:bg-amber-700 
              text-white rounded-lg w-full mb-4 transition-colors"
          >
            <span className="material-icons mr-2">add</span>
            New Chat
          </button>

          {/* Chat History - Only show if there are chats */}
          {currentChats.length > 0 && (
            <div className="mt-6 space-y-6 overflow-y-auto">
              <div>
                <h2 className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-2 flex items-center">
                  {currentContext && characters.find(c => c.id === currentContext.id) && (
                    <Image
                      src={characters.find(c => c.id === currentContext.id)?.image || ''}
                      alt={characters.find(c => c.id === currentContext.id)?.name || ''}
                      width={20}
                      height={20}
                      className="rounded-full mr-2"
                    />
                  )}
                  {currentContext && topics.find(t => t.id === currentContext.id) && (
                    <span className="material-icons text-sm mr-2">
                      {topics.find(t => t.id === currentContext.id)?.icon}
                    </span>
                  )}
                  {currentContext 
                    ? characters.find(c => c.id === currentContext.id)?.name || 
                      topics.find(t => t.id === currentContext.id)?.title 
                    : 'General'
                  }
                </h2>
                <div className="space-y-1">
                  {currentChats.map((chat: any) => (
                    <div key={chat.id} className="group relative flex items-center">
                      <button
                        onClick={() => navigateToChat(currentKey, chat.id)}
                        className="w-full text-left p-2 hover:bg-stone-200 
                          dark:hover:bg-stone-800 rounded-lg"
                      >
                        <p className="font-medium truncate">{chat.title}</p>
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {new Date(chat.createdAt).toLocaleString()}
                        </p>
                      </button>
                      <button
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 
                          text-red-400 hover:text-red-300 transition-opacity p-1"
                      >
                        <span className="material-icons text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button for collapsed state */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 text-stone-900 dark:text-stone-200 hover:text-stone-700 dark:hover:text-stone-100 p-2 bg-white dark:bg-stone-800 rounded-lg shadow-lg"
        >
          <span className="material-icons">menu</span>
        </button>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {children}
      </div>
    </div>
  );
} 