import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { messageService } from '../services/api';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';

const Chat = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEnd = useRef(null);

  const normalizeMessageId = (message) => {
    const raw = message?._id;
    if (raw === undefined || raw === null) return null;
    try {
      return String(raw);
    } catch {
      return null;
    }
  };

  const dedupeMessagesById = (items) => {
    const map = new Map();
    (Array.isArray(items) ? items : []).forEach((m) => {
      const id = normalizeMessageId(m);
      if (!id) return;
      map.set(id, { ...m, _id: id });
    });
    return Array.from(map.values());
  };

  // ✅ Fetch messages (deduplicated)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await messageService.getMessagesByBooking(bookingId);
        setMessages(dedupeMessagesById(response.data));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load chat messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    socket.emit('join_room', { bookingId });

    return () => {
      socket.emit('leave_room', { bookingId });
    };
  }, [bookingId]);

  // ✅ Socket listener (only source of new messages)
  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prev) => {
        const id = normalizeMessageId(message);
        if (!id) return prev;
        const safeMessage = { ...message, _id: id };
        const exists = prev.some((m) => normalizeMessageId(m) === id);
        if (exists) return prev;
        return [...prev, safeMessage];
      });
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, []);

  // ✅ Auto scroll
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Send message (NO manual insert)
  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      setSending(true);
      await messageService.sendMessage(bookingId, content.trim());
      setContent('');
      // ❌ DO NOT setMessages here
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // ✅ FINAL safety: dedupe before render (and drop invalid ids)
  const uniqueMessages = dedupeMessagesById(messages);

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Booking Chat</h1>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <Loading message="Loading chat..." />
      ) : (
        <div className="chat-container">
          <div className="message-list">
            {uniqueMessages.length === 0 ? (
              <div className="empty-chat">
                No messages yet. Start the conversation.
              </div>
            ) : (
              uniqueMessages.map((message) => {
                const isMe = message.sender_id?._id === user?._id;
                const messageId = normalizeMessageId(message);
                if (!messageId) return null;

                return (
                  <div
                    key={messageId}
                    className={`message-item ${isMe ? 'sent' : 'received'}`}
                  >
                    <div className="message-author">
                      {isMe ? 'You' : message.sender_id?.name || 'Owner'}
                    </div>

                    <div className="message-content">
                      {message.content}
                    </div>

                    <div className="message-time">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEnd} />
          </div>

          <div className="chat-input-wrapper">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              rows={3}
            />

            <button
              onClick={handleSend}
              className="send-btn"
              disabled={sending || !content.trim()}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;