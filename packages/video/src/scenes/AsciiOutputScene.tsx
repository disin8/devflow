import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FEATURES = [
  {
    title: "Git & Commits",
    desc: "Husky · lint-staged · commitlint",
    count: "7 modules",
    accent: "#22c55e",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill="#22c55e" />
        <path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Code Quality",
    desc: "ESLint · Prettier · Biome · TypeScript",
    count: "8 modules",
    accent: "#3b82f6",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polyline points="9,11 12,14 22,4" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Testing",
    desc: "Vitest · Playwright · Cypress · MSW",
    count: "6 modules",
    accent: "#8b5cf6",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "CI/CD",
    desc: "GitHub Actions · GitLab · Codecov",
    count: "5 modules",
    accent: "#f59e0b",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#f59e0b" strokeWidth="2" />
        <path d="M8 12l2.5 2.5L16 9" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Docker & DX",
    desc: "Dockerfile · devcontainer · VSCode",
    count: "8 modules",
    accent: "#06b6d4",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="8" width="18" height="12" rx="2" stroke="#06b6d4" strokeWidth="2" />
        <path d="M7 8V5a2 2 0 012-2h6a2 2 0 012 2v3" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Release & Security",
    desc: "Changesets · Semantic Release · Gitleaks",
    count: "8 modules",
    accent: "#f43f5e",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

const FeatureCard: React.FC<{
  feature: (typeof FEATURES)[number];
  delay: number;
  frame: number;
  fps: number;
}> = ({ feature, delay, frame, fps }) => {
  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const cardY = interpolate(cardSpring, [0, 1], [36, 0]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardBlur = interpolate(cardSpring, [0, 1], [12, 0]);

  return (
    <div
      style={{
        transform: `translateY(${cardY}px)`,
        opacity: cardOpacity,
        filter: `blur(${cardBlur}px)`,
        flex: 1,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderTop: `2px solid ${feature.accent}`,
        borderRadius: 14,
        padding: "22px 22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div>{feature.icon}</div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#f8fafc",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.01em",
          marginTop: 2,
        }}
      >
        {feature.title}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.5,
        }}
      >
        {feature.desc}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          fontWeight: 600,
          color: feature.accent,
          fontFamily: "'SF Mono','Roboto Mono',monospace",
          letterSpacing: "0.04em",
        }}
      >
        {feature.count}
      </div>
    </div>
  );
};

export const AsciiOutputScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingOpacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headingY = interpolate(frame, [0, 22], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subOpacity = interpolate(frame, [14, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const CARD_DELAYS = [10, 18, 26, 34, 42, 50];

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 110% 90% at 50% 40%, #0c3328 0%, #0b1a1d 65%)",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 60px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1100 }}>
        <div
          style={{
            opacity: headingOpacity,
            transform: `translateY(${headingY}px)`,
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "'Archivo', 'Inter', '-apple-system', sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            40+ Modules.{" "}
            <span style={{ color: "#22c55e" }}>10 Categories.</span>
          </div>
          <div
            style={{
              opacity: subOpacity,
              marginTop: 8,
              fontSize: 16,
              color: "rgba(255,255,255,0.38)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Pick exactly what you need — or run a preset
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
          {FEATURES.slice(0, 3).map((f, i) => (
            <FeatureCard
              key={f.title}
              feature={f}
              delay={CARD_DELAYS[i]}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {FEATURES.slice(3).map((f, i) => (
            <FeatureCard
              key={f.title}
              feature={f}
              delay={CARD_DELAYS[i + 3]}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
