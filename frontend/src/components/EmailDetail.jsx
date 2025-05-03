import React from 'react';
import { format } from 'date-fns';

const EmailDetail = ({ email, onToggleUrgent }) => {
  return (
    <div className={`email-detail ${email.read_status ? 'read' : 'unread'}`}>
      <div className="email-detail-header">
        <div className="email-sender-detail">
          <div><strong>From:</strong> {email.from}</div>
          <div><strong>Subject:</strong> {email.subject}</div>
          <div><strong>Date:</strong> {format(new Date(), 'PPPpp')}</div>
        </div>
        <div className="email-meta">
          <span className={`category-badge ${email.category.toLowerCase()}`}>
            {email.category}
          </span>
          {email.urgent_status && <span className="urgent-badge">URGENT</span>}
        </div>
        <div className="email-tags">
          {Array.from(email.tags).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="email-body">
        {email.body}
      </div>
      <button 
        onClick={() => onToggleUrgent(email.id, email.urgent_status)}
        className={email.urgent_status ? 'urgent-active' : ''}
      >
        {email.urgent_status ? '★ Urgent' : 'Mark as Urgent'}
      </button>
    </div>
  );
};

export default EmailDetail;