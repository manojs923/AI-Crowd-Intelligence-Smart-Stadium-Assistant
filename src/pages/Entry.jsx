import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const gates = ['North Gate', 'South Gate'];
const seats = ['Section A', 'Section B', 'Section C'];
const goals = [
  { value: 'seat', label: 'Watch match' },
  { value: 'food', label: 'Get food' },
  { value: 'explore', label: 'Explore' },
];

const setupSteps = ['Set Entry', 'Choose Goal', 'Follow Route'];

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
    <div className="space-y-6 pb-8 pt-2">
      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="stadium-panel rounded-[2rem] p-6 md:p-8">
          <p className="section-label text-xs font-semibold uppercase text-orange-200">
            Fan onboarding
          </p>
          <h1 className="mt-4 font-display text-6xl uppercase leading-[0.92] text-white md:text-7xl">
            Set the supporter profile in seconds.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-300">
            Pick an entry gate, stand section, and intent so the dashboard can route, alert, and respond like a real matchday assistant.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {setupSteps.map((step, index) => (
              <div
                key={step}
                className={`rounded-[1.25rem] border px-4 py-4 ${
                  index === 0
                    ? 'border-lime-300/20 bg-lime-300/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <p className="section-label text-[10px] font-semibold uppercase text-slate-400">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-base font-bold uppercase tracking-[0.06em] text-white">
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="score-panel rounded-[1.5rem] p-4">
              <p className="section-label text-[10px] font-semibold uppercase text-lime-300">Gate</p>
              <p className="mt-3 text-2xl font-bold text-white">{gate}</p>
            </div>
            <div className="score-panel rounded-[1.5rem] p-4">
              <p className="section-label text-[10px] font-semibold uppercase text-lime-300">Seat</p>
              <p className="mt-3 text-2xl font-bold text-white">{seat}</p>
            </div>
            <div className="rounded-[1.5rem] border border-orange-300/20 bg-orange-400/10 p-4">
              <p className="section-label text-[10px] font-semibold uppercase text-orange-200">Goal</p>
              <p className="mt-3 text-2xl font-bold text-white">{selectedGoal.label}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-[2rem] border-white/10 bg-white/5 p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label className="section-label text-[11px] font-semibold uppercase text-sky-300">
                Select Entry Gate
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {gates.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGate(item)}
                    className={`rounded-[1.25rem] border px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.1em] transition ${
                      gate === item
                        ? 'border-lime-300 bg-lime-300 text-slate-950 shadow-neon'
                        : 'border-white/10 bg-slate-950/60 text-slate-200 hover:border-white/20 hover:bg-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="section-label text-[11px] font-semibold uppercase text-sky-300">
                Select Seat Area
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {seats.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSeat(item)}
                    className={`rounded-[1.25rem] border px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.1em] transition ${
                      seat === item
                        ? 'border-sky-300 bg-sky-300 text-slate-950'
                        : 'border-white/10 bg-slate-950/60 text-slate-200 hover:border-white/20 hover:bg-slate-900'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="section-label text-[11px] font-semibold uppercase text-sky-300">
                Match Goal
              </label>
              <div className="mt-3 grid gap-3">
                {goals.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setGoal(item.value)}
                    className={`rounded-[1.25rem] border px-4 py-4 text-left transition ${
                      goal === item.value
                        ? 'border-orange-300 bg-orange-300 text-slate-950'
                        : 'border-white/10 bg-slate-950/60 text-slate-200 hover:border-white/20 hover:bg-slate-900'
                    }`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.1em]">{item.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-[1.35rem] bg-lime-300 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:-translate-y-0.5"
            >
              Launch Dashboard
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
