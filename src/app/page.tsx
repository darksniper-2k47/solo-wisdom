import ChatComponent from './components/ChatComponent';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-stone-50">
      <div className="w-full max-w-4xl p-4">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-serif text-gray-800 mb-2">Wisdom of Solomon</h1>
          <p className="text-gray-600 italic">"The fear of the LORD is the beginning of wisdom" - Proverbs 1:7</p>
        </div>
        <ChatComponent />
      </div>
    </main>
  );
}
