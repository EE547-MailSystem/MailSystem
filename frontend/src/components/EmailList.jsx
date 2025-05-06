import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const EmailList = ({ emails, onSelectEmail, selectedEmailId }) => {
  const sortedEmails = [...emails].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const getCategoryColor = (category) => {
    const colors = {
      work: { background: '#1E88E5', text: 'white' },       
      finance: { background: '#43A047', text: 'white' },    
      social: { background: '#8E24AA', text: 'white' },     
      promotions: { background: '#FB8C00', text: 'white' }, 
      spam: { background: '#E53935', text: 'white' },
      personal: { background: '#00ACC1', text: 'white' },
      travel: { background: '#7CB342', text: 'white' },
      news: { background: '#283593', text: 'white' },       
      default: { background: '#424242', text: 'white' }     
    };
  
    return colors[category?.toLowerCase()] || colors.default;
  };

  return (
    <div className="email-list">
      {sortedEmails.map((email) => (
        <div 
          key = {email.email_id}
          className={`email-item ${email.read_status ? 'read' : 'unread'} ${
            selectedEmailId === email.from_email + email.email_subject ? 'selected' : ''
          }`}
          onClick={() => onSelectEmail(email)}
        >
          <div className="email-sender">
            <div className="email-sender">{email.from_email}</div>
          </div>

          <div className="email-subject">
            <div className="email-subject">{email.email_subject}</div>
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
              {formatDistanceToNow(new Date(email.timestamp), { 
                addSuffix: true 
              })}
            </span>
            <span 
              className={`category-badge ${email.category.toLowerCase()}`}
              style={{ 
                backgroundColor: getCategoryColor(email.category),
                marginLeft: '8px'
              }}
            >
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