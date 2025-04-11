import React, { useState } from 'react';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import CategoryFilter from './components/CategoryFilter';
import ImportantEmails from './components/ImportantEmails';
import { mockEmails, categories, importancePrompt} from './data/mockEmails';
import './styles.css';

function App() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [emails, setEmails] = useState(mockEmails);
  const [importancePrompt, setImportancePrompt] = useState(
    "Mark as important if: contains urgent action items, from company executives, or related to critical projects"
  );

  const filteredEmails = selectedCategory === 'all' 
    ? emails 
    : selectedCategory === '_important'
      ? emails.filter(e => e.important)
      : emails.filter(email => email.category === selectedCategory);


  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedEmail(null); // Clear selected email when changing category
  };

  const markAsRead = (emailId) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const handleUpdateImportancePrompt = (newPrompt) => {
    setImportancePrompt(newPrompt);
    // Here send to backend
    console.log("Sending to backend:", newPrompt);
  };

  const getCategoryCounts = () => {
    const counts = {};
    categories.forEach(category => {
      if (category === 'all') {
        counts[category] = emails.length;
      } else {
        counts[category] = emails.filter(email => email.category === category).length;
      }
    });
    counts._important = counts.important;
    counts.important = emails.filter(e => e.important).length;
    return counts;
  };
  
  const categoryCounts = getCategoryCounts();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Email Classifier</h1>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categoryCounts={categoryCounts}
            emails={emails}
            onSelectEmail={setSelectedEmail}
            onUpdateImportancePrompt={handleUpdateImportancePrompt}
          />
        </aside>
        <main className="email-content">
          <EmailList 
            emails={filteredEmails} 
            onSelectEmail={(email) => {
              setSelectedEmail(email);
              if (!email.read) markAsRead(email.id);
            }}
            selectedEmailId={selectedEmail?.id}
          />
          {selectedEmail && (
            <EmailDetail email={selectedEmail} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;