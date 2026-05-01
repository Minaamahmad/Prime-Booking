import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { messageService } from '../services/api';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';
import { ArrowLeft, Send, Check, CheckCheck, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      setSending(true);
      await messageService.sendMessage(bookingId, content.trim());
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const uniqueMessages = dedupeMessagesById(messages);



  return (
    <div className="flex flex-col bg-gray-50" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 p-1.5 -ml-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              Chat with {user?.name ? user.name.split(' ')[0] : 'Guest'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">Booking #{bookingId?.slice(-6)}</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-200 px-4 py-2 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <ErrorAlert message={error} onClose={() => setError('')} />
          </div>
        </div>
      )}

      {/* Chat Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading message="Loading messages..." />
        </div>
      ) : (
        <>
          {/* Messages Area — scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              {uniqueMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                  <p className="text-gray-600 text-sm">Send a message to begin chatting with your host</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uniqueMessages.map((message) => {
                    const isMe = String(message.sender_id?._id) === String(user?._id);
                    const messageId = normalizeMessageId(message);
                    if (!messageId) return null;

                    return (
                      <div
                        key={messageId}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] sm:max-w-md lg:max-w-lg ${isMe ? 'order-2' : 'order-1'}`}>
                          <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-900 shadow-sm rounded-bl-sm'}`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <div className={`flex items-center gap-1 text-xs text-gray-400 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {message.timestamp && (
                              <span>{new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                            )}
                            {isMe && (
                              message.read
                                ? <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />
                                : <Check className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEnd} />
                </div>
              )}
            </div>
          </div>

          {/* Message Input — always visible at bottom */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2 sm:gap-3">
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm leading-relaxed"
                    style={{ maxHeight: '120px', overflowY: 'auto' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!content.trim() || sending}
                  className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
