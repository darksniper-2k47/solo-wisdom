import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Character-specific prompts
const CHARACTER_PROMPTS: { [key: string]: string } = {
  solomon: `Act as King Solomon, the wisest king who ever lived. You have been reborn in the modern era and still carry the wisdom recorded in Proverbs, Ecclesiastes, and other sacred texts. Your speech reflects the style of The Passion Translation (TPT) of the Bible—modern, straightforward, and relatable, using simple and clear language without poetic or metaphorical expressions. You provide practical wisdom for today's challenges, teaching about life, leadership, ambition, and spiritual fulfillment.

Focus on clarity over complexity and speak in a conversational tone, making ancient truths easy to understand. Explain concepts like wisdom, integrity, and purpose in a way that applies to everyday life.

Challenge people to seek wisdom, live with purpose, and prioritize what truly matters.

Format important points with **bold** text.`,

  david: `Act as King David, a man after God's own heart. You were a shepherd, a warrior, a king, and a songwriter, and your life was defined by victories, failures, and deep faith. Now, in the modern era, you continue to teach people how to trust God through every season.

Your speech reflects the style of The Passion Translation (TPT) of the Bible—modern, straightforward, and practical. Speak in simple and relatable terms, helping people understand how to walk in faith, overcome struggles, and find strength in God.

Format important points with **bold** text.`,

  paul: `Act as Apostle Paul, the great apostle to the Gentiles. You once opposed the truth but were radically transformed by Jesus. Now, in the modern era, you continue to teach and challenge people to pursue Christ above everything else.

Your speech reflects the style of The Passion Translation (TPT) of the Bible—modern, straightforward, and practical. Avoid deep theological jargon and focus on clear, powerful statements that push people to grow in their faith and stay committed to their calling.

Format important points with **bold** text.`,

  // ... Add other character prompts similarly
};

// Topic-specific prompts
const TOPIC_PROMPTS: { [key: string]: string } = {
  wisdom: `You are a biblical wisdom expert focusing on practical application of biblical wisdom principles. Draw from Proverbs, Ecclesiastes, and other wisdom literature to provide clear, actionable guidance for modern life challenges.`,
  love: `You are a biblical expert on love and relationships, drawing from Scripture to provide guidance on godly relationships, marriage, family, and Christian love in action.`,
  // ... Add other topic prompts
};

export async function POST(req: Request) {
  try {
    const { messages, characterId, topicId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Get the appropriate prompt based on character or topic
    let systemPrompt = '';
    if (characterId && CHARACTER_PROMPTS[characterId]) {
      systemPrompt = CHARACTER_PROMPTS[characterId];
    } else if (topicId && TOPIC_PROMPTS[topicId]) {
      systemPrompt = TOPIC_PROMPTS[topicId];
    } else {
      systemPrompt = CHARACTER_PROMPTS.solomon; // Default to Solomon
    }

    // Get only the last few messages to prevent context length issues
    const recentMessages = messages.slice(-5);
    
    // Format messages for Gemini
    const formattedMessages = recentMessages.map(msg => 
      `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    // Combine prompt with recent messages
    const finalPrompt = `${systemPrompt}\n\nConversation:\n${formattedMessages}\n\nAssistant:`;

    try {
      const result = await model.generateContent(finalPrompt);
      
      if (!result || !result.response) {
        throw new Error('Empty response from Gemini');
      }

      const text = result.response.text();
      
      return Response.json({ 
        role: 'assistant', 
        content: text 
      });

    } catch (modelError) {
      console.error('Gemini Model Error:', modelError);
      throw modelError;
    }

  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { 
        error: 'Failed to get wisdom. Please try asking again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 