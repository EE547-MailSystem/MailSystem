import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const EmailList = ({ emails, onSelectEmail, selectedEmailId }) => {
  return (
    <div className="email-list">
      {emails.map((email) => (
        <div 
          key={email.from + email.subject}
          className={`email-item ${email.read_status ? 'read' : 'unread'} ${
            selectedEmailId === email.from + email.subject ? 'selected' : ''
          }`}
          onClick={() => onSelectEmail(email)}
        >
          <div className="email-header">
            <div className="email-sender">{email.from}</div>
            <div className="email-subject">{email.subject}</div>
          </div>

          {email.tags && email.tags.length > 0 && (
            <div className="email-tags-preview">
              {email.tags.map(tag => (
                <span key={tag} className="tag-preview">{tag}</span>
              ))}
            </div>
          )}
          
          <div className="email-meta">
            <span className="email-time">
              {formatDistanceToNow(new Date(), { addSuffix: true })}
            </span>
            <span className={`category-badge ${email.category.toLowerCase()}`}>
              {email.category}
            </span>
            {email.urgent_status && <span className="urgent-badge">URGENT</span>}
          </div>
          <div className="email-preview">{email.summary}</div>
        </div>
      ))}
    </div>
  );
};

export default EmailList;