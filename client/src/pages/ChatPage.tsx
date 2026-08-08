import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { Avatar } from '../components/Avatar';
import { MessageBubble } from '../components/MessageBubble';
import { BackIcon, SendIcon, LockIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversation, messages, loading, peerTyping, sendMessage, sendTyping } = useChat(id);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingThrottle = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, peerTyping]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft('');
  };

  const onChange = (value: string) => {
    setDraft(value);
    const now = Date.now();
    if (now - typingThrottle.current > 1500) {
      sendTyping();
      typingThrottle.current = now;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <header
        className="glass"
        style={{
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          padding: 'calc(12px + var(--safe-top)) 14px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button onClick={() => navigate('/chats')} className="press" style={{ padding: 6 }}>
          <BackIcon />
        </button>
        {conversation?.peer && (
          <>
            <Avatar name={conversation.peer.displayName} color={conversation.peer.avatarColor} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conversation.peer.displayName}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontWeight: 600,
                }}
              >
                <LockIcon width={10} height={10} strokeWidth={2.6} />
                {peerTyping ? 'sta scrivendo…' : 'Cifratura end-to-end'}
              </div>
            </div>
          </>
        )}
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 30, fontSize: 14 }}>
            Decifratura messaggi…
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '40px 24px', fontSize: 13.5 }}>
            Inizia la conversazione. Solo tu e {conversation?.peer?.displayName || 'il tuo contatto'} potete leggere
            questi messaggi.
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} mine={m.senderId === user?.id} />
        ))}

        {peerTyping && (
          <div style={{ display: 'flex', gap: 4, padding: '4px 14px' }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--text-tertiary)',
                  display: 'inline-block',
                  animation: `typing-bounce 1.2s ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          padding: '10px 12px calc(10px + var(--safe-bottom))',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        <div className="glass field-box" style={{ flex: 1, borderRadius: 20, padding: '10px 16px' }}>
          <textarea
            value={draft}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            placeholder="Messaggio…"
            rows={1}
            style={{ resize: 'none', maxHeight: 100, lineHeight: 1.4, fontSize: 15.5 }}
          />
        </div>
        <button
          type="submit"
          disabled={!draft.trim()}
          className="press"
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: draft.trim() ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
            color: draft.trim() ? '#fff' : 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label="Invia"
        >
          <SendIcon width={18} height={18} />
        </button>
      </form>
    </div>
  );
}
