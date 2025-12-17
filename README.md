# Video Agent - Automated Quiz Video Generator

A Remotion-based automated video generation project that supports generating Quiz videos using OpenAI text-to-speech functionality.

## Project Structure

```
video-auto/
├── agent/
│   ├── scripts/
│   │   └── gen-voices.mjs    # OpenAI text-to-speech script
│   └── quizzes.json          # Quiz question data
├── public/                   # Generated voice files and resources
│   ├── voice-1.mp3
│   ├── voice-2.mp3
│   └── voice-3.mp3
└── src/
    ├── QuizVideo.tsx         # Quiz video component
    └── Root.tsx              # Remotion root configuration
```

## Installation

```bash
# Install main project dependencies
npm i

# Install dependencies in agent directory (for voice generation)
cd agent
npm i
cd ..
```

## Basic Commands

**Start Preview**

```bash
npm run dev
```

**Render Video**

```bash
npx remotion render
```

## Using OpenAI Text-to-Speech

### 1. Configure API Key

Create a `.env` file in the project root directory (or in the `agent/` directory) and add your OpenAI API Key:

```env
OPENAI_API_KEY=your_api_key_here
```

### 2. Run Voice Generation Script

```bash
cd agent
node scripts/gen-voices.mjs
```

The script will:
- Read question data from `agent/quizzes.json`
- Generate voice scripts for each question (including question, countdown prompts, and answer)
- Use OpenAI TTS API to generate MP3 voice files
- Save generated voice files to the `public/` directory, named as `voice-{id}.mp3`

### 3. Voice Generation Configuration

You can modify voice parameters in `agent/scripts/gen-voices.mjs`:

```javascript
const mp3 = await openai.audio.speech.create({
  model: 'gpt-4o-mini-tts',  // Model
  voice: 'echo',              // Voice: alloy, echo, fable, onyx, nova, shimmer
  vibe: 'cowboy',            // Style
  style: 'cheerful',         // Tone
  input: script,             // Text to convert
  format: 'mp3',             // Output format
});
```

### 4. Customize Voice Script

In the `buildScript` function in `gen-voices.mjs`, you can customize the voice script format:

```javascript
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
```

## Changing Quiz for Video

### Method 1: Modify quizzes.json (Recommended)

1. **Edit Question Data**

   Edit the `agent/quizzes.json` file to add or modify questions:

```json
[
  {
    "id": 1,
    "question": "Your question",
    "options": {
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    },
    "answer": "B"
  }
]
```

2. **Regenerate Voice Files**

```bash
cd agent
node scripts/gen-voices.mjs
```

3. **Add New Composition in Root.tsx**

   Edit `src/Root.tsx` to add a new Quiz Composition:

```typescript
<Composition
  id="Quiz4"
  component={QuizVideo}
  durationInFrames={210}
  fps={30}
  width={1080}
  height={1920}
  schema={quizSchema}
  defaultProps={{
    backgroundSrc: "Your background image URL",
    question: "Your question",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 1,  // Index of correct answer (0=A, 1=B, 2=C, 3=D)
    countdownSeconds: 6,
    voiceDurationSeconds: 6,
    segmentDurationInFrames: 210,
    accentColor: "#22c55e",
    textColor: "#ffffff",
    voiceoverSrc: "/voice-4.mp3",  // Corresponds to id in quizzes.json
    voiceoverOffsetSeconds: 0,
    backgroundMusicSrc: "/bgm.mp3",
    tickSrc: "/tick.mp3",
  }}
/>
```

### Method 2: Directly Modify Root.tsx

If you want to quickly test, you can directly modify the `defaultProps` of an existing Quiz in `src/Root.tsx`:

```typescript
<Composition
  id="Quiz1"
  component={QuizVideo}
  // ... other configurations
  defaultProps={{
    question: "New question",
    options: ["New Option A", "New Option B", "New Option C", "New Option D"],
    correctIndex: 0,  // Modify correct answer index
    voiceoverSrc: "/voice-1.mp3",  // Ensure voice file exists
    // ... other configurations
  }}
/>
```

### Configuration Parameters

- `backgroundSrc`: Background image URL (supports web images or local files)
- `question`: Question text
- `options`: Array of options
- `correctIndex`: Index of correct answer (0-based)
- `countdownSeconds`: Countdown duration in seconds
- `voiceDurationSeconds`: Voice duration in seconds
- `accentColor`: Accent color (highlight color for correct answer)
- `textColor`: Text color
- `voiceoverSrc`: Voice file path (relative to `public/` directory)
- `backgroundMusicSrc`: Background music file path (optional)
- `tickSrc`: Countdown tick sound file path (optional)

## Rendering Combined Video with Multiple Quizzes

The project is already configured with a `QuizAll` Composition that automatically combines all Quizzes. You can view and modify the combination logic in `src/CombinedQuizzes.tsx`.

```bash
# Render combined video
npx remotion render QuizAll out/video.mp4
```

## Notes

1. **API Key Security**: Do not commit the `.env` file to Git repository
2. **Voice Files**: Ensure generated voice files are in the `public/` directory with filename format `voice-{id}.mp3`
3. **Question ID**: The `id` in `quizzes.json` should correspond to the generated voice filename
4. **Correct Answer Index**: `correctIndex` is 0-based (0=A, 1=B, 2=C, 3=D)

## Documentation

- [Remotion Documentation](https://www.remotion.dev/docs/the-fundamentals)
- [OpenAI TTS API Documentation](https://platform.openai.com/docs/guides/text-to-speech)

# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.gif">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

