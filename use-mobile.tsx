import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { drugs } from "@/data/diseases";
import { Activity } from "lucide-react";
import * as THREE from "three";

function Atom({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.05;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
    </mesh>
  );
}

function Bond({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const mid: [number, number, number] = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2];
  const dir = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  const len = dir.length();
  dir.normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return (
    <mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, len, 8]} />
      <meshStandardMaterial color="#4a90d9" roughness={0.5} metalness={0.4} />
    </mesh>
  );
}

// Generate a mock molecule structure
function generateMolecule(drugId: string) {
  const seed = drugId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pr = (n: number) => ((seed * 9301 + 49297 + n * 233) % 233280) / 233280;
  const atomCount = 6 + Math.floor(pr(1) * 8);
  const atoms: { pos: [number, number, number]; color: string }[] = [];
  const bonds: { start: number; end: number }[] = [];
  const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#06b6d4"];

  for (let i = 0; i < atomCount; i++) {
    const angle = (i / atomCount) * Math.PI * 2 + pr(i + 10) * 0.5;
    const r = 1 + pr(i + 20) * 1.2;
    const y = (pr(i + 30) - 0.5) * 1.5;
    atoms.push({ pos: [Math.cos(angle) * r, y, Math.sin(angle) * r], color: colors[i % colors.length] });
    if (i > 0) bonds.push({ start: i, end: i - 1 });
    if (i > 2 && pr(i + 40) > 0.6) bonds.push({ start: i, end: Math.floor(pr(i + 50) * (i - 1)) });
  }
  return { atoms, bonds };
}

function MoleculeScene({ drugId }: { drugId: string }) {
  const mol = generateMolecule(drugId);
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.elapsedTime * 0.3;
  });

  return (
    <group ref={groupRef}>
      {mol.atoms.map((a, i) => <Atom key={i} position={a.pos} color={a.color} size={0.25} />)}
      {mol.bonds.map((b, i) => <Bond key={i} start={mol.atoms[b.start].pos} end={mol.atoms[b.end].pos} />)}
    </group>
  );
}

export function MoleculeViewer() {
  const [selectedDrug, setSelectedDrug] = useState(drugs[3].id); // edaravone default
  const drug = drugs.find(d => d.id === selectedDrug)!;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 gradient-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          3D Molecular Visualization
        </h2>
        <div className="w-full h-[400px] bg-muted/30 rounded-xl overflow-hidden">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.3} color="#8b5cf6" />
            <MoleculeScene drugId={selectedDrug} />
            <OrbitControls enableZoom enablePan={false} />
          </Canvas>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">🖱️ Drag to rotate • Scroll to zoom</p>
      </div>

      <div className="gradient-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Select Molecule</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
          {drugs.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDrug(d.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                d.id === selectedDrug ? "bg-primary/20 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-foreground">Molecule Details</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground font-medium">{drug.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Formula</span><span className="text-foreground font-mono">{drug.formula}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Mol. Weight</span><span className="text-foreground">{drug.molecularWeight}</span></div>
            <div>
              <span className="text-muted-foreground">SMILES</span>
              <p className="text-foreground font-mono text-[10px] break-all mt-1 bg-muted/50 p-2 rounded">{drug.smiles}</p>
            </div>
            <p className="text-muted-foreground mt-2">{drug.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
