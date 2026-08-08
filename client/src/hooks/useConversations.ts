import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { decryptText, getSharedKey } from '../lib/crypto';
import type { ConversationSummary } from '../lib/types';

export function useConversations() {
  const { identity, realtime } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const decryptPreview = useCallback(
    async (conv: ConversationSummary): Promise<string> => {
      if (!identity || !conv.lastMessage || !conv.peer) return 'Nessun messaggio ancora';
      try {
        const key = await getSharedKey(identity, conv.id, conv.peer.publicKey);
        const text = await decryptText(key, { ciphertext: conv.lastMessage.ciphertext, iv: conv.lastMessage.iv });
        return conv.lastMessage.senderId === identity.userId ? `Tu: ${text}` : text;
      } catch {
        return '⚠️ Messaggio non decifrabile su questo dispositivo';
      }
    },
    [identity]
  );

  const refresh = useCallback(async () => {
    const { conversations: list } = await api.listConversations();
    setConversations(list);
    const entries = await Promise.all(list.map(async (c) => [c.id, await decryptPreview(c)] as const));
    setPreviews(Object.fromEntries(entries));
    setLoading(false);
  }, [decryptPreview]);

  useEffect(() => {
    if (identity) refresh();
  }, [identity, refresh]);

  useEffect(() => {
    if (!realtime) return;
    return realtime.on((event) => {
      if (event.type === 'message') refresh();
    });
  }, [realtime, refresh]);

  return { conversations, previews, loading, refresh };
}
