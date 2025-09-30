import { useState } from 'react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search posts by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              aria-label="Clear search"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          <HiMagnifyingGlass className="w-4 h-4" />
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;