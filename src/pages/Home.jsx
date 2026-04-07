import { Link } from 'react-router-dom';

const features = [
  'Least-crowded navigation to seats, food, washrooms, and exits',
  'Live heatmap showing high, medium, and low pressure areas',
  'Queue prediction for food stalls with faster alternatives',
  'AI chat assistant for instant venue guidance',
];

export default function Home() {
  return (
    <div className="space-y-8 pb-8 pt-4">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card overflow-hidden rounded-[36px] p-8 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
            AI Crowd Intelligence & Smart Stadium Assistant
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">
            Predict movement, reduce congestion, and guide every fan in real time.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A lightweight React project that simulates crowd behavior, estimates queue
            time, and gives personalized recommendations for safer stadium journeys.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open Dashboard
            </Link>
            <a
              href="#overview"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Project Overview
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="glass-card rounded-[28px] p-6 shadow-glow">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
              One-Line Pitch
            </p>
            <p className="mt-3 text-xl font-bold leading-8 text-slate-900">
              An AI-powered system that predicts crowd behavior and provides real-time
              smart guidance to enhance stadium experience and safety.
            </p>
          </div>

          <div className="glass-card rounded-[28px] p-6 shadow-glow">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Objectives
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {['Reduce congestion', 'Minimize waits', 'Improve navigation', 'Enable smart decisions'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/90 p-4 text-sm font-semibold text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-[28px] p-6 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
            Problem Statement
          </p>
          <p className="mt-3 text-base leading-8 text-slate-600">
            Large sporting venues struggle with congestion at gates and exits, long
            waiting times near food stalls and restrooms, limited coordination, and poor
            indoor navigation. These issues affect both visitor safety and overall event
            experience.
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-6 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
            Core Features
          </p>
          <div className="mt-4 space-y-3">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl bg-white/90 p-4 text-sm font-medium text-slate-700">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
