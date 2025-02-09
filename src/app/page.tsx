'use client';

import { useTheme } from './contexts/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { characters, topics } from './lib/data';
import type { Character, Topic } from './lib/data';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-stone-100 text-stone-900'}`}>
      {/* Header */}
      <header className={`p-4 ${theme === 'dark' ? 'bg-stone-950' : 'bg-white'} shadow-md sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif">Biblical Wisdom</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-stone-800 hover:bg-stone-700' 
                : 'bg-stone-200 hover:bg-stone-300'
            } transition-colors`}
          >
            <span className="material-icons">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-serif mb-4">Explore Biblical Wisdom</h2>
          <p className={`text-xl ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
            Chat with biblical figures and discover timeless wisdom for modern life
          </p>
        </section>

        {/* Characters Section */}
        <section>
          <h2 className="text-2xl font-serif mb-6">Biblical Characters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map(character => (
              <Link 
                key={character.id}
                href={`/chat/${character.id}`}
                className={`p-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-stone-800 hover:bg-stone-700'
                    : 'bg-white hover:bg-stone-50'
                } transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{character.name}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      {character.description}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      {character.followers} followers
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Topics Section */}
        <section>
          <h2 className="text-2xl font-serif mb-6">Biblical Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topics.map(topic => (
              <Link
                key={topic.id}
                href={`/topic/${topic.id}`}
                className={`p-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-stone-800 hover:bg-stone-700'
                    : 'bg-white hover:bg-stone-50'
                } transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200'
                  }`}>
                    <span className="material-icons text-2xl">
                      {topic.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{topic.title}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      {topic.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
