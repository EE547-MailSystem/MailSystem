import React, { useState } from 'react';

const EditCategoryPage = ({
  importancePrompt,
  onUpdateImportancePrompt,
  onAddCategories,
  onBack
}) => {
  const [prompt, setPrompt] = useState(importancePrompt);
  const [isEditing, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    onUpdateImportancePrompt(prompt);
    setIsEditing(false);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      await onAddCategories([newCategory.trim()]);
      setNewCategory('');
    }
  };

  return (
    <div className="edit-category-page">
      <button onClick={onBack} className="back-button">
        ← Back to List
      </button>
      
      <div className="edit-section">
        <h2>Edit Importance Rules</h2>
        {isEditing ? (
          <form onSubmit={handlePromptSubmit} className="prompt-form">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Define what makes an email important..."
            />
            <div className="form-actions">
              <button type="submit" className="save-button">Save</button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div 
            className="prompt-display" 
            onClick={() => setIsEditing(true)}
          >
            {importancePrompt || "Click to set importance rules..."}
          </div>
        )}
      </div>

      <div className="edit-section">
        <h2>Add New Category</h2>
        <div className="add-category-form">
          <input 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <button 
            onClick={handleAddCategory}
            className="add-button"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage;