import ItemInputForm from '@/components/ItemInputForm'

export const metadata = {
  title: 'Inventori Gudang | Warehouse Management',
  description: 'Warehouse Inventory Management System with Blueprint Location Tracking.',
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col font-sans">
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
