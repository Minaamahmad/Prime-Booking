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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Guest Support Chat</h1>
            <p className="text-sm text-gray-500">Booking #{bookingId?.slice(-6)}</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
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
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {uniqueMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center h-full">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                  <p className="text-gray-600">Send a message to begin chatting with your host</p>
                  
                  {/* Quick Phrases */}
                  
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
                        <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${isMe ? 'order-2' : 'order-1'}`}>
                          <div className={`px-4 py-2.5 rounded-xl ${isMe ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-900 shadow-sm'}`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            {message.timestamp && new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            {isMe && (
                              <span className="ml-2">
                                {message.read ? (
                                  <CheckCheck className="w-4 h-4 text-indigo-600" />
                                ) : (
                                  <Check className="w-4 h-4 text-gray-400" />
                                )}
                              </span>
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

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Quick Actions */}
             
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!content.trim() || sending}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
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
