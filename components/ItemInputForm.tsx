'use client'

import React, { useState, ChangeEvent } from 'react'
import WarehouseBlueprint, { PinLocation } from './WarehouseBlueprint'

export default function ItemInputForm() {
  // Form Field States (Frontend only)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState<number>(1)
  const [unit, setUnit] = useState('pcs')
  const [note, setNote] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<PinLocation | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Handle File Helper
  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle Image Upload Preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  // Handle Drag & Drop Events
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  // Handle Image Clear
  const handleRemoveImage = () => {
    setImagePreview(null)
  }

  // Handle Form Submit (Frontend demonstration only)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Add New Inventory Item
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Input item details and pick a location on the warehouse zone blueprint.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Success Alert */}
      {isSubmitted && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-emerald-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold">Form Submitted (Frontend Preview)</p>
              <p className="text-xs text-emerald-300/80">
                Item details captured successfully without backend action.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="text-xs bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 px-2.5 py-1 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Grid: Image Upload + Primary Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Image Input (Column 1-5) */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Item Image
            </label>

            {imagePreview ? (
              <div className="relative group w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Item Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg shadow cursor-pointer transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
             ) : (
               <label
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}
                 className={`relative flex flex-col items-center justify-center w-full h-48 sm:h-56 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-150 group ${
                   isDragging
                     ? 'border-indigo-400 bg-indigo-950/40'
                     : 'border-slate-700 hover:border-indigo-500 bg-slate-950/50 hover:bg-slate-950'
                 }`}
               >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <div className="h-10 w-10 mb-3 rounded-full bg-slate-800 group-hover:bg-indigo-900/50 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="mb-1 text-xs sm:text-sm text-slate-300 font-medium">
                      <span className="text-indigo-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-[11px] text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Name, Quantity, Unit Inputs (Column 6-12) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Name Input */}
            <div>
              <label htmlFor="itemName" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Item Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Industrial Hydraulic Pump Model-X"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none"
              />
            </div>

            {/* Quantity & Unit Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quantity Input with Stepper */}
              <div>
                <label htmlFor="quantity" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Quantity <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center bg-transparent text-sm text-white font-medium outline-none py-2.5"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Unit of Quantity Input */}
              <div>
                <label htmlFor="unit" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Unit of Quantity <span className="text-rose-400">*</span>
                </label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none cursor-pointer"
                >
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="boxes">Boxes (box)</option>
                  <option value="pallets">Pallets (plt)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters (L)</option>
                  <option value="units">Units</option>
                  <option value="meters">Meters (m)</option>
                </select>
              </div>
            </div>

            {/* Note Textbox */}
            <div>
              <label htmlFor="note" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Note / Description
              </label>
              <textarea
                id="note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional storage instructions, serial numbers, or batch tags..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Warehouse Blueprint Location Selector */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Location Input (Click an area on the warehouse blueprint)
          </label>
          <WarehouseBlueprint
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
          />
        </div>

        {/* Submit Button Bar */}
        <div className="border-t border-slate-800 pt-5 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400 hidden sm:block">
            {selectedLocation ? (
              <span className="text-emerald-400 font-medium">✓ Location point selected</span>
            ) : (
              <span className="text-amber-400 font-medium">⚠ Please click a point on the blueprint</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:from-indigo-700 active:to-indigo-600 text-white text-sm font-semibold px-8 py-3 transition-all duration-150 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Submit Item
          </button>
        </div>
      </form>
    </div>
  )
}
