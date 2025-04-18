import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const EmailList = ({ emails, onSelectEmail, selectedEmailId }) => {
  if (emails.length === 0) {
    return <div className="empty-list">No emails in this category</div>;
  }

  return (
    <div className="email-list">
      {emails.map((email) => (
        <div 
          key={email.id}
          className={`email-item ${email.read ? 'read' : 'unread'} ${
            selectedEmailId === email.id ? 'selected' : ''
          }`}
          onClick={() => onSelectEmail(email)}
        >
          <div className="email-header">
            <span className="email-sender">{email.sender}</span>
            <span className="email-time">
              {formatDistanceToNow(new Date(email.date))} ago
            </span>
          </div>
          <div className="email-subject">{email.subject}</div>
          <div className="email-preview">{email.preview}</div>
          <div className="email-meta">
            <span className={`category-badge ${email.category}`}>
              {email.category}
            </span>
            {email.important && <span className="important-badge">Important</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;