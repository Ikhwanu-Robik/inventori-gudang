'use client'

import React, { useState, useEffect, useRef } from 'react'
import { INITIAL_ITEMS, InventoryItem } from '@/lib/inventory'
import WarehouseBlueprint, { PinLocation } from './WarehouseBlueprint'
import Image from 'next/image'

export default function OutboundForm() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<PinLocation | null>(null)
  const [unit, setUnit] = useState('')
  const [outboundQuantity, setOutboundQuantity] = useState<number>(1)
  const [outboundNote, setOutboundNote] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter items for autocomplete
  const filteredItems = INITIAL_ITEMS.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setSearchTerm(item.itemName)
    setUnit(item.unit)
    setIsDropdownOpen(false)
    if (item.selectedLocation && item.selectedLocation.length > 0) {
      setSelectedLocation(item.selectedLocation[0])
    } else {
      setSelectedLocation(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem || !selectedLocation) return
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
    }, 4000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8 text-slate-100">
      {/* Form Header */}
      <div className="border-b border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Record Outbound Item Movement
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select an item to view its warehouse location markers and record outbound shipment details.
            </p>
          </div>
        </div>
      </div>

      {isSubmitted && (
        <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-300 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <span className="font-semibold block">Outbound Movement Recorded Successfully!</span>
            <span className="text-xs text-emerald-400/80">Stock dispatched from {selectedLocation?.blueprintName} with note: &quot;{outboundNote || 'N/A'}&quot;.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Searchbox with Autocomplete */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Item Name (Search & Autocomplete)
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setIsDropdownOpen(true)
                if (!e.target.value) {
                  setSelectedItem(null)
                  setSelectedLocation(null)
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Type to search inventory items (e.g., Hydraulic Pump)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
              required
            />
            <div className="absolute right-3 top-3.5 text-slate-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && filteredItems.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-2 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
              {filteredItems.map((item) => {
                const totalStock = item.selectedLocation?.reduce((sum, l) => sum + l.quantity, 0) || 0
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors flex items-center justify-between border-b border-slate-800 last:border-b-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.imagePreview ? (
                          <Image src={item.imagePreview} alt={item.itemName} fill className="object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-500">Img</span>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">{item.itemName}</span>
                        <span className="text-xs text-slate-400 font-mono">Stock: {totalStock} {item.unit}</span>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400 font-medium bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-800/50">
                      Select
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {selectedItem && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                ✓
              </div>
              <div>
                <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block">Selected Item</span>
                <span className="text-sm font-bold text-white">{selectedItem.itemName}</span>
              </div>
            </div>
            <span className="text-xs font-mono bg-indigo-950 text-indigo-200 border border-indigo-700/60 px-3 py-1 rounded">
              ID: {selectedItem.id}
            </span>
          </div>
        )}

        {/* Warehouse Blueprint Display (Display Only - Shows All Markers of Selected Item) */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Warehouse Blueprint Location Markers (Read-Only)
          </label>
          <WarehouseBlueprint
            selectedLocation={selectedItem?.selectedLocation || null}
            displayOnly={true}
          />
        </div>

        {/* Dispatch Location Selector */}
        {selectedItem && selectedItem.selectedLocation && selectedItem.selectedLocation.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Select Dispatch Location Marker
            </label>
            <select
              value={selectedLocation ? `${selectedLocation.blueprintId}-${selectedLocation.xPct}-${selectedLocation.yPct}` : ''}
              onChange={(e) => {
                const found = selectedItem.selectedLocation?.find(
                  (loc) => `${loc.blueprintId}-${loc.xPct}-${loc.yPct}` === e.target.value
                )
                if (found) {
                  setSelectedLocation(found)
                }
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none cursor-pointer"
            >
              {selectedItem.selectedLocation.map((loc, idx) => (
                <option key={idx} value={`${loc.blueprintId}-${loc.xPct}-${loc.yPct}`}>
                  {loc.blueprintName} — Coordinates ({loc.xPct}%, {loc.yPct}%) | Stock: {loc.quantity} {unit} {loc.note ? `(${loc.note})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity & Editable Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Outbound Quantity
            </label>
            <input
              type="number"
              min="1"
              max={selectedLocation?.quantity || 9999}
              value={outboundQuantity}
              onChange={(e) => setOutboundQuantity(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
              required
            />
            {selectedLocation && (
              <span className="text-[11px] text-slate-400 mt-1 block">
                Available at selected location ({selectedLocation.blueprintName}): <strong className="text-emerald-400">{selectedLocation.quantity} {unit}</strong>
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Unit (Editable)
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., pcs, boxes, plt"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
              required
            />
          </div>
        </div>

        {/* Outbound Note Input */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
            Outbound Note (`outbound_note`)
          </label>
          <textarea
            rows={3}
            value={outboundNote}
            onChange={(e) => setOutboundNote(e.target.value)}
            placeholder="Enter reason for outbound movement, destination, dispatch tracking number..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none resize-none"
          />
        </div>

        {/* Submit Button Bar */}
        <div className="border-t border-slate-800 pt-5 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400 hidden sm:block">
            {selectedItem && selectedLocation ? (
              <span className="text-emerald-400 font-medium">✓ Ready to record outbound movement</span>
            ) : (
              <span className="text-amber-400 font-medium">⚠ Please select an item and warehouse location marker</span>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedItem || !selectedLocation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:from-indigo-700 active:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-8 py-3 transition-all duration-150 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Record Outbound Movement
          </button>
        </div>
      </form>
    </div>
  )
}
