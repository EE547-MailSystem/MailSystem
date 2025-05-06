import React, { useState } from 'react';

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  categoryCounts,
  importancePrompt,
  onUpdateImportancePrompt,
  onAddCategories 
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

  const displayCategories = categories.filter(
    (cat, index) => categories.indexOf(cat) === index
  );

  return (
    <div className="category-filter">
      <h3>Categories</h3>
      <ul>
        {displayCategories.map((category) => (
          <li 
            key={category}
            className={`${selectedCategory === category || 
              (category === 'all' && selectedCategory === '_important') ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            <div className="category-name">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
            <span className="category-count">
              {categoryCounts[category] || 0}
            </span>
          </li>
        ))}
      </ul>
      <div className="important-emails-section">
        <h4 
          onClick={() => onCategoryChange('_important')}
          className={`important-header ${
            selectedCategory === '_important' ? 'important-active' : ''
          }`}
        >
          Important Emails ({categoryCounts.important || 0})
        </h4>
      </div>

      <div className="importance-prompt-section">
        <h4>Importance Rules</h4>
        {isEditing ? (
          <form onSubmit={handlePromptSubmit}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Define what makes an email important..."
            />
            <div className="prompt-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="prompt-display" onClick={() => setIsEditing(true)}>
            {importancePrompt || "Click to set importance rules..."}
          </div>
        )}
      </div>

      <div className="add-category">
        <input 
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
        />
        <button onClick={handleAddCategory}>Add</button>
      </div>
    </div>
  );
};

export default CategoryFilter;