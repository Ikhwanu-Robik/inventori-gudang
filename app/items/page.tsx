'use client'

import { useState, useEffect } from 'react'
import ItemCard from '@/components/ItemCard'
import { InventoryItem } from '@/lib/inventory'

export default function ItemsGridPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    const fetchItems = async () => {
      try {
        const url = searchQuery.trim()
          ? `/api/items?q=${encodeURIComponent(searchQuery.trim())}`
          : '/api/items'
        const res = await fetch(url)
        const json = await res.json()

        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to load catalog items')
        }

        if (isMounted) {
          setItems(json.data || [])
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Error loading catalog'
          setError(msg)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const timer = setTimeout(() => {
      fetchItems()
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchQuery])

  return (
    <div className="flex-1 flex flex-col font-sans">
      {/* Main Content Area */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Title & Search Bar Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory Catalog</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Browse warehouse items, check stock levels, and view assigned blueprint locations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory items..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 p-4 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
            <span>⚠ {error}</span>
            <button
              type="button"
              onClick={() => setSearchQuery(searchQuery)}
              className="bg-rose-200 dark:bg-rose-900/60 hover:bg-rose-300 dark:hover:bg-rose-800 text-rose-900 dark:text-rose-100 px-2.5 py-1 rounded font-medium cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid / Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 space-y-4 animate-pulse"
              >
                <div className="w-full h-40 bg-slate-200 dark:bg-slate-800/60 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800/80 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800/50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">No items found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm">
              {searchQuery ? (
                <>No inventory items matched &quot;<span className="text-indigo-600 dark:text-indigo-400 font-semibold">{searchQuery}</span>&quot;. Try searching for a different name.</>
              ) : (
                'No inventory items have been created in the database yet.'
              )}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Inventori Gudang System &copy; {new Date().getFullYear()} — Live Database Connected</p>
      </footer>
    </div>
  )
}

