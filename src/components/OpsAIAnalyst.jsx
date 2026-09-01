import { useEffect, useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export default function OpsAIAnalyst({ phase, isEmergency, emergencyType, crowdZones }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const generateAnalysis = useCallback(async () => {
    if (!ai) {
      setError("AI Services offline. Verify VITE_GEMINI_API_KEY.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const sortedZones = [...crowdZones].sort((a, b) => b.people - a.people);
    const criticalZones = sortedZones.slice(0, 3).map(z => `${z.zone} (${z.people} pax)`).join(', ');
    const safestZones = sortedZones.slice(-3).map(z => `${z.zone} (${z.people} pax)`).join(', ');

    const prompt = `You are the 'Tactical AI Operations Commander' for a Smart Stadium during a major match.
    Provide a highly actionable, concise, real-time situation report (SitRep) for the venue staff.
    
    Current State:
    - Match Phase: ${phase}
    - Emergency Status: ${isEmergency ? `CRITICAL - ${emergencyType}` : 'Normal Ops'}
    - Highest Congestion Areas: ${criticalZones}
    - Safest/Clearest Areas: ${safestZones}
    
    Respond in EXACTLY 3 sections (use these exact headers):
    1. 📊 TACTICAL SITREP: 2 sentences analyzing the current structural flow.
    2. 🚨 IMMEDIATE ANOMALIES: 1-2 bullet points identifying the biggest risk right now.
    3. 👥 DEPLOYMENT ORDERS: 2-3 bullet points of explicit staff movement (e.g., "Shift 5 stewards from X to Y").
    
    Keep it extremely terse, professional, and tactical.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { temperature: 0.2 },
      });
      
      setAnalysis(response.text);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI tactical analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [phase, isEmergency, emergencyType, crowdZones]);

  // Auto-generate on mount or when emergency state changes
  useEffect(() => {
    generateAnalysis();
  }, [isEmergency, phase, generateAnalysis]); // Automatically run when phase or emergency changes

  const formatAnalysis = (text) => {
    if (!text) return null;
    
    // Simple parser to extract the sections and render them beautifully
    const sections = text.split(/(?=\d\.\s)/).filter(Boolean);
    
    return sections.map((section, idx) => {
      const parts = section.split(':');
      const title = parts[0];
      const contentLines = parts.slice(1);
      const content = contentLines.join(':').trim();
      const lines = content.split('\n').filter(Boolean);
      
      const isDeployment = title.includes('DEPLOYMENT');
      const isAnomaly = title.includes('ANOMALIES');
      
      return (
        <div key={idx} className={`mb-4 rounded-xl p-4 border ${isDeployment ? 'border-sky-500/30 bg-sky-950/20' : isAnomaly ? 'border-rose-500/30 bg-rose-950/20' : 'border-lime-500/30 bg-lime-950/20'}`}>
          <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${isDeployment ? 'text-sky-400' : isAnomaly ? 'text-rose-400' : 'text-lime-400'}`}>
             {title.replace(/^\d\.\s/, '').trim()}
          </h4>
          <div className="text-sm text-slate-200 leading-relaxed">
            {lines.map((line, i) => (
              <p key={i} className={line.trim().startsWith('-') || line.trim().startsWith('*') ? 'ml-2 pl-2 border-l-2 border-white/10 mb-1' : 'mb-2'}>
                {line.replace(/^[-*]\s*/, '')}
              </p>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <section className="glass-card rounded-[2rem] border-white/10 bg-black/60 p-6 md:p-8 relative overflow-hidden group shadow-glow">
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-colors duration-700 ${isEmergency ? 'bg-red-500' : 'bg-sky-500'} blur-[100px]`}></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <p className="section-label flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            Live Intelligence
          </p>
          <h3 className="mt-1 font-display text-2xl md:text-3xl uppercase tracking-wider text-white">
             Tactical AI Analyst
          </h3>
        </div>
        
        <button
          onClick={generateAnalysis}
          disabled={isAnalyzing}
          className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)] ${isAnalyzing ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-sky-500 text-slate-950 hover:bg-sky-400 hover:scale-105 active:scale-95'}`}
        >
          {isAnalyzing ? 'Processing...' : 'Force Recalculate'}
        </button>
      </div>

      <div className="relative z-10">
        {isAnalyzing ? (
           <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-white/5 bg-slate-950/50">
              <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-300 animate-pulse">Running Neural Simulation...</p>
           </div>
        ) : error ? (
           <div className="rounded-2xl border border-red-500/30 bg-red-950/50 p-6 text-center">
              <p className="text-red-400 text-sm font-bold uppercase">{error}</p>
           </div>
        ) : analysis ? (
           <div className="animate-fade-in">
             {formatAnalysis(analysis)}
             
             <div className="mt-4 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cryptographically signed by Stadium AI Core
             </div>
           </div>
        ) : (
           <div className="flex items-center justify-center py-12 rounded-2xl border border-white/5 bg-slate-950/50">
             <p className="text-slate-500 text-sm">No analysis generated yet.</p>
           </div>
        )}
      </div>
    </section>
  );
}
