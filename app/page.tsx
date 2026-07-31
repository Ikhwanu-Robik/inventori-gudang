import ItemInputForm from '@/components/ItemInputForm'
import Link from 'next/link'

export const metadata = {
  title: 'Inventori Gudang | Warehouse Management',
  description: 'Warehouse Inventory Management System with Blueprint Location Tracking.',
}

export default function Home() {
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
              Inventory Catalog
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
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ItemInputForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Inventori Gudang System &copy; {new Date().getFullYear()} — Frontend Only Mode</p>
      </footer>
    </div>
  )
}
