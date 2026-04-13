import { useState } from "react";
import { diseases, drugs, runSimulation, type SimulationResult } from "@/data/diseases";
import { FlaskConical, Zap, Shield, Activity, Clock, Pill, TrendingUp, AlertTriangle, Atom } from "lucide-react";

export function SimulationTab() {
  const [diseaseId, setDiseaseId] = useState("");
  const [protein, setProtein] = useState("");
  const [drugId, setDrugId] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedDisease = diseases.find(d => d.id === diseaseId);
  const selectedDrug = drugs.find(d => d.id === drugId);

  const handleRun = () => {
    if (!diseaseId || !protein || !drugId) return;
    setLoading(true);
    setTimeout(() => {
      setResult(runSimulation(diseaseId, protein, drugId));
      setLoading(false);
    }, 1500);
  };

  const toxColor = (t: string) => t === "Low" ? "text-accent" : t === "Medium" ? "text-yellow-400" : "text-destructive";

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="gradient-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-primary" />
          Drug Delivery Simulation
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Select Disease</label>
            <select
              value={diseaseId}
              onChange={e => { setDiseaseId(e.target.value); setProtein(""); }}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground"
            >
              <option value="">Choose a disease...</option>
              <optgroup label="Common Diseases">
                {diseases.filter(d => d.type === "common").map(d => (
                  <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                ))}
              </optgroup>
              <optgroup label="Rare Diseases">
                {diseases.filter(d => d.type === "rare").map(d => (
                  <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {selectedDisease && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-2">{selectedDisease.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedDisease.symptoms.map(s => (
                  <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Target Protein</label>
            <select
              value={protein}
              onChange={e => setProtein(e.target.value)}
              disabled={!selectedDisease}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground disabled:opacity-50"
            >
              <option value="">Choose target protein...</option>
              {selectedDisease?.targetProteins.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Drug Molecule</label>
            <select
              value={drugId}
              onChange={e => setDrugId(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-sm text-foreground"
            >
              <option value="">Choose a drug...</option>
              {drugs.map(d => (
                <option key={d.id} value={d.id}>{d.name} — {d.formula}</option>
              ))}
            </select>
          </div>

          {selectedDrug && (
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <p>{selectedDrug.description}</p>
              <p className="mt-1 font-mono">MW: {selectedDrug.molecularWeight} | SMILES: {selectedDrug.smiles.slice(0, 40)}...</p>
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={!diseaseId || !protein || !drugId || loading}
            className="w-full gradient-primary text-primary-foreground py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Running AI Simulation...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Simulation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="gradient-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Simulation Results
        </h2>

        {!result ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <FlaskConical className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm">Configure parameters and run simulation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Efficacy */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Predicted Efficacy</span>
                <span className="text-xl font-bold text-primary">{result.efficacy}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="h-3 rounded-full gradient-primary transition-all duration-1000" style={{ width: `${result.efficacy}%` }} />
              </div>
            </div>

            {/* Drug-Likeness */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Pill className="w-4 h-4" /> Drug-Likeness Score</span>
                <span className="text-xl font-bold text-secondary">{result.drugLikeness}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="h-3 rounded-full bg-secondary transition-all duration-1000" style={{ width: `${result.drugLikeness * 100}%` }} />
              </div>
            </div>

            {/* Stability */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Shield className="w-4 h-4" /> Stability</span>
                <span className="text-xl font-bold text-accent">{result.stability}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="h-3 rounded-full gradient-accent transition-all duration-1000" style={{ width: `${result.stability}%` }} />
              </div>
            </div>

            {/* Quantum Score */}
            <div className="bg-muted/50 rounded-lg p-4 border border-secondary/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Atom className="w-4 h-4" /> Quantum Score</span>
                <span className="text-xl font-bold text-secondary">{result.quantumScore}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="h-3 rounded-full bg-secondary transition-all duration-1000" style={{ width: `${result.quantumScore}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">Quantum molecular interaction probability (target: 70–80)</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <AlertTriangle className={`w-5 h-5 mx-auto mb-1 ${toxColor(result.toxicity)}`} />
                <p className="text-xs text-muted-foreground">Toxicity</p>
                <p className={`text-sm font-bold ${toxColor(result.toxicity)}`}>{result.toxicity}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Activity className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Bioavail.</p>
                <p className="text-sm font-bold text-foreground">{result.bioavailability}%</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <p className="text-xs text-muted-foreground">Half-life</p>
                <p className="text-sm font-bold text-foreground">{result.halfLife}</p>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
              <p className="text-xs font-medium text-primary mb-1">💡 AI Suggestion</p>
              <p className="text-xs text-muted-foreground">
                {result.efficacy > 70
                  ? "This drug shows strong compatibility. Consider clinical trials with adjusted dosage for optimal bioavailability."
                  : result.efficacy > 45
                  ? "Moderate efficacy detected. Combining with a secondary agent may improve results. Review target protein affinity."
                  : "Low efficacy predicted. Consider alternative drug molecules or different target proteins for this disease."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
