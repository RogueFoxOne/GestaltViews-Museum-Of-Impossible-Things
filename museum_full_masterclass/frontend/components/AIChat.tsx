type Props = {
  messages: { role: 'user' | 'assistant'; content: string }[];
  onSend: (message: string) => Promise<void> | void;
  loading?: boolean;
};

export function AIChat({ messages, onSend, loading }: Props) {
  return (
    <div className="neural-card p-4">
      <h3 className="text-lg font-semibold mb-3">Assistant</h3>
      <div className="h-80 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-3 py-2 rounded ${m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-800'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const text = String(fd.get('text') || '').trim();
          if (!text) return;
          await onSend(text);
          e.currentTarget.reset();
        }}
      >
        <input name="text" placeholder="Tell me about an experience..." className="flex-1 neural-input" />
        <button className="btn-neural btn-secondary">Send</button>
      </form>
      {loading && <div className="text-sm text-slate-400 mt-2">Thinking…</div>}
    </div>
  );
}
