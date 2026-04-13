import { Link } from 'react-router-dom';

const featureCards = [
  {
    title: 'Crowd Flow',
    detail: 'Track pressure across gates, concourses, and exit lanes before congestion builds.',
  },
  {
    title: 'Queue Control',
    detail: 'Spot the fastest stalls and keep halftime decisions quick and stress-free.',
  },
  {
    title: 'Smart Routing',
    detail: 'Guide fans through calmer paths to seats, food, washrooms, and exits.',
  },
  {
    title: 'Live Assistant',
    detail: 'Give instant answers while attendees are moving through the venue.',
  },
];

const tickerItems = [
  'Live venue pulse',
  'Fastest food options',
  'Low-crowd routing',
  'Phase-aware alerts',
  'AI fan guidance',
  'Operational clarity',
];

export default function Home({ userProfile }) {
  return (
    <div className="space-y-6 pb-6 pt-2 md:space-y-8">
      <section className="stadium-panel pitch-lines rounded-[2rem] p-6 md:p-8">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="section-label text-xs font-semibold uppercase text-lime-300">
              Built for the live sporting venue experience
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-[0.9] text-white md:text-8xl">
              Move fans faster. Keep the matchday energy high.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-7 text-slate-300 md:text-xl">
              A matchday companion that reduces crowd friction, shortens waits, and gives every attendee clear next steps in real time.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/entry"
                className="rounded-[1.25rem] bg-lime-300 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:-translate-y-0.5"
              >
                Start Matchday Flow
              </Link>
              <Link
                to={userProfile ? '/dashboard' : '/entry'}
                className="rounded-[1.25rem] border border-white/15 bg-white/5 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-white/30 hover:bg-white/10"
              >
                {userProfile ? 'Resume Live Dashboard' : 'Set Fan Profile'}
              </Link>
            </div>
            
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/ops"
                target="_blank"
                className="flex-1 rounded-[1.25rem] border-2 border-rose-500/50 bg-rose-500/10 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-rose-400 transition hover:bg-rose-500/20"
              >
                🛡️ For Judges: Open Operations Command Center
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="score-panel rounded-[1.75rem] p-5">
              <p className="section-label text-[11px] font-semibold uppercase text-lime-300">
                Fan Profile
              </p>
              <p className="mt-3 font-display text-4xl uppercase leading-none text-white">
                {userProfile ? 'Profile Ready' : 'Ready to Simulate'}
              </p>
              <p className="mt-3 text-sm text-slate-300">
                {userProfile
                  ? `${userProfile.gate} | ${userProfile.seat} | ${userProfile.goalLabel}`
                  : 'Choose gate, seat, and goal to unlock a personalized live view.'}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-orange-300/15 bg-orange-400/10 p-5">
              <p className="section-label text-[11px] font-semibold uppercase text-orange-200">
                Submission Angle
              </p>
              <p className="mt-3 text-2xl font-bold text-white">Accessibility + live practicality</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Focus the story on movement under pressure: fast decisions, fewer taps, clearer signals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 py-3">
        <div className="ticker-track gap-8 px-6 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((card, index) => (
          <article
            key={card.title}
            className="glass-card rounded-[1.75rem] border-white/10 bg-white/5 p-5 transition hover:-translate-y-1"
          >
            <p className="font-display text-5xl leading-none text-white/25">0{index + 1}</p>
            <h2 className="mt-4 text-2xl font-bold text-white">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="stadium-panel rounded-[1.75rem] p-6">
          <p className="section-label text-[11px] font-semibold uppercase text-sky-300">
            Problem Statement Fit
          </p>
          <h2 className="mt-4 font-display text-5xl uppercase leading-none text-white">
            Built for attendees in motion.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Large sporting venues need guidance that works during a rush, not just on a presentation slide. This concept prioritizes movement, wait-time clarity, and fast coordination while keeping the experience energetic and enjoyable.
          </p>
        </article>

        <article className="glass-card rounded-[1.75rem] border-white/10 bg-white/5 p-6">
          <p className="section-label text-[11px] font-semibold uppercase text-orange-200">
            Why This Theme Works
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              'Scoreboard-style hierarchy',
              'Pitch-inspired background system',
              'Mobile-first decision flow',
              'High-contrast live signals',
            ].map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4 text-sm font-semibold text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
