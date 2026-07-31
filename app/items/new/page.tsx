import ItemInputForm from '@/components/ItemInputForm'
import Link from 'next/link'

export const metadata = {
  title: 'Add New Item | Inventori Gudang',
  description: 'Input new inventory item details and select warehouse location on the blueprint.',
}

export default function NewItemPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Overview
        </Link>
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Inventory Catalog →
        </Link>
      </div>

      <ItemInputForm />
    </main>
  )
}
