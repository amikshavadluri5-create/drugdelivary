@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@layer base {
  :root {
    --background: 222 47% 6%;
    --foreground: 210 40% 95%;
    --card: 222 47% 9%;
    --card-foreground: 210 40% 95%;
    --popover: 222 47% 9%;
    --popover-foreground: 210 40% 95%;
    --primary: 199 89% 48%;
    --primary-foreground: 222 47% 6%;
    --secondary: 260 60% 55%;
    --secondary-foreground: 210 40% 98%;
    --muted: 222 30% 14%;
    --muted-foreground: 215 20% 55%;
    --accent: 160 84% 39%;
    --accent-foreground: 222 47% 6%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 210 40% 98%;
    --border: 222 30% 18%;
    --input: 222 30% 18%;
    --ring: 199 89% 48%;
    --radius: 0.75rem;
    --sidebar-background: 222 47% 8%;
    --sidebar-foreground: 210 40% 95%;
    --sidebar-primary: 199 89% 48%;
    --sidebar-primary-foreground: 222 47% 6%;
    --sidebar-accent: 222 30% 14%;
    --sidebar-accent-foreground: 210 40% 95%;
    --sidebar-border: 222 30% 18%;
    --sidebar-ring: 199 89% 48%;

    --gradient-primary: linear-gradient(135deg, hsl(199, 89%, 48%), hsl(260, 60%, 55%));
    --gradient-accent: linear-gradient(135deg, hsl(160, 84%, 39%), hsl(199, 89%, 48%));
    --gradient-warm: linear-gradient(135deg, hsl(38, 92%, 50%), hsl(0, 72%, 51%));
    --gradient-card: linear-gradient(145deg, hsl(222, 47%, 11%), hsl(222, 47%, 8%));
    --shadow-glow: 0 0 30px -5px hsl(199 89% 48% / 0.2);
    --shadow-glow-accent: 0 0 30px -5px hsl(160 84% 39% / 0.2);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-family: 'Inter', sans-serif;
  }
}

@layer components {
  .gradient-card {
    background: var(--gradient-card);
    border: 1px solid hsl(var(--border));
  }
  .gradient-primary {
    background: var(--gradient-primary);
  }
  .gradient-accent {
    background: var(--gradient-accent);
  }
  .gradient-warm {
    background: var(--gradient-warm);
  }
  .glow-primary {
    box-shadow: var(--shadow-glow);
  }
  .glow-accent {
    box-shadow: var(--shadow-glow-accent);
  }
  .glass {
    background: hsl(var(--card) / 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid hsl(var(--border) / 0.5);
  }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
