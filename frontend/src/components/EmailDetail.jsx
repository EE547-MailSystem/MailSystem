import React from 'react';
import { format } from 'date-fns';

const EmailDetail = ({ email }) => {
  return (
    <div className={`email-detail ${email.read_status ? 'read' : 'unread'}`}>
      <div className="email-detail-header">
        <div className="email-sender-detail">
          <div><strong>From:</strong> {email.from}</div>
          <div><strong>Subject:</strong> {email.subject}</div>
          <div><strong>Date:</strong> {format(new Date(), 'PPPpp')}</div>
          <div><strong>To:</strong> {email.to}</div>
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
    </div>
  );
};

export default EmailDetail;