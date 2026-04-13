import { Activity, FlaskConical, Database, Brain } from "lucide-react";
import { diseases, drugs } from "@/data/diseases";

const stats = [
  { label: "Total Diseases", value: diseases.length.toString(), icon: Database, gradient: "gradient-primary" },
  { label: "Drug Molecules", value: drugs.length.toString(), icon: FlaskConical, gradient: "gradient-accent" },
  { label: "AI Models Active", value: "3", icon: Brain, gradient: "gradient-warm" },
  { label: "Simulations Run", value: "1,247", icon: Activity, gradient: "gradient-primary" },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="gradient-card rounded-xl p-4 glow-primary hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${s.gradient} flex items-center justify-center`}>
              <s.icon className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
