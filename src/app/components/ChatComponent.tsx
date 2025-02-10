'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { characters, topics } from '../lib/data';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp?: Date;
}

interface ChatHistory {
  id: string;
  characterId?: string;
  topicId?: string;
  messages: Message[];
  createdAt: Date;
  title: string;
}

interface ChatComponentProps {
  characterId?: string;
  topicId?: string;
  chatId?: string;
}

export default function ChatComponent({ characterId, topicId, chatId }: ChatComponentProps) {
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [chatIdState, setChatId] = useState<string>('');

  // Get the current character or topic
  const currentCharacter = characterId ? characters.find(c => c.id === characterId) : null;
  const currentTopic = topicId ? topics.find(t => t.id === topicId) : null;

  // Load character-specific or topic-specific chat history
  useEffect(() => {
    setIsReady(true);
    
    if (!isReady) return;

    const allHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const currentKey = characterId || topicId;
    
    if (currentKey) {
      // If chatId is provided, find that specific chat
      if (chatId) {
        const existingChat = allHistory.find((chat: ChatHistory) => chat.id === chatId);
        if (existingChat) {
          setMessages(existingChat.messages);
          setChatTitle(existingChat.title);
          setChatId(existingChat.id);
          return;
        }
      }

      // If no chatId or chat not found, create new chat
      const newId = Date.now().toString();
      setChatId(newId);
      setMessages([{
        role: 'assistant',
        content: currentCharacter 
          ? `I am ${currentCharacter.name}. ${currentCharacter.description}. How may I assist you today?`
          : `Let's explore ${currentTopic?.title}. What would you like to know about ${currentTopic?.description.toLowerCase()}?`,
        timestamp: new Date()
      }]);
    }
  }, [isReady, characterId, topicId, chatId, currentCharacter, currentTopic]);

  // Save chat to history with character/topic ID
  useEffect(() => {
    if (!isReady || messages.length <= 1) return;

    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    
    // Generate title from first user message if it exists
    if (messages.length > 1 && messages[1].role === 'user') {
      const newTitle = generateTitle(messages[1].content);
      setChatTitle(newTitle);
    }

    // Update or create chat entry with character/topic ID
    const chatData = {
      id: chatIdState,
      characterId,
      topicId,
      messages,
      createdAt: new Date().toISOString(),
      title: chatTitle
    };

    const existingIndex = history.findIndex((chat: any) => chat.id === chatIdState);
    
    if (existingIndex >= 0) {
      history[existingIndex] = chatData;
    } else {
      history.unshift(chatData);
    }

    localStorage.setItem('chatHistory', JSON.stringify(history));
  }, [messages, chatIdState, isReady, characterId, topicId]);

  // Generate title from first user message
  const generateTitle = (content: string) => {
    // Remove special characters and extra spaces
    const cleanContent = content.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
    
    // Get first sentence or first 30 characters
    const firstSentence = cleanContent.split(/[.!?]/, 1)[0];
    const title = firstSentence.length > 30 
      ? firstSentence.substring(0, 27) + '...'
      : firstSentence;
      
    return title;
  };

  // Format message content to handle bold text
  const formatMessage = (content: string) => {
    return content.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>;
      }
      return part;
    });
  };

  // Process user input before sending
  const processUserInput = (input: string) => {
    // Remove extra spaces
    let processed = input.replace(/\s+/g, ' ').trim();
    
    // Add punctuation if missing at the end
    if (!processed.match(/[.!?]$/)) {
      processed += '.';
    }
    
    // Capitalize first letter if needed
    processed = processed.charAt(0).toUpperCase() + processed.slice(1);
    
    return processed;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setError(null);
      setIsLoading(true);
      
      // Process the input before sending
      const processedInput = processUserInput(input);
      
      const userMessage = { 
        role: 'user' as const, 
        content: processedInput,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          characterId,
          topicId
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { 
        ...data, 
        timestamp: new Date() 
      }]);

    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get wisdom. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) return null;

  return (
    <div className="flex flex-col h-full bg-stone-900">
      {/* Chat Header */}
      <div className="border-b border-stone-800 p-4 flex items-center justify-between bg-stone-950">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image
              src={currentCharacter?.image || '/default-icon.jpg'}
              alt={currentCharacter?.name || 'Topic'}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-medium text-stone-100">
              {currentCharacter?.name || currentTopic?.title}
            </h2>
            <p className="text-sm text-stone-400">{chatTitle}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={currentCharacter?.image || '/default-icon.jpg'}
                    alt={currentCharacter?.name || 'Character'}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-amber-600 text-white ml-2'
                    : 'bg-stone-800 text-stone-100'
                }`}
              >
                <div className="prose prose-invert max-w-none">
                  {formatMessage(message.content)}
                </div>
                {message.timestamp && (
                  <div className="text-xs mt-1 opacity-50">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-stone-800 p-4 bg-stone-950">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for wisdom..."
            className="flex-1 p-3 bg-stone-800 text-stone-100 
                     placeholder-stone-500 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-amber-500
                     border border-stone-700"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-amber-600 text-white rounded-lg 
                     hover:bg-amber-700 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="material-icons animate-spin">refresh</span>
            ) : (
              <span className="material-icons">send</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 