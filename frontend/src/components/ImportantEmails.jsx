import React from 'react';

const ImportantEmails = ({ emails, onSelectEmail }) => {
  const importantEmails = emails.filter(email => email.important);
  
  return (
    <div className="important-emails-section">
      <h4>Important Emails ({importantEmails.length})</h4>
      <div className="important-emails-list">
        {importantEmails.map(email => (
          <div 
            key={email.id}
            className="important-email-item"
            onClick={() => onSelectEmail(email)}
          >
            <span className="important-email-sender">{email.sender}</span>
            <span className="important-email-subject">{email.subject}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportantEmails;