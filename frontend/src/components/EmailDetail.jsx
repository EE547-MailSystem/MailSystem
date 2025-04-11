import React from 'react';
import { format } from 'date-fns';

const EmailDetail = ({ email }) => {
  return (
    <div className={`email-detail ${email.read ? 'read' : 'unread'}`}>
      <div className="email-detail-header">
      <h2 className={!email.read ? 'unread-subject' : ''}>{email.subject}</h2>
        <div className="email-meta">
          <div><strong>From:</strong> {email.sender}</div>
          <div><strong>Date:</strong> {format(new Date(email.date), 'PPPpp')}</div>
          <div>
            <span className={`category-badge ${email.category}`}>
              {email.category}
            </span>
            {email.important && <span className="important-badge">Important</span>}
          </div>
        </div>
      </div>
      <div 
        className="email-body" 
        dangerouslySetInnerHTML={{ __html: email.body }} 
      />
    </div>
  );
};

export default EmailDetail;