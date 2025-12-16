import { Audio, Sequence, staticFile } from "remotion";
import { QuizVideo } from "./QuizVideo";

type QuizItem = {
  durationInFrames: number;
  props: React.ComponentProps<typeof QuizVideo>;
};

const quizzes: QuizItem[] = [
  {
    durationInFrames: 300,
    props: {
      backgroundSrc:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
      question: "What has keys but can’t open any doors?",
      options: ["A map", "A piano", "A lock", "A keyboard"],
      correctIndex: 1,
      countdownSeconds: 6,
      voiceDurationSeconds: 6,
      segmentDurationInFrames: 300,
      accentColor: "#22c55e",
      textColor: "#ffffff",
      voiceoverSrc: "/voice-1.mp3",
      voiceoverOffsetSeconds: 0,
      backgroundMusicSrc: "",
      tickSrc: "/tick.mp3",
    },
  },
  {
    durationInFrames: 300,
    props: {
      backgroundSrc:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
      question: "What gets wetter the more it dries?",
      options: ["A sponge", "Water", "A cloud", "A towel"],
      correctIndex: 3,
      countdownSeconds: 6,
      voiceDurationSeconds: 6,
      segmentDurationInFrames: 300,
      accentColor: "#22c55e",
      textColor: "#ffffff",
      voiceoverSrc: "/voice-2.mp3",
      voiceoverOffsetSeconds: 0,
      backgroundMusicSrc: "",
      tickSrc: "/tick.mp3",
    },
  },
  {
    durationInFrames: 300,
    props: {
      backgroundSrc:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
      question: "What has a head and a tail but no body?",
      options: ["A snake", "A comet", "A coin", "A bird"],
      correctIndex: 2,
      countdownSeconds: 6,
      voiceDurationSeconds: 6,
      segmentDurationInFrames: 300,
      accentColor: "#22c55e",
      textColor: "#ffffff",
      voiceoverSrc: "/voice-3.mp3",
      voiceoverOffsetSeconds: 0,
      backgroundMusicSrc: "",
      tickSrc: "/tick.mp3",
    },
  },
];

export const CombinedQuizzes: React.FC = () => {
  let from = 0;
  const totalDuration = quizzes.reduce(
    (sum, item) => sum + item.durationInFrames,
    0,
  );

  return (
    <>
      {quizzes.map((item, idx) => {
        const sequence = (
          <Sequence
            key={idx}
            from={from}
            durationInFrames={item.durationInFrames}
          >
            <QuizVideo {...item.props} />
          </Sequence>
        );
        from += item.durationInFrames;
        return sequence;
      })}
      <Audio
        src={staticFile("/bgm.mp3")}
        volume={0.5}
        endAt={totalDuration}
      />
    </>
  );
};

