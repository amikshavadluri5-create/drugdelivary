import { useState } from "react";
import { drugs, diseases, runSimulation } from "@/data/diseases";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

export function DrugComparison() {
  const [diseaseId, setDiseaseId] = useState(diseases[0].id);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([drugs[0].id, drugs[1].id]);
  const disease = diseases.find(d => d.id === diseaseId)!;
  const protein = disease.targetProteins[0];

  const toggle = (id: string) => {
    setSelectedDrugs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const results = selectedDrugs.map(dId => {
    const drug = drugs.find(d => d.id === dId)!;
    const sim = runSimulation(diseaseId, protein, dId);
    return { name: drug.name, ...sim };
  });

  const barData = results.map(r => ({ name: r.name, Efficacy: r.efficacy, Stability: r.stability, Bioavailability: r.bioavailability }));
  const radarData = [
    { metric: "Efficacy", ...Object.fromEntries(results.map(r => [r.name, r.efficacy])) },
    { metric: "Stability", ...Object.fromEntries(results.map(r => [r.name, r.stability])) },
    { metric: "Drug-Likeness", ...Object.fromEntries(results.map(r => [r.name, r.drugLikeness * 100])) },
    { metric: "Bioavail.", ...Object.fromEntries(results.map(r => [r.name, r.bioavailability])) },
  ];

  const colors = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-6">
      <div className="gradient-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Drug Comparison Tool
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Disease</label>
            <select value={diseaseId} onChange={e => setDiseaseId(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground">
              {diseases.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Select Drugs (up to 4)</label>
            <div className="flex flex-wrap gap-2">
              {drugs.map(d => (
                <button
                  key={d.id}
                  onClick={() => toggle(d.id)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    selectedDrugs.includes(d.id) ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="Efficacy" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Stability" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Bioavailability" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Radar Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222 30% 18%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              {results.map((r, i) => (
                <Radar key={r.name} name={r.name} dataKey={r.name} stroke={colors[i]} fill={colors[i]} fillOpacity={0.15} />
              ))}
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results table */}
      <div className="gradient-card rounded-xl p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-foreground mb-4">Detailed Results</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs border-b border-border">
              <th className="text-left py-2">Drug</th>
              <th className="text-center py-2">Efficacy</th>
              <th className="text-center py-2">Likeness</th>
              <th className="text-center py-2">Toxicity</th>
              <th className="text-center py-2">Stability</th>
              <th className="text-center py-2">Half-life</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.name} className="border-b border-border/50">
                <td className="py-2.5 text-foreground font-medium">{r.name}</td>
                <td className="text-center text-primary font-bold">{r.efficacy}%</td>
                <td className="text-center text-secondary font-bold">{r.drugLikeness}</td>
                <td className={`text-center font-bold ${r.toxicity === "Low" ? "text-accent" : r.toxicity === "Medium" ? "text-yellow-400" : "text-destructive"}`}>{r.toxicity}</td>
                <td className="text-center text-accent font-bold">{r.stability}%</td>
                <td className="text-center text-muted-foreground">{r.halfLife}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
