import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { messageService } from '../services/api';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';
import { ArrowLeft, Send, Check, CheckCheck } from 'lucide-react';

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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-gray-900">Chat</h1>
            <p className="text-xs text-gray-500">Booking #{bookingId?.slice(-6)}</p>
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
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
              {uniqueMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Start the conversation</h3>
                  <p className="text-xs text-gray-500">Send a message to the property owner</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(groupMessagesByDate(uniqueMessages)).map(([date, dateMessages]) => (
                    <div key={date}>
                      {/* Date Divider */}
                      <div className="flex items-center justify-center my-3">
                        <div className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          {formatDate(dateMessages[0]?.createdAt)}
                        </div>
                      </div>
                      
                      {/* Messages for this date */}
                      <div className="space-y-2">
                        {dateMessages.map((message) => {
                          const isMe = message.sender_id?._id === user?._id;
                          const messageId = normalizeMessageId(message);
                          if (!messageId) return null;

                          return (
                            <div
                              key={messageId}
                              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${isMe ? 'order-2' : 'order-1'}`}>
                                {/* Sender Name */}
                                <p className="text-xs font-medium text-gray-600 mb-1 px-1">
                                  {isMe ? 'Guest' : 'Property Owner'}
                                </p>
                                
                                {/* Message Bubble */}
                                <div
                                  className={`
                                    px-3 py-1.5 rounded-2xl shadow-sm
                                    ${isMe 
                                      ? 'bg-gray-800 text-white rounded-br-sm' 
                                      : 'bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200'
                                    }
                                  `}
                                >
                                  <p className="text-sm leading-relaxed break-words">
                                    {message.content}
                                  </p>
                                </div>
                                
                                {/* Time */}
                                <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <span className="text-xs text-gray-500">
                                    {formatTime(message.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                  <div ref={messagesEnd} />
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-3 py-2 sm:px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Input Area */}
              <div className="flex items-end gap-2">
                <button className="text-gray-600 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-100 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={sending || !content.trim()}
                  className="
                    p-1.5 bg-blue-600 text-white rounded-lg 
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all
                    flex items-center justify-center
                  "
                  aria-label="Send message"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
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