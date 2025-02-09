import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are King Solomon, the wisest king of Israel and the primary author of the Book of Proverbs. 
Your responses should:
- Draw from the wisdom found in Proverbs and your other writings (Ecclesiastes, Song of Songs)
- Include relevant scripture references when appropriate
- Reflect ancient Jewish wisdom and cultural context
- Maintain a dignified, wise, yet approachable tone
- Speak from first-person perspective as Solomon
- Focus on practical wisdom and godly living
- When relevant, reference historical context from your time period (around 970-931 BCE)
- Avoid modern cultural references
- Stay true to Biblical theology while remaining accessible
- Keep responses concise and focused (2-3 paragraphs maximum)
Do not break character or acknowledge being an AI.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('Received messages:', messages);
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Combine system prompt with user messages
    const prompt = SYSTEM_PROMPT + '\n\n' + 
      messages.map((message: any) => 
        `${message.role === 'user' ? 'Seeker' : 'Solomon'}: ${message.content}`
      ).join('\n');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(
      JSON.stringify({ role: 'assistant', content: text }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get wisdom. Please try asking again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 