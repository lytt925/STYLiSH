import React, { useState, useRef } from 'react';
import SearchImage from '../../../assets/img/search.png';
import SearchImageHover from '../../../assets/img/search-hover.png';
import { useNavigate } from 'react-router-dom';

function SearchInput() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null)
  const navigate = useNavigate();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.keyCode !== 229) {
      performSearch();
    }
  };

  const performSearch = () => {
    navigate(`search/?q=${encodeURIComponent(query)}`)
  };


  return (
    <div className='relative'>
      <input
        ref={ref}
        type="text"
        placeholder="搜索"
        className="px-6 py-1 border rounded-full focus:outline-none w-[218px] h-[44px] placeholder-[#8B572A]"
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{ fontSize: '20px' }}
      />
      <img
        src={isSearchFocused ? SearchImageHover : SearchImage}
        onClick={performSearch}
        alt="Search"
        className="h-10 w-10 absolute right-2 top-1/2 transform -translate-y-1/2" />
    </div>
  );
}

export default SearchInput;
