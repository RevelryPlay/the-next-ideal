import React, { useState, useEffect } from 'react';
import Episode from './Episode';
import {defaultPreferences} from "../config.js";

const PER_PAGE_OPTIONS = [5, 10, 25, 50];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

export default function Feed() {
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPreferences.itemsPerPage);
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    async function fetchFeed() {
      try {
        const response = await fetch('/api/feed');

        if (!response.ok) {
          throw new Error('Failed to fetch feed');
        }

        const data = await response.json();
        setFeed(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, []);

  // Reset to page 1 when perPage or sortOrder changes
  useEffect(() => {
    setCurrentPage(1);
  }, [perPage, sortOrder]);

  if (loading) {
    return <div className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold p-8 text-center text-kholin-blue dark:text-stone">Loading episodes...</div>;
  }

  if (error) {
    return <div className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold p-8 text-center text-red-700 dark:text-red-400">Error: {error}</div>;
  }

  if (!feed || !feed.items?.length) {
    return <div className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold p-8 text-center text-kholin-blue dark:text-stone">No episodes found</div>;
  }

  // Sort items based on sortOrder
  const sortedItems = [...feed.items].sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <section className="bg-[var(--bg-secondary)] rounded-lg shadow-sm border-2 border-stone-border dark:border-stormlight-gold p-8 mb-24">
      <h2 className="mb-4 text-kholin-blue dark:text-accent-light">Episodes</h2>
      {feed.description && (
        <p className="text-kholin-blue/70 dark:text-stone/70 mb-6 pb-6 border-b border-stone-border dark:border-stone/20">{feed.description}</p>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center py-4 mb-4 border-b border-stone-border dark:border-stone/20 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="sortOrder" className="text-sm text-kholin-blue/70 dark:text-stone/70">Sort:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortChange}
            className="px-3 py-2 border-2 border-stone-border dark:border-stone/30 rounded text-sm bg-white dark:bg-midnight dark:text-stone cursor-pointer focus:outline-none focus:border-stormlight-gold"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-kholin-blue/70 dark:text-stone/70">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} episodes
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="perPage" className="text-sm text-kholin-blue/70 dark:text-stone/70">Per page:</label>
              <select
                id="perPage"
                value={perPage}
                onChange={handlePerPageChange}
                className="px-3 py-2 border-2 border-stone-border dark:border-stone/30 rounded text-sm bg-white dark:bg-midnight dark:text-stone cursor-pointer focus:outline-none focus:border-stormlight-gold"
              >
                {PER_PAGE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {currentItems.map((item, index) => (
          <Episode key={item.link || startIndex + index} {...item} />
        ))}
      </div>

      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex justify-center items-center gap-1 mt-6 pt-6 border-t border-stone-border dark:border-stone/20">
          <button
            className="min-w-[36px] h-9 px-2 border-2 border-stone-border dark:border-stone/30 rounded bg-white dark:bg-midnight text-kholin-blue dark:text-stone text-sm cursor-pointer transition-all flex items-center justify-center hover:bg-stone dark:hover:bg-midnight/80 hover:border-stormlight-gold disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            &laquo;
          </button>
          <button
            className="min-w-[36px] h-9 px-2 border-2 border-stone-border dark:border-stone/30 rounded bg-white dark:bg-midnight text-kholin-blue dark:text-stone text-sm cursor-pointer transition-all flex items-center justify-center hover:bg-stone dark:hover:bg-midnight/80 hover:border-stormlight-gold disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            &lsaquo;
          </button>

          <div className="flex items-center gap-1">
            {/* Show page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first, last, current, and pages around current
                return page === 1 ||
                       page === totalPages ||
                       Math.abs(page - currentPage) <= 1;
              })
              .reduce((acc, page, idx, arr) => {
                // Add ellipsis between non-consecutive pages
                if (idx > 0 && page - arr[idx - 1] > 1) {
                  acc.push(<span key={`ellipsis-${page}`} className="px-2 text-kholin-blue/50 dark:text-stone/50">...</span>);
                }
                acc.push(
                  <button
                    key={page}
                    className={`min-w-[36px] h-9 px-2 border-2 rounded text-sm cursor-pointer transition-all flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-kholin-blue border-kholin-blue text-stone dark:bg-stormlight-gold dark:border-stormlight-gold dark:text-midnight'
                        : 'border-stone-border dark:border-stone/30 bg-white dark:bg-midnight text-kholin-blue dark:text-stone hover:bg-stone dark:hover:bg-midnight/80 hover:border-stormlight-gold'
                    }`}
                    onClick={() => goToPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
                return acc;
              }, [])}
          </div>

          <button
            className="min-w-[36px] h-9 px-2 border-2 border-stone-border dark:border-stone/30 rounded bg-white dark:bg-midnight text-kholin-blue dark:text-stone text-sm cursor-pointer transition-all flex items-center justify-center hover:bg-stone dark:hover:bg-midnight/80 hover:border-stormlight-gold disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            &rsaquo;
          </button>
          <button
            className="min-w-[36px] h-9 px-2 border-2 border-stone-border dark:border-stone/30 rounded bg-white dark:bg-midnight text-kholin-blue dark:text-stone text-sm cursor-pointer transition-all flex items-center justify-center hover:bg-stone dark:hover:bg-midnight/80 hover:border-stormlight-gold disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            &raquo;
          </button>
        </nav>
      )}
    </section>
  );
}
