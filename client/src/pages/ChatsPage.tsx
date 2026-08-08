import { useNavigate } from 'react-router-dom';
import { useConversations } from '../hooks/useConversations';
import { ChatListItem } from '../components/ChatListItem';
import { TabBar } from '../components/TabBar';
import { EncryptionBadge } from '../components/EncryptionBadge';
import { PlusIcon, ChatBubbleIcon } from '../components/Icons';

export function ChatsPage() {
  const { conversations, previews, loading } = useConversations();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <header
        style={{
          padding: 'calc(16px + var(--safe-top)) 20px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 750, margin: 0, letterSpacing: -0.6 }}>Messaggi</h1>
          <button
            onClick={() => navigate('/chats/new')}
            className="press glass"
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}
            aria-label="Nuova conversazione"
          >
            <PlusIcon />
          </button>
        </div>
        <EncryptionBadge />
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '60px 0', fontSize: 14 }}>
            Caricamento conversazioni…
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              padding: '70px 20px',
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-tertiary)',
              }}
            >
              <ChatBubbleIcon width={30} height={30} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Nessuna conversazione</div>
            <div style={{ fontSize: 13.5, maxWidth: 220 }}>
              Tocca + per iniziare una nuova chat cifrata con un contatto.
            </div>
          </div>
        )}

        <div
          className="glass"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: conversations.length ? '4px 12px' : 0,
            display: conversations.length ? 'block' : 'none',
          }}
        >
          {conversations.map((c, i) => (
            <div key={c.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--glass-border)' }}>
              <ChatListItem conversation={c} preview={previews[c.id] || '…'} />
            </div>
          ))}
        </div>
      </div>

      <TabBar />
    </div>
  );
}
