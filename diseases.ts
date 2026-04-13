import { useState } from "react";
import { Activity, FlaskConical, Brain, Camera, MessageSquare, BarChart3, FileText, Globe } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { SimulationTab } from "@/components/SimulationTab";
import { DiseaseDetection } from "@/components/DiseaseDetection";
import { MoleculeViewer } from "@/components/MoleculeViewer";
import { DrugComparison } from "@/components/DrugComparison";
import { ChatbotAssistant } from "@/components/ChatbotAssistant";

const tabs = [
  { id: "simulation", label: "Simulation", icon: FlaskConical },
  { id: "detection", label: "Disease Detection", icon: Camera },
  { id: "molecule", label: "3D Molecule", icon: Activity },
  { id: "compare", label: "Compare Drugs", icon: BarChart3 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("simulation");
  const [chatOpen, setChatOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "es" | "hi">("en");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader lang={lang} setLang={setLang} />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <StatsCards />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-8 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "gradient-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === "simulation" && <SimulationTab />}
          {activeTab === "detection" && <DiseaseDetection />}
          {activeTab === "molecule" && <MoleculeViewer />}
          {activeTab === "compare" && <DrugComparison />}
        </div>
      </main>

      {/* Chatbot FAB */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6 text-primary-foreground" />
      </button>

      {chatOpen && <ChatbotAssistant onClose={() => setChatOpen(false)} />}
    </div>
  );
};

export default Index;
