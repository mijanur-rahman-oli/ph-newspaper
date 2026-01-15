'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '../../lib/utils/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    const cleanPath = pathname.replace(/\/$/, '');
    const cleanHref = href.replace(/\/$/, '');

    if (cleanHref === '/news') {
      return cleanPath === '' || cleanPath === '/news';
    }

    return cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Thin top info bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1480px] mx-auto px-5 lg:px-8">
          <div className="flex justify-between items-center text-xs text-gray-600 py-1.5">
            <div>
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="hidden sm:block">
              <span className="text-gray-500">Bangladesh • Latest updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1480px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#004488]">
              <span className="text-[#CC0000]">P</span>H
            </div>
            <div className="hidden sm:block">
              <div className="font-serif text-xl font-bold tracking-wide text-gray-900 group-hover:text-[#004488] transition-colors">
                Newspaper
              </div>
              <div className="text-[11px] text-gray-500 -mt-1 font-medium tracking-wider uppercase">
                Bangladesh
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/news"
              className={`px-3 xl:px-4 py-2 text-sm font-medium rounded transition-colors ${
                isActive('/news')
                  ? 'text-white bg-[#004488]'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>

            {CATEGORIES.slice(0, 7).map((category) => (  // Reduced to 7 to make space
              <Link
                key={category}
                href={`/news/${category.toLowerCase()}`}
                className={`px-3 xl:px-4 py-2 text-sm font-medium rounded transition-colors ${
                  isActive(`/news/${category.toLowerCase()}`)
                    ? 'text-white bg-[#004488]'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                {category}
              </Link>
            ))}

            {/* Sara Desh Map Link - Added here */}
            <Link
              href="/saradesh"
              className={`px-3 xl:px-4 py-2 text-sm font-medium rounded transition-colors flex items-center gap-1.5 ${
                isActive('/saradesh')
                  ? 'text-white bg-[#004488]'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Sara Desh</span>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 text-gray-700 hover:text-[#004488]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="max-w-[1480px] mx-auto px-5 py-6">
            <nav className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                href="/news"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive('/news')
                    ? 'bg-[#004488] text-white'
                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>

              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/news/${category.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive(`/news/${category.toLowerCase()}`)
                      ? 'bg-[#004488] text-white'
                      : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </Link>
              ))}

              {/* Sara Desh Map in Mobile Menu - Added here */}
              <Link
                href="/saradesh"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium rounded-lg flex items-center gap-2 col-span-2 sm:col-span-1 ${
                  isActive('/saradesh')
                    ? 'bg-[#004488] text-white'
                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Sara Desh</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}