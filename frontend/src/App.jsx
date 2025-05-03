import React, { useState, useEffect } from 'react';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import CategoryFilter from './components/CategoryFilter';
import ImportantEmails from './components/ImportantEmails';
import { 
  fetchCategories,
  fetchEmailsByCategory,
  fetchEmailById,
  updateImportancePrompt,
  addNewCategories,
  updateUrgentStatus
} from './api/emailService';
import './styles.css';

const API_URL = "http://localhost:3000"

function App() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [emails, setEmails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [importancePrompt, setImportancePrompt] = useState('');

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [cats, initialEmails] = await Promise.all([
          fetchCategories(),
          fetchEmailsByCategory('all')
        ]);
        setCategories(['all', ...cats]);
        setEmails(initialEmails);
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };
    initializeData();
  }, []);

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setSelectedEmail(null);
    try {
      const emails = await fetchEmailsByCategory(category);
      setEmails(emails);
    } catch (error) {
      console.error(`Failed to load ${category} emails:`, error);
    }
  };

  const handleSelectEmail = async (email) => {
    try {
      const freshEmail = await fetchEmailById(email.id);
      setSelectedEmail(freshEmail);
      setEmails(emails.map(e => 
        e.id === freshEmail.id ? { ...e, read_status: true } : e
      ));
    } catch (error) {
      console.error("Failed to load email details:", error);
      setSelectedEmail(email);
    }
  };

  const handleUpdateImportancePrompt = async (newPrompt) => {
    try {
      const updatedPrompt = await updateImportancePrompt(newPrompt);
      setImportancePrompt(updatedPrompt);
      const updatedEmails = await fetchEmailsByCategory(selectedCategory);
      setEmails(updatedEmails);
    } catch (error) {
      console.error("Failed to update prompt:", error);
    }
  };

  const handleAddCategories = async (newCategories) => {
    try {
      const updatedCategories = await addNewCategories(newCategories);
      setCategories(['all', ...updatedCategories]);
    } catch (error) {
      console.error("Failed to add categories:", error);
    }
  };

  const toggleUrgentStatus = async (emailId, currentStatus) => {
    try {
      await updateUrgentStatus(emailId, !currentStatus);
      setEmails(emails.map(email => 
        email.id === emailId 
          ? { ...email, urgent_status: !currentStatus } 
          : email
      ));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(prev => ({ ...prev, urgent_status: !currentStatus }));
      }
    } catch (error) {
      console.error("Failed to update urgent status:", error);
    }
  };

/*
  const getCategoryCounts = () => {
    const counts = { all: emails.length };
    categories.forEach(cat => {
      counts[cat] = emails.filter(e => 
        e.category.toLowerCase() === cat.toLowerCase()
      ).length;
    });
    counts.important = emails.filter(e => e.urgent_status).length;
    return counts;
  };
*/
  const filteredEmails = selectedCategory === 'all' 
  ? emails 
  : selectedCategory === 'important'
  ? emails.filter(e => e.urgent_status)
  : emails.filter(email => 
      email.category.toLowerCase() === selectedCategory.toLowerCase()
    );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Email Classifier</h1>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <CategoryFilter 
            categories={['all', ...categories]}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            //categoryCounts={getCategoryCounts()}
            importancePrompt={importancePrompt}
            onUpdateImportancePrompt={handleUpdateImportancePrompt}
            onAddCategories = {handleAddCategories}
          />
        </aside>
        <main className="email-content">
          <EmailList 
            emails={filteredEmails} 
            onSelectEmail={handleSelectEmail}
            selectedEmailId={selectedEmail?.id}
          />
          {selectedEmail && (
            <EmailDetail 
            email={selectedEmail} 
            onToggleUrgent = {toggleUrgentStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;