import { useState, useCallback } from "react";
import { Camera, Upload, Search, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { detectDiseaseFromImage } from "@/data/diseases";

export function DiseaseDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ disease: string; confidence: number; suggestions: string[] } | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }, [handleFile]);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    const res = await detectDiseaseFromImage(file);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Upload */}
      <div className="gradient-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          Upload Photo for Detection
        </h2>
        <p className="text-xs text-muted-foreground mb-4">📸 Take a photo or upload an image. Our AI will check for possible diseases.</p>

        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => document.getElementById("img-upload")?.click()}
        >
          {preview ? (
            <img src={preview} alt="Upload preview" className="max-h-48 mx-auto rounded-lg object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Click or drag image here</p>
              <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
            </div>
          )}
          <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        <button
          onClick={analyze}
          disabled={!file || loading}
          className="w-full mt-4 gradient-primary text-primary-foreground py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing Image...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              🔍 Detect Disease
            </>
          )}
        </button>
      </div>

      {/* Result */}
      <div className="gradient-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-accent" />
          Detection Result
        </h2>

        {!result ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Camera className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm">Upload a photo to see results</p>
            <p className="text-xs mt-1">🖼️ Simple and easy — just upload!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Detected Condition</p>
              <p className="text-2xl font-bold text-foreground">{result.disease}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Confidence Level</span>
                <span className="text-lg font-bold text-primary">{result.confidence}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${result.confidence > 75 ? "gradient-accent" : "gradient-warm"}`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                What to do next:
              </p>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-3">
              <p className="text-xs text-yellow-400">⚠️ This is an AI prediction. Please visit a doctor for proper diagnosis.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
