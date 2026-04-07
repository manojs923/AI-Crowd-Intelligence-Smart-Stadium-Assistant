import { useEffect, useState } from 'react';
import { getAssistantReply } from '../utils/chat';

const quickPrompts = [
  'Where is nearest washroom?',
  'Best time to get food?',
  'What is the fastest exit?',
  'Will crowd increase soon?',
];

export default function ChatAssistant({ crowdZones, stalls, phase, userProfile }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: userProfile
        ? `Profile loaded for ${userProfile.gate}, ${userProfile.seat}, goal: ${userProfile.goalLabel}. Ask me for personalized guidance.`
        : 'Ask about routes, food waits, crowd surges, or exit guidance.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        text: userProfile
          ? `Profile loaded for ${userProfile.gate}, ${userProfile.seat}, goal: ${userProfile.goalLabel}. Ask me for personalized guidance.`
          : 'Ask about routes, food waits, crowd surges, or exit guidance.',
      },
    ]);
  }, [userProfile]);

  useEffect(() => () => clearTimeout(timerId), [timerId]);

  const submitMessage = (prompt) => {
    const value = prompt ?? input;

    if (!value.trim() || isTyping) return;

    const reply = getAssistantReply(value, crowdZones, stalls, phase, userProfile);
    setMessages((current) => [...current, { role: 'user', text: value }]);
    setInput('');
    setIsTyping(true);

    clearTimeout(timerId);
    const nextTimer = setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 700);
    setTimerId(nextTimer);
  };

  return (
    <section className="glass-card rounded-[28px] p-6 shadow-glow">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
            AI Chat Assistant
          </p>
          <h2 className="font-display text-2xl font-bold text-slate-950">
            Ask for live recommendations
          </h2>
        </div>
        <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          Phase: {phase}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white">
          <p className="text-sm font-semibold text-slate-200">Try these prompts</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => submitMessage(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Assistant Mode</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              {userProfile
                ? `Personalizing responses from ${userProfile.gate} for ${userProfile.seat}.`
                : 'Live reasoning blends crowd pressure, wait times, and phase timing.'}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4">
          <div className="flex max-h-[340px] flex-col gap-3 overflow-y-auto px-1 py-2">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-bubble max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                  message.role === 'assistant'
                    ? 'bg-slate-100 text-slate-700'
                    : 'ml-auto bg-sky-500 text-white'
                }`}
              >
                {message.text}
              </div>
            ))}
            {isTyping ? (
              <div className="chat-bubble max-w-[88%] rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600 shadow-sm">
                <div className="flex items-center gap-2">
                  <span>AI is thinking</span>
                  <span className="thinking-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  submitMessage();
                }
              }}
              placeholder="Ask something like 'Best time to get food?'"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-400"
            />
            <button
              type="button"
              onClick={() => submitMessage()}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
