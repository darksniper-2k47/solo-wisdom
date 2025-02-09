'use client';

import { useState } from 'react';

export default function ChatComponent() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Greetings, I am Solomon, son of David, king of Israel. I have been blessed by the LORD with wisdom to share understanding about the Proverbs and matters of life. What wisdom do you seek?'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setError(null);
      setIsLoading(true);
      const userMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get wisdom. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-stone-50 rounded-lg shadow-lg border border-stone-200">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4 mt-4">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}
      
      <div className="flex flex-col space-y-4 p-4 min-h-[500px] max-h-[600px] overflow-y-auto bg-gradient-to-b from-stone-50 to-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-4 rounded-lg max-w-[80%] shadow-sm break-words ${
                message.role === 'user'
                  ? 'bg-amber-700 text-stone-50'
                  : 'bg-stone-100 text-stone-800 border border-stone-200'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="font-serif text-stone-700 mb-1">Solomon</div>
              )}
              <div className="prose prose-stone max-w-none whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
      </div>

      <form 
        onSubmit={handleSubmit}
        className="border-t border-stone-200 p-4 bg-stone-100"
      >
        <div className="flex space-x-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for wisdom..."
            maxLength={200}
            className="flex-1 p-3 bg-white text-stone-800 placeholder-stone-500 border border-stone-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                     shadow-sm"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-amber-700 text-stone-50 rounded-lg hover:bg-amber-800 
                     transition-colors shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>
    </div>
  );
} 