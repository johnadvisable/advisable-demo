import { useState, useEffect, useMemo } from "react";

interface SpaceIntroAnimationProps {
  onComplete: () => void;
}

const SpaceIntroAnimation = ({ onComplete }: SpaceIntroAnimationProps) => {
  const [phase, setPhase] = useState<"warp" | "text" | "fadeout" | "done">("warp");

  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: 40 + (Math.random() - 0.5) * 80,
      y: 40 + (Math.random() - 0.5) * 80,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1.5,
    }));
  }, []);

  const streaks = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const angle = (i / 30) * 360;
      const dist = 8 + Math.random() * 15;
      return {
        id: i,
        x: 50 + Math.cos((angle * Math.PI) / 180) * dist,
        y: 50 + Math.sin((angle * Math.PI) / 180) * dist,
        angle,
        height: 20 + Math.random() * 40,
        delay: Math.random() * 1.2,
      };
    });
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("fadeout"), 3200);
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "radial-gradient(ellipse at center, #0a0e27 0%, #000000 70%)" }}
    >
      {/* Starfield */}
      <div className="absolute inset-0" style={{ perspective: "600px", perspectiveOrigin: "50% 50%" }}>
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0.9), rgba(180,200,255,0.2))`,
              animation: `starWarp ${star.duration}s ${star.delay}s ease-in forwards`,
              boxShadow: `0 0 ${star.size * 2}px rgba(150,180,255,0.4)`,
              opacity: 0,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          />
        ))}
      </div>

      {/* Speed lines */}
      <div className="absolute inset-0">
        {streaks.map((s) => (
          <div
            key={`streak-${s.id}`}
            className="absolute"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: "1px",
              height: `${s.height}px`,
              background: `linear-gradient(to bottom, transparent, rgba(180,210,255,0.6), transparent)`,
              transform: `rotate(${s.angle}deg)`,
              animation: `streakWarp 2s ${s.delay}s ease-in forwards`,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* Central glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(100,140,255,0.12) 0%, transparent 70%)",
          animation: "centralPulse 2s ease-in-out infinite",
        }}
      />

      {/* Text */}
      <div
        className={`relative z-10 text-center px-6 transition-all duration-1000 ${
          phase === "text" || phase === "fadeout"
            ? "opacity-100 transform scale-100"
            : "opacity-0 transform scale-90"
        }`}
      >
        <p
          className="text-lg sm:text-xl tracking-[0.3em] uppercase mb-4 font-light"
          style={{
            color: "rgba(150,180,255,0.8)",
            textShadow: "0 0 20px rgba(100,150,255,0.5)",
          }}
        >
          Advisable
        </p>
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #c8d8ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 30px rgba(100,150,255,0.3))",
          }}
        >
          Are you ready to
          <br />
          start your journey?
        </h1>
        <div
          className="mt-6 mx-auto h-[2px] rounded-full"
          style={{
            width: "120px",
            background: "linear-gradient(90deg, transparent, rgba(150,180,255,0.8), transparent)",
            animation: "linePulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes starWarp {
          0% {
            transform: translateZ(0px) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateZ(600px) scale(3);
            opacity: 0;
          }
        }
        @keyframes streakWarp {
          0% {
            opacity: 0;
            transform: rotate(var(--angle)) scaleY(0.3);
          }
          30% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: rotate(var(--angle)) scaleY(2.5);
          }
        }
        @keyframes centralPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        @keyframes linePulse {
          0%, 100% { opacity: 0.4; width: 80px; }
          50% { opacity: 1; width: 160px; }
        }
      `}</style>
    </div>
  );
};

export default SpaceIntroAnimation;
