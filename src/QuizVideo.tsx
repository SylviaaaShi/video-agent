import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const quizSchema = z.object({
  backgroundSrc: z.string(),
  question: z.string(),
  options: z.array(z.string()).min(2).max(6),
  correctIndex: z.number().int().nonnegative(),
  countdownSeconds: z.number().int().min(1).max(120),
  voiceDurationSeconds: z.number().min(0.1).max(600).optional(),
  segmentDurationInFrames: z.number().int().positive().optional(),
  accentColor: zColor(),
  textColor: zColor(),
  voiceoverSrc: z.string().optional(),
  voiceoverOffsetSeconds: z.number().min(0).optional(),
  backgroundMusicSrc: z.string().optional(),
  tickSrc: z.string().optional(),
});

type QuizProps = z.infer<typeof quizSchema>;

export const QuizVideo: React.FC<QuizProps> = ({
  backgroundSrc,
  question,
  options,
  correctIndex,
  countdownSeconds,
  voiceDurationSeconds,
  segmentDurationInFrames,
  accentColor,
  textColor,
  voiceoverSrc,
  voiceoverOffsetSeconds,
  backgroundMusicSrc,
  tickSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const effectiveDuration = segmentDurationInFrames ?? durationInFrames;

  const voiceDuration = voiceDurationSeconds ?? countdownSeconds;
  const revealSeconds = Math.max(countdownSeconds, voiceDuration + (voiceoverOffsetSeconds ?? 0));
  const revealFrame = Math.max(
    0,
    Math.min(Math.round(revealSeconds * fps), effectiveDuration - 1),
  );
  const remainingSeconds = Math.max(
    0,
    Math.ceil((revealFrame - frame) / fps),
  );

  const reveal = frame >= revealFrame;
  const safeCorrectIndex = Math.min(
    options.length - 1,
    Math.max(0, correctIndex),
  );

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resolveSrc = (src?: string) => {
    if (!src) return undefined;
    if (src.startsWith("http")) return src;
    return staticFile(src.startsWith("/") ? src : `/${src}`);
  };

  const resolvedTick = resolveSrc(tickSrc);
  const resolvedVoice = resolveSrc(voiceoverSrc);
  const resolvedMusic = resolveSrc(backgroundMusicSrc);

  const voiceoverOffsetFrames = Math.max(
    0,
    Math.round((voiceoverOffsetSeconds ?? 0) * fps),
  );

  // Play tick once per second during the countdown window
  const totalTicks = Math.min(
    countdownSeconds,
    Math.max(1, Math.ceil(revealFrame / fps)),
  );

  const tickElements =
    resolvedTick && totalTicks > 0
      ? Array.from({ length: totalTicks }, (_, i) => (
          <Sequence
            key={i}
            from={i * fps}
            durationInFrames={fps}
          >
            <Audio src={resolvedTick} volume={0.9} />
          </Sequence>
        ))
      : null;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Img
        src={backgroundSrc}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          filter: "brightness(0.6)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.35), transparent 30%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.25), transparent 35%), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.35), transparent 40%)",
        }}
      />

      <AbsoluteFill
        style={{
          color: textColor,
          padding: "350px 120px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: fadeIn,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 32,
          }}
        >
          <div style={{ maxWidth: "75%" }}>
            <div
              style={{
                fontSize: 68,
                fontWeight: 800,
                lineHeight: 1.15,
                textShadow: "0 12px 30px rgba(0,0,0,0.35)",
                letterSpacing: "-0.02em",
              }}
            >
              {question}
            </div>
          </div>

          <div
            style={{
              minWidth: 140,
              height: 140,
              borderRadius: 999,
              backgroundColor: "rgba(0,0,0,0.35)",
              border: `6px solid ${accentColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
              }}
            >
              {remainingSeconds}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 14,
                fontSize: 14,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              Sec
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {options.map((option, idx) => {
            const optionAppear = interpolate(
              frame,
              [10 + idx * 6, 20 + idx * 6],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            const isCorrect = idx === safeCorrectIndex;
            const isRevealedCorrect = reveal && isCorrect;
            const backgroundColor = isRevealedCorrect
              ? accentColor
              : "rgba(255, 255, 255, 0.08)";
            const textOpacity = interpolate(
              frame,
              [0, 10 + idx * 3],
              [0.3, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            return (
              <div
                key={idx}
                style={{
                  opacity: optionAppear,
                  backgroundColor,
                  borderRadius: 16,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isRevealedCorrect
                    ? `0 12px 35px ${accentColor}33`
                    : "0 12px 28px rgba(0,0,0,0.35)",
                  transition: "background-color 0.6s ease, box-shadow 0.6s ease",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: `2px solid ${isRevealedCorrect ? "transparent" : "rgba(255,255,255,0.4)"}`,
                    backgroundColor: isRevealedCorrect ? "rgba(0,0,0,0.15)" : "transparent",
                    color: isRevealedCorrect ? "#0f172a" : textColor,
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    boxShadow: isRevealedCorrect
                      ? "inset 0 0 0 2px rgba(0,0,0,0.25)"
                      : "none",
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div
                  style={{
                    fontSize: 60,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    opacity: textOpacity,
                  }}
                >
                  {option}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            marginTop: 32,
            color: reveal ? textColor : "rgba(255,255,255,0.55)",
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: reveal ? accentColor : "rgba(255,255,255,0.35)",
                boxShadow: reveal
                  ? `0 0 0 6px ${accentColor}22`
                  : "none",
              }}
            />
            Correct Answer
          </div>

          {reveal ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              <span
                style={{
                  padding: "8px 14px",
                  borderRadius: 12,
                  backgroundColor: accentColor,
                  color: "#0f172a",
                }}
              >
                {String.fromCharCode(65 + safeCorrectIndex)}
              </span>
              <span>{options[safeCorrectIndex]}</span>
            </div>
          ) : (
            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                opacity: 0.75,
              }}
            >
              Reveals automatically after the countdown
            </div>
          )}
        </div>
      </AbsoluteFill>

      {resolvedMusic ? <Audio src={resolvedMusic} volume={0.6} /> : null}
      {tickElements}
      {resolvedVoice ? (
        <Audio src={resolvedVoice} startFrom={voiceoverOffsetFrames} />
      ) : null}
    </AbsoluteFill>
  );
};

