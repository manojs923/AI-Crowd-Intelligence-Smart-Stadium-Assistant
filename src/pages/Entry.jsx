import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const gates = ['North Gate', 'South Gate'];
const seats = ['Section A', 'Section B', 'Section C'];
const goals = [
  { value: 'seat', label: 'Watch match' },
  { value: 'food', label: 'Get food' },
  { value: 'explore', label: 'Explore' },
];

export default function Entry({ userProfile, onStart }) {
  const navigate = useNavigate();
  const [gate, setGate] = useState(userProfile?.gate ?? gates[0]);
  const [seat, setSeat] = useState(userProfile?.seat ?? seats[1]);
  const [goal, setGoal] = useState(userProfile?.goal ?? goals[0].value);

  const selectedGoal = goals.find((item) => item.value === goal) ?? goals[0];

  const handleSubmit = (event) => {
    event.preventDefault();

    onStart({
      gate,
      seat,
      goal,
      goalLabel: selectedGoal.label,
    });

    navigate('/dashboard');
  };

  return (
    <div className="space-y-8 pb-10 pt-4">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card rounded-[36px] p-8 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
            Enter Stadium Experience
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight text-slate-950 md:text-5xl">
            Simulate a fan journey and personalize the AI assistant in seconds.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Choose a gate, seat area, and visitor goal. The dashboard will adapt route
            suggestions, alerts, and chat recommendations using this simulated entry profile.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white/90 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Entry Gate</p>
              <p className="mt-2 text-xl font-bold text-slate-950">{gate}</p>
            </div>
            <div className="rounded-[24px] bg-white/90 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Seat Area</p>
              <p className="mt-2 text-xl font-bold text-slate-950">{seat}</p>
            </div>
            <div className="rounded-[24px] bg-slate-950 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Goal</p>
              <p className="mt-2 text-xl font-bold">{selectedGoal.label}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-[36px] p-8 shadow-glow">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                Select Entry Gate
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {gates.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGate(item)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                      gate === item
                        ? 'border-sky-500 bg-sky-50 text-sky-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Select Seat Area
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {seats.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSeat(item)}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                      seat === item
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700">
                Purpose
              </label>
              <div className="mt-3 grid gap-3">
                {goals.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setGoal(item.value)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      goal === item.value
                        ? 'border-rose-500 bg-rose-50 text-rose-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-sm font-semibold">{item.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start Experience
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
