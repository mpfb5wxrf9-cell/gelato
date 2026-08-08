import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { decryptText, encryptText, getSharedKey } from '../lib/crypto';
import type { ConversationSummary, DecryptedMessage, RawMessage } from '../lib/types';

export function useChat(conversationId: string | undefined) {
  const { identity, realtime, user } = useAuth();
  const [conversation, setConversation] = useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [peerTyping, setPeerTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingIds = useRef(new Map<string, string>());

  const decryptOne = useCallback(
    async (raw: RawMessage, conv: ConversationSummary): Promise<DecryptedMessage> => {
      if (!identity || !conv.peer) return { ...raw, text: '', failed: true };
      try {
        const key = await getSharedKey(identity, conv.id, conv.peer.publicKey);
        const text = await decryptText(key, { ciphertext: raw.ciphertext, iv: raw.iv });
        return { ...raw, text };
      } catch {
        return { ...raw, text: '', failed: true };
      }
    },
    [identity]
  );

  useEffect(() => {
    if (!conversationId || !identity) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const { conversation: conv } = await api.getConversation(conversationId);
      if (cancelled) return;
      setConversation(conv);

      const { messages: raw } = await api.getMessages(conversationId);
      if (cancelled) return;
      const decrypted = await Promise.all(raw.map((m) => decryptOne(m, conv)));
      if (cancelled) return;
      setMessages(decrypted);
      setLoading(false);
      realtime?.send({ type: 'read', conversationId });
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId, identity, decryptOne, realtime]);

  useEffect(() => {
    if (!realtime || !conversationId || !conversation) return;

    return realtime.on((event) => {
      if (event.type === 'message' && event.conversationId === conversationId) {
        decryptOne(event, conversation).then((decrypted) => {
          setMessages((prev) => [...prev, decrypted]);
        });
        if (event.senderId !== user?.id) {
          realtime.send({ type: 'read', conversationId });
        }
      }

      if (event.type === 'ack') {
        const localId = pendingIds.current.get(event.clientId);
        if (localId) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === localId ? { ...m, id: event.id, createdAt: event.createdAt, pending: false, delivered: event.delivered } : m
            )
          );
          pendingIds.current.delete(event.clientId);
        }
      }

      if (event.type === 'typing' && event.conversationId === conversationId) {
        setPeerTyping(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setPeerTyping(false), 2500);
      }

      if (event.type === 'read' && event.conversationId === conversationId) {
        setMessages((prev) => prev.map((m) => (m.senderId === user?.id ? { ...m, read: true } : m)));
      }
    });
  }, [realtime, conversationId, conversation, decryptOne, user?.id]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!identity || !conversation?.peer || !conversationId || !realtime || !text.trim()) return;

      const key = await getSharedKey(identity, conversationId, conversation.peer.publicKey);
      const { ciphertext, iv } = await encryptText(key, text.trim());
      const clientId = crypto.randomUUID();
      const localId = `pending-${clientId}`;
      pendingIds.current.set(clientId, localId);

      setMessages((prev) => [
        ...prev,
        {
          id: localId,
          conversationId,
          senderId: identity.userId,
          ciphertext,
          iv,
          createdAt: Date.now(),
          text: text.trim(),
          pending: true,
        },
      ]);

      realtime.send({ type: 'message', conversationId, clientId, ciphertext, iv });
    },
    [identity, conversation, conversationId, realtime]
  );

  const sendTyping = useCallback(() => {
    if (!conversationId || !realtime) return;
    realtime.send({ type: 'typing', conversationId });
  }, [conversationId, realtime]);

  return { conversation, messages, loading, peerTyping, sendMessage, sendTyping };
}
