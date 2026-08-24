import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Messages.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/';
const REFRESH_INTERVAL = 15000;

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyData, setReplyData] = useState({
    id: null,
    reply: '',
    via: 'both'
  });
  const [showReply, setShowReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const token = localStorage.getItem('access_token');

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}contact/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const markAsRead = async (id) => {
    try {
      await axios.post(`${API_URL}contact/${id}/mark_read/`, {}, {
        headers: { Authorization: `Token ${token}` }
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
          headers: { Authorization: `Token ${token}` }
        });
        if (selectedMessage?.id === id) setSelectedMessage(null);
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
      const res = await axios.post(`${API_URL}contact/${id}/reply/`, {
        reply: replyData.reply,
        via: replyData.via
      }, {
        headers: { Authorization: `Token ${token}` }
      });
      setReplyStatus(`Reply sent! ${JSON.stringify(res.data.details || {})}`);
      setTimeout(() => setReplyStatus(''), 4000);
      setReplyData({ id: null, reply: '', via: 'both' });
      setShowReply(false);
      fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert(error.response?.data?.error || 'Failed to send reply. Please try again.');
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
          headers: { Authorization: `Token ${token}` }
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
          headers: { Authorization: `Token ${token}` }
        });
        setSelectedMessage(null);
        fetchMessages();
      } catch (error) {
        console.error('Error deleting messages:', error);
      }
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  if (loading) return <div className="loading">Loading messages...</div>;

  return (
    <div className="messages-management">
      <div className="messages-header">
        <h1>Messages</h1>
        <div className="messages-actions">
          <span className="auto-refresh-badge">Auto-refresh: 15s</span>
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
            Refresh
          </button>
        </div>
      </div>

      <div className="messages-layout">
        {/* Message List */}
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="no-messages">
              <span className="empty-icon">✉️</span>
              <p>No messages yet</p>
              <span className="empty-sub">Messages from visitors will appear here</span>
            </div>
          ) : (
            messages.map((msg) => {
              const dt = formatDateTime(msg.created_at);
              return (
                <div 
                  key={msg.id} 
                  className={`message-card ${!msg.is_read ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) markAsRead(msg.id);
                  }}
                >
                  <div className="message-header">
                    <div className="message-sender">
                      <div className="sender-avatar">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{msg.name}</h3>
                        <p className="email">{msg.email}</p>
                      </div>
                    </div>
                    <div className="message-meta">
                      <span className={`status-badge ${msg.is_read ? 'read' : 'unread'}`}>
                        {msg.is_read ? 'Read' : 'New'}
                      </span>
                    </div>
                  </div>

                  <div className="message-preview">
                    <h4>{msg.subject}</h4>
                    <p>{msg.message.substring(0, 100)}{msg.message.length > 100 ? '...' : ''}</p>
                  </div>

                  <div className="message-timestamp">
                    <span className="date">{dt.date}</span>
                    <span className="time">{dt.time}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Detail Panel */}
        {selectedMessage && (
          <div className="message-detail">
            <div className="detail-header">
              <h2>Message Details</h2>
              <button onClick={() => setSelectedMessage(null)} className="close-btn">×</button>
            </div>

            <div className="detail-sender">
              <div className="sender-avatar large">
                {selectedMessage.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{selectedMessage.name}</h3>
                <p className="email">{selectedMessage.email}</p>
                {selectedMessage.phone && <p className="phone">{selectedMessage.phone}</p>}
              </div>
            </div>

            <div className="detail-timestamps">
              <div className="timestamp-item">
                <span className="label">Received:</span>
                <span className="value">
                  {(() => {
                    const dt = formatDateTime(selectedMessage.created_at);
                    return `${dt.date} at ${dt.time}`;
                  })()}
                </span>
              </div>
              {selectedMessage.replied_at && (
                <div className="timestamp-item">
                  <span className="label">Replied:</span>
                  <span className="value">
                    {(() => {
                      const dt = formatDateTime(selectedMessage.replied_at);
                      return `${dt.date} at ${dt.time}`;
                    })()}
                  </span>
                </div>
              )}
            </div>

            <div className="detail-subject">
              <span className="label">Subject:</span>
              <h4>{selectedMessage.subject}</h4>
            </div>

            <div className="detail-message">
              <span className="label">Message:</span>
              <p>{selectedMessage.message}</p>
            </div>

            {selectedMessage.is_replied && selectedMessage.reply && (
              <div className="detail-reply">
                <span className="label">Your Reply:</span>
                <p>{selectedMessage.reply}</p>
              </div>
            )}

            <div className="detail-actions">
              {!selectedMessage.is_read && (
                <button 
                  onClick={() => markAsRead(selectedMessage.id)} 
                  className="action-btn mark-read"
                >
                  Mark as Read
                </button>
              )}
                <button 
                onClick={() => {
                  setShowReply(true);
                  setReplyData({ id: selectedMessage.id, reply: '', via: 'both' });
                }} 
                className="action-btn reply"
              >
                Reply
              </button>
              <button 
                onClick={() => deleteMessage(selectedMessage.id)} 
                className="action-btn delete"
              >
                Delete
              </button>
            </div>

            {replyStatus && (
              <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '0.5rem', color: '#0d9488', fontSize: '0.85rem' }}>
                {replyStatus}
              </div>
            )}

            {showReply && replyData.id === selectedMessage.id && (
              <div className="reply-form">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="via" value="both" checked={replyData.via === 'both'} onChange={e => setReplyData({ ...replyData, via: e.target.value })} /> Email + SMS
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="via" value="email" checked={replyData.via === 'email'} onChange={e => setReplyData({ ...replyData, via: e.target.value })} /> Email only
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="radio" name="via" value="sms" checked={replyData.via === 'sms'} onChange={e => setReplyData({ ...replyData, via: e.target.value })} /> SMS only
                  </label>
                </div>
                {selectedMessage.phone && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Will send SMS to: {selectedMessage.phone}</p>}
                {!selectedMessage.phone && replyData.via !== 'email' && <p style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '0.5rem' }}>No phone number for this customer — SMS not possible.</p>}
                <textarea
                  placeholder="Type your reply here..."
                  value={replyData.reply}
                  onChange={(e) => setReplyData({ ...replyData, reply: e.target.value })}
                  rows="4"
                />
                <div className="reply-actions">
                  <button onClick={() => handleReply(selectedMessage.id)} className="send-btn">
                    Send via {replyData.via === 'both' ? 'Email + SMS' : replyData.via === 'sms' ? 'SMS' : 'Email'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowReply(false);
                      setReplyData({ id: null, reply: '', via: 'both' });
                    }} 
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
