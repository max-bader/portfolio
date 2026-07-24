export const projectsData = [
  {
    id: 1,
    title: "TradeStreet - AI Synthetic Market",
    description: "Real-time synthetic stock market simulation with AI-generated news and sentiment-driven price movements.",
    bullets: [
      "Integrated the Claude API to generate live financial news that drives sentiment-based price action",
      "Built custom React hooks for market state and cut render cycles by 80% with memoization",
      "Live candlestick charts, portfolio tracking, and Web3 wallet integration"
    ],
    image: "trade.png",
    technologies: ["React", "TypeScript", "Vite", "Claude API", "lightweight-charts", "wagmi", "Tailwind CSS"],
    githubUrl: "https://github.com/tobinsia123/TradeStreet",
    liveUrl: "",
    featured: true
  },
  {
    id: 2,
    title: "AskHer",
    description: "Anonymous peer-support platform for navigating tough situations, with an AI companion for meaningful conversations.",
    bullets: [
      "React/TypeScript frontend with a FastAPI backend and Supabase for auth and storage",
      "Gemini-powered chatbot tuned for supportive, judgment-free conversations",
      "Anonymous-by-design: users get help without exposing their identity"
    ],
    image: "askher.png",
    technologies: ["React", "TypeScript", "FastAPI", "Supabase", "Gemini API"],
    githubUrl: "https://github.com/max-bader/AskHer",
    liveUrl: "",
    featured: true
  },
  {
    id: 3,
    title: "WakeUp",
    description: "AI alarm clock that learns your sleep patterns with reinforcement learning and adapts your wake-up time.",
    bullets: [
      "Q-learning agent: states encode recent snooze/wake behavior, actions shift the alarm ±5 minutes",
      "Reward system scores punctuality and penalizes snoozing, so recommendations improve every session",
      "Flask backend with sleep analytics, progress tracking, and a gamified points system"
    ],
    image: "wakeup.png",
    technologies: ["Python", "Flask", "Q-Learning", "Pandas", "NumPy", "JavaScript"],
    githubUrl: "https://github.com/max-bader/WakeUp",
    liveUrl: "",
    featured: false
  },
  {
    id: 4,
    title: "Zotify",
    description: "Full-stack music app built on the Spotify API — search any song and manage playlists.",
    bullets: [
      "Flask backend wrapping Spotify's OAuth flow and search/playlist endpoints",
      "React frontend for searching tracks and building playlists in real time"
    ],
    image: "zotify.png",
    technologies: ["React", "Flask", "Spotify API", "JavaScript"],
    githubUrl: "https://github.com/max-bader/Zotify",
    liveUrl: "",
    featured: false
  }
];
