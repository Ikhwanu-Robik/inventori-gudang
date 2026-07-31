'use client'

import React, { useState } from 'react'
import WarehouseBlueprint, { PinLocation } from '@/components/WarehouseBlueprint'
import { InventoryItem } from '@/lib/inventory'
import Image from 'next/image'
import Link from 'next/link'

interface ItemDetailsClientProps {
  item: InventoryItem
}

export default function ItemDetailsClient({ item }: ItemDetailsClientProps) {
  const [selectedLocation, setSelectedLocation] = useState<PinLocation[]>(item.selectedLocation || [])

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
              href="/items"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ← Back to Catalog
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/items"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Inventory Catalog
          </Link>
          <span className="font-mono text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            ID: {item.id}
          </span>
        </div>

        {/* Item Header & Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          {/* Image Container (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner flex items-center justify-center">
              {item.imagePreview ? (
                <Image
                  src={item.imagePreview}
                  alt={item.itemName}
                  fill
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/80 text-slate-600">
                  <svg
                    className="w-16 h-16 mb-3 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs text-slate-500">No Image Available</span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block uppercase tracking-wider">Current Stock</span>
                <span className="text-lg font-bold text-white">
                  {item.quantity} <span className="text-indigo-400 font-medium text-sm">{item.unit}</span>
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                {item.quantity}
              </div>
            </div>
          </div>

          {/* Item Description & Metadata (Col 6-12) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  Active Inventory Item
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {item.itemName}
              </h2>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Storage Note & Description
                  </h3>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300 leading-relaxed">
                    {item.note || 'No additional storage notes or instructions provided for this item.'}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Assigned Location Details ({selectedLocation.length})
                  </h3>
                  {selectedLocation.length === 0 ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-400">
                      Unassigned Location - Not mapped to any warehouse zone
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedLocation.map((loc, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-white block">
                                {loc.blueprintName}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">
                                Zone ID: {loc.blueprintId}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block uppercase font-mono">Coordinates</span>
                            <span className="text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/50 px-2.5 py-1 rounded">
                              X: {loc.xPct}% | Y: {loc.yPct}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <Link
                href="/items"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 transition-all shadow-md shadow-indigo-600/25"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Warehouse Blueprint Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Warehouse Floorplan & Pin Location</h3>
              <p className="text-xs text-slate-400">
                Visualizing item location on the warehouse zone blueprint. Click to update pin location.
              </p>
            </div>
          </div>

          <WarehouseBlueprint
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation([...selectedLocation, loc])}
            displayOnly={true}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Inventori Gudang System &copy; {new Date().getFullYear()} — Frontend Only Mode</p>
      </footer>
    </div>
  )
}
