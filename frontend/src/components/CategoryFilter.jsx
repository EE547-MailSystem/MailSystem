import React from 'react';

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  categoryCounts,
  onNavigateToEdit
}) => {
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

      <button 
        onClick={onNavigateToEdit}
        className="edit-categories-button"
      >
        Edit Categories & Rules
      </button>
    </div>
  );
};

export default CategoryFilter;