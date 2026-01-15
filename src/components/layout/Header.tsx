'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, Menu, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '../../lib/utils/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/news' && pathname === '/') return true;
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/saradesh" className="hover:text-blue-200 transition-colors flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                সারা দেশ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Newspaper className="w-8 h-8" />
            <span className="hidden sm:inline">PH Newspaper</span>
            <span className="sm:hidden">PH</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/news"
              className={`font-medium transition-colors ${
                isActive('/news') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            
            {CATEGORIES.slice(0, 6).map((category) => (
              <Link
                key={category}
                href={`/news/${category.toLowerCase()}`}
                className={`font-medium transition-colors ${
                  isActive(`/news/${category.toLowerCase()}`)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {category}
              </Link>
            ))}

            <Link
              href="/saradesh"
              className={`font-medium transition-colors flex items-center gap-1 ${
                isActive('/saradesh') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Map
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-3">
              <Link
                href="/news"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded ${
                  isActive('/news') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                Home
              </Link>
              
              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/news/${category.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded ${
                    isActive(`/news/${category.toLowerCase()}`)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700'
                  }`}
                >
                  {category}
                </Link>
              ))}

              <Link
                href="/saradesh"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  isActive('/saradesh') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Sara Desh Map
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}