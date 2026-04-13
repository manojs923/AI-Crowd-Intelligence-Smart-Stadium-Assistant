import { useEffect, useState } from 'react';
import { getAssistantReply } from '../utils/chat';

const quickPrompts = [
  'Where is nearest washroom?',
  'Best time to get food?',
  'What is the fastest exit?',
  'Will crowd increase soon?',
];

export default function ChatAssistant({
  crowdZones,
  stalls,
  phase,
  userProfile,
  isSheet = false,
  onClose,
}) {
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

  const submitMessage = async (prompt) => {
    const value = prompt ?? input;

    if (!value.trim() || isTyping) return;

    setMessages((current) => [...current, { role: 'user', text: value }]);
    setInput('');
    setIsTyping(true);

    const reply = await getAssistantReply(value, crowdZones, stalls, phase, userProfile);
    
    setMessages((current) => [...current, { role: 'assistant', text: reply }]);
    setIsTyping(false);
  };

  return (
    <section
      className={`glass-card ${
        isSheet
          ? 'rounded-t-[2rem] border-white/10 bg-slate-950/95 p-5 md:rounded-[2rem] md:p-6'
          : 'rounded-[1.75rem] border-white/10 bg-white/5 p-5'
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="section-label text-[11px] font-semibold uppercase text-sky-400">
            AI Match Assistant
          </p>
          <h2 className="mt-2 font-display text-4xl uppercase leading-none text-white">
            Ask for live recommendations
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-sky-400 px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            {phase}
          </div>
          {isSheet ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>

      <div className={`grid gap-4 ${isSheet ? 'lg:grid-cols-[0.72fr_1.28fr]' : 'lg:grid-cols-[0.78fr_1.22fr]'}`}>
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/75 p-5 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-200">Quick prompts</p>
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
          <div className="mt-6 rounded-[1.25rem] border border-purple-400/20 bg-purple-400/10 p-4">
            <p className="section-label text-[10px] font-semibold uppercase text-purple-300">Assistant mode</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              {userProfile
                ? `Personalizing from ${userProfile.gate} for ${userProfile.seat}.`
                : 'Live reasoning blends crowd pressure, queue times, and match phase.'}
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
          <div className={`flex flex-col gap-3 overflow-y-auto px-1 py-2 ${isSheet ? 'max-h-[24rem]' : 'max-h-[21rem]'}`}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-bubble max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                  message.role === 'assistant'
                    ? 'bg-slate-800 text-slate-100 border border-white/10'
                    : 'ml-auto bg-sky-400 text-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                }`}
              >
                {message.text}
              </div>
            ))}
            {isTyping ? (
              <div className="chat-bubble max-w-[88%] rounded-[1.5rem] bg-slate-100 px-4 py-3 text-sm text-slate-600 shadow-sm">
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
              className="w-full rounded-[1.2rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:shadow-[0_0_12px_rgba(56,189,248,0.2)]"
            />
            <button
              type="button"
              onClick={() => submitMessage()}
              className="rounded-[1.2rem] bg-sky-400 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-950 transition hover:-translate-y-0.5 shadow-[0_0_10px_rgba(56,189,248,0.3)]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
