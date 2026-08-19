import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Messages.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyData, setReplyData] = useState({
    id: null,
    reply: ''
  });
  const [showReply, setShowReply] = useState(false);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}contact/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(`${API_URL}contact/${id}/mark_read/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`${API_URL}contact/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleReply = async (id) => {
    if (!replyData.reply.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      await axios.post(`${API_URL}contact/${id}/reply/`, {
        reply: replyData.reply
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReplyData({ id: null, reply: '' });
      setShowReply(false);
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const handleBulkMarkRead = async () => {
    const unreadIds = messages.filter(m => !m.is_read).map(m => m.id);
    if (unreadIds.length === 0) {
      alert('No unread messages to mark');
      return;
    }

    if (window.confirm(`Mark ${unreadIds.length} messages as read?`)) {
      try {
        await axios.post(`${API_URL}contact/bulk_mark_read/`, {
          ids: unreadIds
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMessages();
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (messages.length === 0) {
      alert('No messages to delete');
      return;
    }

    if (window.confirm(`Delete all ${messages.length} messages?`)) {
      try {
        const allIds = messages.map(m => m.id);
        await axios.post(`${API_URL}contact/bulk_delete/`, {
          ids: allIds
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMessages();
      } catch (error) {
        console.error('Error deleting messages:', error);
      }
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return <div className="loading">Loading messages...</div>;

  return (
    <div className="messages-management">
      <div className="messages-header">
        <h1>Messages</h1>
        <div className="messages-actions">
          <span className="unread-badge">
            {unreadCount} unread
          </span>
          {unreadCount > 0 && (
            <button onClick={handleBulkMarkRead} className="action-btn">
              Mark All Read
            </button>
          )}
          {messages.length > 0 && (
            <button onClick={handleBulkDelete} className="action-btn danger">
              Delete All
            </button>
          )}
          <button onClick={fetchMessages} className="action-btn refresh">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">
            <span className="empty-icon">✉️</span>
            <p>No messages yet</p>
            <span className="empty-sub">Messages from visitors will appear here</span>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message-card ${!msg.is_read ? 'unread' : ''}`}>
              <div className="message-header">
                <div className="message-sender">
                  <div className="sender-avatar">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{msg.name}</h3>
                    <p className="email">{msg.email}</p>
                    {msg.phone && <p className="phone">📞 {msg.phone}</p>}
                  </div>
                </div>
                <div className="message-meta">
                  <span className={`status-badge ${msg.is_read ? 'read' : 'unread'}`}>
                    {msg.is_read ? '✓ Read' : '● Unread'}
                  </span>
                  <span className="message-date">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="message-body">
                <h4>{msg.subject}</h4>
                <p>{msg.message}</p>
              </div>

              {msg.is_replied && msg.reply && (
                <div className="message-reply">
                  <div className="reply-header">
                    <span>📧 Reply Sent</span>
                    <span className="reply-date">
                      {new Date(msg.replied_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{msg.reply}</p>
                </div>
              )}

              <div className="message-actions">
                {!msg.is_read && (
                  <button 
                    onClick={() => markAsRead(msg.id)} 
                    className="action-btn mark-read"
                  >
                    Mark as Read
                  </button>
                )}
                <button 
                  onClick={() => {
                    setShowReply(true);
                    setReplyData({ id: msg.id, reply: '' });
                  }} 
                  className="action-btn reply"
                >
                  Reply
                </button>
                <button 
                  onClick={() => deleteMessage(msg.id)} 
                  className="action-btn delete"
                >
                  Delete
                </button>
              </div>

              {showReply && replyData.id === msg.id && (
                <div className="reply-form">
                  <textarea
                    placeholder="Type your reply here..."
                    value={replyData.reply}
                    onChange={(e) => setReplyData({ ...replyData, reply: e.target.value })}
                    rows="4"
                  />
                  <div className="reply-actions">
                    <button onClick={() => handleReply(msg.id)} className="send-btn">
                      Send Reply
                    </button>
                    <button 
                      onClick={() => {
                        setShowReply(false);
                        setReplyData({ id: null, reply: '' });
                      }} 
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;