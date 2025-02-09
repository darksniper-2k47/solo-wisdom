'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function History() {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    setChatHistory(history);
  }, []);

  return (
    <div className="p-8 bg-stone-900 text-stone-100 min-h-screen">
      <h1 className="text-3xl font-serif mb-8">Chat History</h1>
      <div className="grid gap-4">
        {chatHistory.map((chat: any) => (
          <Link 
            href={`/chat/${chat.id}`} 
            key={chat.id}
            className="p-4 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors"
          >
            <h2 className="font-semibold">{chat.title}</h2>
            <p className="text-sm text-stone-400">
              {new Date(chat.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
} 