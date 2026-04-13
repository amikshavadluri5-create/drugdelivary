import { Brain, Globe } from "lucide-react";

interface Props {
  lang: "en" | "es" | "hi";
  setLang: (l: "en" | "es" | "hi") => void;
}

export function DashboardHeader({ lang, setLang }: Props) {
  return (
    <header className="border-b border-border glass sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">DrugAI Platform</h1>
            <p className="text-xs text-muted-foreground">Drug Delivery & Disease Detection</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-xs font-medium text-accent">AI Online</span>
          </div>
          <select
            value={lang}
            onChange={e => setLang(e.target.value as any)}
            className="text-xs bg-muted border border-border rounded-md px-2 py-1.5 text-foreground"
          >
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="hi">🇮🇳 HI</option>
          </select>
        </div>
      </div>
    </header>
  );
}
