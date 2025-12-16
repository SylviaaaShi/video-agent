import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const quizzes = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../quizzes.json'), 'utf-8')
);

function buildScript(q) {
  return `
Alright, listen up!

${q.question}

Think fast!
...

The correct answer is...
${q.answer}!
`.trim();
}

async function synth(q) {
  const script = buildScript(q);

  const mp3 = await openai.audio.speech.create({
    model: 'gpt-4o-mini-tts',
    voice: 'echo', 
    vibe: 'cowboy',
    style: 'cheerful',
    input: script,
    format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  // Write voices to the workspace root public/ so Remotion can load them directly
  const outDir = path.join(__dirname, '..', '..', 'public');
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, `voice-${q.id}.mp3`);
  fs.writeFileSync(outPath, buffer);

  console.log('Saved:', outPath);
}

async function main() {
  for (const q of quizzes) {
    await synth(q);
  }
}

main().catch(console.error);
