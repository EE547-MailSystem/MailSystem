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
  ? emails.filter(e => e.urgent_status)
  : emails.filter(email => 
      email.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedEmail(null); // Clear selected email when changing category
  };

  const markAsRead = (emailId) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  // related to backend
  const handleUpdateImportancePrompt = async (newPrompt) => {
    try {
      const response = await fetch(`${API_URL}/importance-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: newPrompt,
          //update
          user_email: "user@example.com" 
        }),
      });
      
      if (response.ok) {
        const updatedEmails = await response.json();
        setEmails(updatedEmails);
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

const API_URL = "http://localhost:3000"

const fetchEmailById = async (emailId) => {
  try {
    const response = await fetch(`${API_URL}/emails/1`);
    const data = await response.json();
    console.log(data);
    if (response.status === 404) {
      console.warn(`Email with ID ${emailId} not found`);
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const emailData = await response.json();
    return emailData;
  } catch (error) {
    console.error("Error fetching email:", error);
    return null;
  }
};

const handleSelectEmail = async (email) => {
  //const localEmail = emails.find(e => e.id === email.id);
  //if (localEmail?.read_status) {
  //  setSelectedEmail(localEmail);
  //  return;
  //}
  const freshEmail = await fetchEmailById(email.id);
  
  if (freshEmail) {
    setEmails(emails.map(e => 
      e.id === freshEmail.id ? freshEmail : e
    ));
    setSelectedEmail(freshEmail);


  } else {
    setSelectedEmail(email);
  }
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
            //onSelectEmail={setSelectedEmail}
            onSelectEmail={fetchEmailById}
            onUpdateImportancePrompt={handleUpdateImportancePrompt}
          />
        </aside>
        <main className="email-content">
          <EmailList 
            emails={filteredEmails} 
            onSelectEmail={handleSelectEmail}
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