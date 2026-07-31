'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ItemCard from '@/components/ItemCard'
import { InventoryItem, INITIAL_ITEMS } from '@/lib/inventory'

export default function ItemsGridPage() {
  const [items] = useState<InventoryItem[]>(INITIAL_ITEMS)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = items.filter((item) => 
   item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              IG
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">Inventori Gudang</h1>
              <p className="text-[11px] text-slate-400">Warehouse Location Tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Dashboard Overview
            </Link>
            <Link
              href="/items/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 transition-all shadow-md shadow-indigo-600/20"
            >
              + Add New Item
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Page Title & Search Bar Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Inventory Catalog</h2>
            <p className="text-sm text-slate-400 mt-1">
              Browse warehouse items, check stock levels, and view assigned blueprint locations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory items..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Grid of Item Cards */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">No items found</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              No inventory items matched &quot;<span className="text-indigo-400">{searchQuery}</span>&quot;. Try searching for a different name.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Inventori Gudang System &copy; {new Date().getFullYear()} — Frontend Only Mode</p>
      </footer>
    </div>
  )
}
