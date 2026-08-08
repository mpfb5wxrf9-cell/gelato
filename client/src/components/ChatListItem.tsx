import { useNavigate } from 'react-router-dom';
import type { ConversationSummary } from '../lib/types';
import { Avatar } from './Avatar';

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
}

interface Props {
  conversation: ConversationSummary;
  preview: string;
}

export function ChatListItem({ conversation, preview }: Props) {
  const navigate = useNavigate();
  if (!conversation.peer) return null;

  return (
    <button
      onClick={() => navigate(`/chats/${conversation.id}`)}
      className="press"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        width: '100%',
        padding: '11px 6px',
        textAlign: 'left',
      }}
    >
      <Avatar
        name={conversation.peer.nickname}
        color={conversation.peer.avatarColor}
        imageUrl={conversation.peer.avatarUrl}
        size={52}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{conversation.peer.nickname}</span>
          {conversation.lastMessage && (
            <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', flexShrink: 0 }}>
              {formatTime(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <span
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {preview}
          </span>
          {conversation.unread > 0 && (
            <span
              style={{
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 11.5,
                fontWeight: 700,
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6px',
                flexShrink: 0,
                marginLeft: 8,
              }}
            >
              {conversation.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
