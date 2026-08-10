'use client'

import React, { useState, useEffect, useRef } from 'react'
import { InventoryItem } from '@/lib/inventory'
import WarehouseBlueprint, { PinLocation } from './WarehouseBlueprint'
import Image from 'next/image'

export default function OutboundForm() {
  // Live Items & Form State
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<PinLocation | null>(null)
  const [unit, setUnit] = useState('')
  const [outboundQuantity, setOutboundQuantity] = useState<number>(1)
  const [outboundNote, setOutboundNote] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // API Submission & Alert States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [lastDispatchedInfo, setLastDispatchedInfo] = useState<{
    itemName: string
    locationName: string
    quantity: number
    unit: string
    note: string
  } | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch all items on mount for autocomplete
  useEffect(() => {
    let isMounted = true
    const loadItems = async () => {
      try {
        setIsLoadingItems(true)
        const res = await fetch('/api/items')
        const json = await res.json()
        if (res.ok && json.success && isMounted) {
          setItems(json.data || [])
        }
      } catch {
        // Silently handle load error
      } finally {
        if (isMounted) setIsLoadingItems(false)
      }
    }
    loadItems()
    return () => {
      isMounted = false
    }
  }, [])

  // Filter items for autocomplete
  const filteredItems = items.filter((item) =>
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

  // Handle Form Submit to Backend API
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    if (!selectedItem || !selectedLocation) {
      setSubmitError('Please select an item and a warehouse location marker')
      return
    }

    if (outboundQuantity <= 0) {
      setSubmitError('Outbound quantity must be greater than zero')
      return
    }

    if (outboundQuantity > selectedLocation.quantity) {
      setSubmitError(
        `Outbound quantity (${outboundQuantity}) exceeds available stock (${selectedLocation.quantity} ${unit}) at this location`
      )
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/items/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItem.id,
          blueprintId: selectedLocation.blueprintId,
          xPct: selectedLocation.xPct,
          yPct: selectedLocation.yPct,
          quantity: outboundQuantity,
          unit: unit || selectedItem.unit,
          outboundNote: outboundNote.trim() || null,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to record outbound movement')
      }

      setSubmitSuccess(true)
      setLastDispatchedInfo({
        itemName: selectedItem.itemName,
        locationName: selectedLocation.blueprintName,
        quantity: outboundQuantity,
        unit: unit || selectedItem.unit,
        note: outboundNote.trim() || 'N/A',
      })

      // Reset form state & refetch items to update stock levels
      setSearchTerm('')
      setSelectedItem(null)
      setSelectedLocation(null)
      setOutboundQuantity(1)
      setOutboundNote('')
      setUnit('')

      // Refetch items list to reflect updated stock in autocomplete
      const refetchRes = await fetch('/api/items')
      const refetchJson = await refetchRes.json()
      if (refetchRes.ok && refetchJson.success) {
        setItems(refetchJson.data || [])
      }

      setTimeout(() => {
        setSubmitSuccess(false)
      }, 6000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error recording outbound movement'
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur-xl shadow-xl dark:shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Form Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Record Outbound Item Movement
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Select an item to view its warehouse location markers and record outbound shipment details.
            </p>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {submitSuccess && lastDispatchedInfo && (
        <div className="mb-6 rounded-xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-800 dark:text-emerald-300 text-sm flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <span className="font-semibold block">Outbound Movement Recorded Successfully!</span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400/80">
                Dispatched {lastDispatchedInfo.quantity} {lastDispatchedInfo.unit} of &quot;{lastDispatchedInfo.itemName}&quot; from {lastDispatchedInfo.locationName} (Note: &quot;{lastDispatchedInfo.note}&quot;).
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="text-xs bg-emerald-200 dark:bg-emerald-900/60 hover:bg-emerald-300 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-200 px-2.5 py-1 rounded font-medium cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="mb-6 rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 p-4 text-rose-800 dark:text-rose-200 text-sm flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-semibold block">Failed to Record Outbound Movement</span>
              <span className="text-xs text-rose-700 dark:text-rose-300/80">{submitError}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmitError(null)}
            className="text-xs bg-rose-200 dark:bg-rose-900/60 hover:bg-rose-300 dark:hover:bg-rose-800 text-rose-900 dark:text-rose-200 px-2.5 py-1 rounded font-medium cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Searchbox with Autocomplete */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
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
              placeholder={isLoadingItems ? 'Loading inventory items from database...' : 'Type to search inventory items (e.g., Hydraulic Pump)...'}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
              required
            />
            <div className="absolute right-3 top-3.5 text-slate-400 pointer-events-none">
              {isLoadingItems ? (
                <span className="inline-block h-4 w-4 rounded-full border-2 border-indigo-500 dark:border-indigo-400 border-t-transparent animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && filteredItems.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
              {filteredItems.map((item) => {
                const totalStock = item.selectedLocation?.reduce((sum, l) => sum + l.quantity, 0) || 0
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-b-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.imagePreview ? (
                          <Image src={item.imagePreview} alt={item.itemName} fill className="object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Img</span>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white block">{item.itemName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Stock: {totalStock} {item.unit}</span>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-200 dark:border-indigo-800/50">
                      Select
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {selectedItem && (
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                ✓
              </div>
              <div>
                <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold uppercase tracking-wider block">Selected Item</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedItem.itemName}</span>
              </div>
            </div>
            <span className="text-xs font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700/60 px-3 py-1 rounded">
              ID: {selectedItem.id}
            </span>
          </div>
        )}

        {/* Warehouse Blueprint Display (Display Only - Shows All Markers of Selected Item) */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
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
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
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
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none cursor-pointer"
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
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              Outbound Quantity
            </label>
            <input
              type="number"
              min="1"
              max={selectedLocation?.quantity || 9999}
              value={outboundQuantity}
              onChange={(e) => setOutboundQuantity(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
              required
            />
            {selectedLocation && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Available at selected location ({selectedLocation.blueprintName}): <strong className="text-emerald-600 dark:text-emerald-400">{selectedLocation.quantity} {unit}</strong>
              </span>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              Unit (Editable)
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., pcs, boxes, plt"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
              required
            />
          </div>
        </div>

        {/* Outbound Note Input */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
            Outbound Note (`outbound_note`)
          </label>
          <textarea
            rows={3}
            value={outboundNote}
            onChange={(e) => setOutboundNote(e.target.value)}
            placeholder="Enter reason for outbound movement, destination, dispatch tracking number..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none resize-none"
          />
        </div>

        {/* Submit Button Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-5 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">
            {selectedItem && selectedLocation ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Ready to record outbound movement</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">⚠ Please select an item and warehouse location marker</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedItem || !selectedLocation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:from-indigo-700 active:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-8 py-3 transition-all duration-150 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Recording Movement...
              </>
            ) : (
              'Record Outbound Movement'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

