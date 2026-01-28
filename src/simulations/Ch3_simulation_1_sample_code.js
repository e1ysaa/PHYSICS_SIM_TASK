import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Info, Activity } from 'lucide-react';

const NewtonLab = () => {
  const [activeTab, setActiveTab] = useState('hammer'); // 'hammer' | 'orbit'
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">Newton's 3rd Law Lab</h1>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('hammer')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'hammer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Example 1: Contact Force
          </button>
          <button
            onClick={() => setActiveTab('orbit')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'orbit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Example 2: Non-contact Force
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'hammer' ? <HammerSimulation /> : <OrbitSimulation />}
      </main>

      {/* Info Box */}
      <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 transition-all duration-300 transform ${showInfo ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-50 rounded-t-xl">
          <h3 className="font-bold text-blue-900 flex items-center gap-2">
            <Info size={18} />
            Key Concept
          </h3>
          <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="p-4 text-sm text-slate-600 leading-relaxed">
          <p className="mb-2"><strong>Newton's Third Law:</strong> For every action, there is an equal and opposite reaction.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Forces always come in pairs.</li>
            <li>Two forces are equal in magnitude.</li>
            <li>Two forces act in opposite directions.</li>
          </ul>
        </div>
      </div>

      {!showInfo && (
        <button 
          onClick={() => setShowInfo(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Info size={24} />
        </button>
      )}
    </div>
  );
};

/* -------------------- HAMMER SIMULATION -------------------- */
const HammerSimulation = () => {
  const [mass, setMass] = useState(5);
  const [velocity, setVelocity] = useState(5);
  const [isStriking, setIsStriking] = useState(false);
  const [impactData, setImpactData] = useState({ force: 0, active: false });

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const stateRef = useRef({ hammerY: 100, nailY: 300, phase: 'idle', progress: 0 });

  const calculateForce = () => Math.round(mass * velocity * 20);

  const handleStrike = () => {
    if (isStriking) return;
    setIsStriking(true);
    stateRef.current.phase = 'down';
    setImpactData({ force: 0, active: false });
  };

  const reset = () => {
    setIsStriking(false);
    stateRef.current = { hammerY: 100, nailY: 300, phase: 'idle', progress: 0 };
    setImpactData({ force: 0, active: false });
  };

  const draw = useCallback((ctx) => {
    const { width, height } = ctx.canvas;
    const state = stateRef.current;
    ctx.clearRect(0, 0, width, height);

    const nailX = width / 2;
    const currentNailY = state.nailY;

    // Draw hammer and nail
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(nailX - 5, currentNailY, 10, 60);
    ctx.fillStyle = '#475569';
    ctx.fillRect(nailX - 30, state.hammerY, 60, 40);

    // Animation logic
    if (state.phase === 'down') {
      state.hammerY += velocity * 2;
      if (state.hammerY >= currentNailY - 40) {
        state.hammerY = currentNailY - 40;
        state.phase = 'contact';
        state.impactTimer = 0;
        const forceVal = calculateForce();
        setImpactData({ force: forceVal, active: true });
        state.targetNailY = Math.min(350 - 10, state.nailY + Math.min(30, forceVal / 50));
      }
    } else if (state.phase === 'contact') {
      state.impactTimer++;
      if (state.nailY < state.targetNailY) state.nailY += 2;
      if (state.impactTimer > 40) {
        state.phase = 'up';
        setImpactData(prev => ({ ...prev, active: false }));
      }
    } else if (state.phase === 'up') {
      state.hammerY -= 5;
      if (state.hammerY <= 100) {
        state.hammerY = 100;
        state.phase = 'idle';
        setIsStriking(false);
      }
    }
  }, [mass, velocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const render = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />;
};

/* -------------------- ORBIT SIMULATION -------------------- */
const OrbitSimulation = () => {
  const [earthMass, setEarthMass] = useState(5);
  const [moonMass, setMoonMass] = useState(2);
  const [distance, setDistance] = useState(200);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const angleRef = useRef(0);

  const calculateGravity = () => 2000 * earthMass * moonMass / (distance * 0.5);

  const draw = useCallback((ctx) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    angleRef.current += 0.005;

    const earthRadius = 20 + earthMass * 4;
    const moonX = centerX + Math.cos(angleRef.current) * distance;
    const moonY = centerY + Math.sin(angleRef.current) * distance;
    const moonRadius = 10 + moonMass * 2;

    // Draw Earth & Moon
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthRadius, 0, 2*Math.PI);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, 2*Math.PI);
    ctx.fill();
  }, [earthMass, moonMass, distance]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const render = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />;
};

export default NewtonLab;
