import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Child safety system instruction for Buddy the Panda
const BUDDY_SYSTEM_INSTRUCTION = `You are Buddy the Panda, a cheerful, warm, and playful AI learning tutor for children aged 2 to 10 in the app "LITTLE GENIUS KIDS".
Rules:
1. Always keep responses short, gentle, very enthusiastic, and easy to understand (1 to 3 simple sentences).
2. Use friendly child emojis (🐼, ⭐, 🌈, 🍎, 🎈, 🚀).
3. If asked about letters, numbers, colors, animals, math, shapes, English, or Urdu words, explain happily with a fun example.
4. Support both English and simple Urdu/Roman Urdu words (e.g. "Cat is billi (بلی)!").
5. Strict child safety: NEVER ask for names, ages, locations, phone numbers, emails, passwords, or personal data. Never discuss violence, weapons, politics, frightening topics, or adult themes.
6. Always end with gentle encouragement like "You are a Little Genius!" or "What shall we learn next?"`;

// API route for Buddy the Panda chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, childAge, language } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If Gemini API is available, generate response
    if (ai) {
      try {
        const langContext = language === 'urdu' ? 'The child prefers Urdu/Roman Urdu explanations.' : 'The child speaks English.';
        const ageContext = childAge ? `The child is in age group ${childAge}.` : 'The child is around 5 years old.';

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${langContext} ${ageContext} Child says: "${message}"`,
          config: {
            systemInstruction: BUDDY_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const replyText = response.text || "Hello little friend! You are doing amazing today! ⭐ What do you want to explore next? 🐼";
        return res.json({ reply: replyText, source: 'ai' });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local tutor responses:', geminiError?.message || geminiError);
      }
    }

    // Graceful offline/local educational fallback responses
    const lower = message.toLowerCase();
    let fallbackReply = "That's a wonderful question, Little Genius! 🌟 Let's explore together! What's your favorite animal or color? 🐼";

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      fallbackReply = "Hello there, Little Genius! 🐼 I'm Buddy the Panda! Are you ready to learn something super fun today? 🌈";
    } else if (lower.includes('math') || lower.includes('plus') || lower.includes('+') || lower.includes('count')) {
      fallbackReply = "Math is like a superpower! 🧮 If you have 2 red apples and I give you 3 more, you have 5 delicious apples! 🍎 Yummy!";
    } else if (lower.includes('urdu') || lower.includes('pakistan')) {
      fallbackReply = "Urdu is so sweet! 📚 Did you know that Apple is called 'Saib' (سیب) and Panda is called 'Panda' (پانڈا)? Bohat khoob! 🌟";
    } else if (lower.includes('animal') || lower.includes('lion') || lower.includes('cat') || lower.includes('dog')) {
      fallbackReply = "Animals are amazing friends! 🦁 Lions go ROAR, cats say meow, and pandas love munching on green bamboo! 🎋 What's your favorite animal?";
    } else if (lower.includes('abc') || lower.includes('letter') || lower.includes('alphabet')) {
      fallbackReply = "A is for Apple 🍎, B is for Ball ⚽, and P is for Panda 🐼! You are doing so well learning your ABCs!";
    } else if (lower.includes('color') || lower.includes('rainbow')) {
      fallbackReply = "Rainbows have seven beautiful colors: Red, Orange, Yellow, Green, Blue, Indigo, and Violet! 🌈 Which color is your favorite?";
    } else if (lower.includes('story') || lower.includes('bedtime')) {
      fallbackReply = "Once upon a time, a tiny star danced in the night sky and smiled down at the cleverest child on Earth — YOU! ⭐ Sweet dreams, little star!";
    } else if (lower.includes('riddle') || lower.includes('joke')) {
      fallbackReply = "Here is a fun riddle! 🎈 I have stripes like a tiger, but I look like a horse. Who am I? ... A Zebra! 🦓 Hehe!";
    }

    return res.json({ reply: fallbackReply, source: 'offline_tutor' });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      reply: "Buddy the Panda is taking a little nap! 🐼 Keep exploring our fun books and games! ⭐",
      source: 'offline_tutor',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🌈 Little Genius Kids server running on http://localhost:${PORT}`);
  });
}

startServer();
