import React, { useState, useEffect } from 'react';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import CategoryFilter from './components/CategoryFilter';
import EditCategoryPage from './components/EditCategoryPage';
import { 
  fetchCategories,
  fetchEmailsByCategory,
  fetchEmailById,
  updateImportancePrompt,
  addNewCategories,
  updateUrgentStatus,
  updateReadStatus
} from './api/emailService';
import './styles.css';

const API_URL = "http://localhost:3000"
//const API_URL = "http://18.224.100.253:8080"

function App() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [importancePrompt, setImportancePrompt] = useState('');
  const [allEmails, setAllEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [showEmailList, setShowEmailList] = useState(true);
  const [showEditPage, setShowEditPage] = useState(false);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("init the data, ", new Date());
        const [cats, initialEmails] = await Promise.all([
          fetchCategories(),
          fetchEmailsByCategory('all')
        ]);
        console.log("already init the data, the category is: ", cats, " :", new Date());
        console.log("the email: ", initialEmails);
        const uniqueCategories = ['all', ...new Set(cats)];
        setCategories(uniqueCategories);
        setAllEmails(initialEmails); 
        setFilteredEmails(initialEmails); 
      } catch (error) {
        console.error("Initialization failed:", error);
      } 
      // finally {
      //   // 数据拿完了，无论成功失败，都结束 loading
      //   setLoading(false);
      // }
    };
    initializeData();
  }, []);

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setSelectedEmail(null);
    try {
      if (category === 'all') {
        setFilteredEmails(allEmails);
      } else if (category === '_important') {
        setFilteredEmails(allEmails.filter(e => e.urgent_status));
      } else {
        setFilteredEmails(
          allEmails.filter(e => 
            e.category?.toLowerCase() === category.toLowerCase()
          )
        );
      }
    } catch (error) {
      console.error(`Failed to load ${category} emails:`, error);
    }
  };

  const handleSelectEmail = async (email) => {
    try {
      console.log("Select Email, email: ", email);
      console.log("Select Email, email id: ", email.email_id);
      const freshEmail = await fetchEmailById(email.email_id);
      console.log("freshEmail: ", freshEmail);
      setSelectedEmail(freshEmail);
      setShowEmailList(false);
      await updateReadStatus(email.email_id, true);
      setAllEmails(allEmails.map(e => 
        e.email_id === freshEmail.email_id ? { ...e, read_status: true } : e
      ));
      setFilteredEmails(filteredEmails.map(e => 
        e.email_id === freshEmail.email_id ? { ...e, read_status: true } : e
      ));
    } catch (error) {
      console.error("Failed to load email details:", error);
      setSelectedEmail(email);
    }
  };

  const handleBackToList = () => {
    setShowEditPage(false);
    setShowEmailList(true);
    setSelectedEmail(null);
  };

  const handleNavigateToEdit = () => {
    setShowEditPage(true);
    setShowEmailList(false);
  };

  const handleUpdateImportancePrompt = async (newPrompt) => {
    try {
      const updatedPrompt = await updateImportancePrompt(newPrompt);
      setImportancePrompt(updatedPrompt);
      const updatedEmails = await fetchEmailsByCategory(selectedCategory);
      setAllEmails(updatedEmails);
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
      setAllEmails(allEmails.map(email => 
        email.email_id === emailId 
          ? { ...email, urgent_status: !currentStatus } 
          : email
      ));
      setFilteredEmails(filteredEmails.map(email => 
        email.email_id === emailId 
          ? { ...email, urgent_status: !currentStatus } 
          : email
      ));
      if (selectedEmail?.email_id === emailId) {
        setSelectedEmail(prev => ({ ...prev, urgent_status: !currentStatus }));
      }
    } catch (error) {
      console.error("Failed to update urgent status:", error);
    }
  };

  const getCategoryCounts = () => {
    const counts = { all: allEmails.length };
    console.log("getCategory Function, the counts: ", counts)

    categories.filter(cat => cat !== 'all').forEach(cat => {
      console.log("current category is ", cat);
      if(cat.toLowerCase() != "all"){
        console.log("the emails data is: ", allEmails);

        allEmails.forEach(e => {
          if (e.category == null) {
            console.warn("email item missing category:", e);
          }
          if (cat == null) {
            console.warn("categories array contains undefined:", categories);
          }
        });

        counts[cat] = allEmails.filter(e => 
          e.category?.toLowerCase() === cat.toLowerCase()
        ).length;
      }
    });
    counts.important = allEmails.filter(e => e.urgent_status).length;
    return counts;
  };

  // if (loading) {
  //   return (
  //     <div className="loading-container">
  //       <p>Loading…</p>
  //     </div>
  //   );
  // }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-container">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22 8V16C22 17.1 21.1 18 20 18H6L2 22V4C2 2.9 2.9 2 4 2H20C21.1 2 22 2.9 22 4V8M20 8V4H4V17.2L5.2 16H20V8M7 9H9V11H7V9M11 9H13V11H11V9M15 9H17V11H15V9Z" />
            </svg>
            <h1 className="app-title">Email<span className="title-highlight">Classifier</span></h1>
          </div>
          <div className="header-actions">
            <button className="header-button">
              <svg className="icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <CategoryFilter 
            categories={['all', ...categories]}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categoryCounts={getCategoryCounts()}
            importancePrompt={importancePrompt}
            onNavigateToEdit={handleNavigateToEdit}
            //onUpdateImportancePrompt={handleUpdateImportancePrompt}
            //onAddCategories = {handleAddCategories}
          />
        </aside>
        <main className="email-content">
        {showEditPage ? (
            <EditCategoryPage
              importancePrompt={importancePrompt}
              onUpdateImportancePrompt={handleUpdateImportancePrompt}
              onAddCategories={handleAddCategories}
              onBack={handleBackToList}
            />
          ) : showEmailList ? (
            <EmailList 
              emails={filteredEmails} 
              onSelectEmail={handleSelectEmail}
              selectedEmailId={selectedEmail?.email_id}
            />
          ) : (
            <div className="email-detail-container">
              <button onClick={handleBackToList} className="back-button">
                ← Back to List
              </button>
              {selectedEmail && (
                <EmailDetail 
                  email={selectedEmail} 
                  onToggleUrgent={toggleUrgentStatus}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;