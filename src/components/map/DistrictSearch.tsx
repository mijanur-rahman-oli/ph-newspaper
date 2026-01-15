'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../../lib/data/districts';

interface DistrictSearchProps {
  onDistrictSelect: (district: string, coordinates: [number, number]) => void;
}

export default function DistrictSearch({ onDistrictSelect }: DistrictSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState(BANGLADESH_DISTRICTS);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredDistricts(BANGLADESH_DISTRICTS);
    } else {
      const filtered = BANGLADESH_DISTRICTS.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.division.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDistricts(filtered);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (district: typeof BANGLADESH_DISTRICTS[0]) => {
    onDistrictSelect(district.name, district.coordinates);
    setQuery(district.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a district..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && filteredDistricts.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {filteredDistricts.map((district) => (
            <button
              key={district.name}
              onClick={() => handleSelect(district)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900">{district.name}</div>
              <div className="text-sm text-gray-500">{district.division} Division</div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && filteredDistricts.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500"
        >
          No districts found matching "{query}"
        </div>
      )}
    </div>
  );
}