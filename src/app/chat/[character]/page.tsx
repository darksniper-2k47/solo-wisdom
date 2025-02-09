'use client';

import { useTheme } from '../../contexts/ThemeContext';
import ChatComponent from '../../components/ChatComponent';
import Layout from '../../components/Layout';
import { useParams, useSearchParams } from 'next/navigation';

export default function CharacterChat() {
  const { character } = useParams();
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chat');
  const { theme } = useTheme();

  return (
    <Layout>
      <ChatComponent 
        characterId={character as string} 
        chatId={chatId || undefined}
      />
    </Layout>
  );
} 