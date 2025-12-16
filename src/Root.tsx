import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { QuizVideo, quizSchema } from "./QuizVideo";
import { CombinedQuizzes } from "./CombinedQuizzes";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />

      <Composition
        id="QuizVideo"
        component={QuizVideo}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        schema={quizSchema}
        defaultProps={{
          backgroundSrc:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
          question: "What has keys but can’t open any doors?",
          options: ["A map", "A piano", "A lock", "A keyboard"],
          correctIndex: 1, // Answer B
          countdownSeconds: 6,
          voiceDurationSeconds: 6,
          segmentDurationInFrames: 210,
          accentColor: "#22c55e",
          textColor: "#ffffff",
          voiceoverSrc: "/voice-1.mp3",
          voiceoverOffsetSeconds: 0,
          backgroundMusicSrc: "",
          tickSrc: "/tick.mp3",
        }}
      />

      <Composition
        id="Quiz1"
        component={QuizVideo}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        schema={quizSchema}
        defaultProps={{
          backgroundSrc:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
          question: "What has keys but can’t open any doors?",
          options: ["A map", "A piano", "A lock", "A keyboard"],
          correctIndex: 1,
          countdownSeconds: 6,
          voiceDurationSeconds: 6,
          segmentDurationInFrames: 210,
          accentColor: "#22c55e",
          textColor: "#ffffff",
          voiceoverSrc: "/voice-1.mp3",
          voiceoverOffsetSeconds: 0,
          backgroundMusicSrc: "",
          tickSrc: "/tick.mp3",
        }}
      />

      <Composition
        id="Quiz2"
        component={QuizVideo}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        schema={quizSchema}
        defaultProps={{
          backgroundSrc:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
          question: "What gets wetter the more it dries?",
          options: ["A sponge", "Water", "A cloud", "A towel"],
          correctIndex: 3,
          countdownSeconds: 6,
          voiceDurationSeconds: 6,
          segmentDurationInFrames: 210,
          accentColor: "#22c55e",
          textColor: "#ffffff",
          voiceoverSrc: "/voice-2.mp3",
          voiceoverOffsetSeconds: 0,
          backgroundMusicSrc: "",
          tickSrc: "/tick.mp3",
        }}
      />

      <Composition
        id="Quiz3"
        component={QuizVideo}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        schema={quizSchema}
        defaultProps={{
          backgroundSrc:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
          question: "What has a head and a tail but no body?",
          options: ["A snake", "A comet", "A coin", "A bird"],
          correctIndex: 2,
          countdownSeconds: 6,
          voiceDurationSeconds: 6,
          segmentDurationInFrames: 210,
          accentColor: "#22c55e",
          textColor: "#ffffff",
          voiceoverSrc: "/voice-3.mp3",
          voiceoverOffsetSeconds: 0,
          backgroundMusicSrc: "",
          tickSrc: "/tick.mp3",
        }}
      />

      <Composition
        id="QuizAll"
        component={CombinedQuizzes}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
