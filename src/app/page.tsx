'use client';

import { useTheme } from './contexts/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { characters, topics } from './lib/data';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100">
      {/* Header */}
      <header className="p-4 bg-stone-950 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif">Biblical Wisdom</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <span className="material-icons">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h2 className="text-4xl font-serif mb-4">Explore Biblical Wisdom</h2>
          <p className="text-xl text-stone-400">
            Chat with biblical figures and discover timeless wisdom for modern life
          </p>
        </section>

        {/* Characters Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif mb-6">Biblical Characters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.map(character => (
              <Link 
                key={character.id}
                href={`/chat/${character.id}`}
                className="flex items-center p-4 bg-stone-800 rounded-lg hover:bg-stone-700 transition-all"
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{character.name}</h3>
                    <p className="text-sm text-stone-400">{character.description}</p>
                    <p className="text-xs text-stone-500 mt-1">{character.followers} followers</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Topics Section */}
        <section>
          <h2 className="text-2xl font-serif mb-6">Biblical Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map(topic => (
              <Link
                key={topic.id}
                href={`/topic/${topic.id}`}
                className="flex items-center p-4 bg-stone-800 rounded-lg hover:bg-stone-700 transition-all"
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="w-12 h-12 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-2xl">
                      {topic.icon}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{topic.title}</h3>
                    <p className="text-sm text-stone-400">{topic.description}</p>
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
