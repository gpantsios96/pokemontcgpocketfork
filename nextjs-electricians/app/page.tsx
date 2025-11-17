import Header from '@/components/Header'
import ElectricianCard from '@/components/ElectricianCard'
import fs from 'fs'
import path from 'path'

// This will be statically generated at build time
export const dynamic = 'force-static'
export const revalidate = false // No revalidation needed for static site

interface ElectricianData {
  id: number | string
  name: string
  neighborhood: string
  phone: string
  tier: 'premium' | 'featured' | 'free'
  services?: string[]
  monthlyFee?: number
  analytics?: {
    totalViews: number
    totalPhoneClicks: number
  }
}

interface Electrician {
  id: string
  name: string
  neighborhood: string
  phone: string
  tier: 'premium' | 'featured' | 'free'
  services?: string[]
}

// Load electricians data at build time
function getElectricians(): Electrician[] {
  const filePath = path.join(process.cwd(), 'public', 'data', 'electricians.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const data: ElectricianData[] = JSON.parse(fileContents)

  // Convert to our interface format
  return data.map(e => ({
    id: String(e.id),
    name: e.name,
    neighborhood: e.neighborhood,
    phone: e.phone,
    tier: e.tier,
    services: e.services || []
  }))
}

export default function HomePage() {
  const electricians = getElectricians()

  // Separate by tier for display
  const premium = electricians.filter(e => e.tier === 'premium')
  const featured = electricians.filter(e => e.tier === 'featured')
  const rotating = electricians.slice(0, 3) // First 3 for rotation display
  const all = electricians

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pb-10">
        {/* Hero Section with Search */}
        <section className="mx-4 mt-4 mb-8 bg-gradient-to-br from-gray-50/95 via-blue-50/95 to-gray-50/95 backdrop-blur-lg rounded-xl p-6 shadow-xl animate-gradient">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg inline-block w-full">
              Αναζήτηση Ηλεκτρολόγου
            </h2>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Αναζητήστε ηλεκτρολόγο ή περιοχή..."
                className="flex-1 h-14 px-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                aria-label="Αναζήτηση ηλεκτρολόγου"
              />
              <button className="h-14 px-6 md:px-8 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Αναζήτηση
              </button>
            </div>
          </div>
        </section>

        {/* Rotating Spotlight */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-2 bg-white/90 backdrop-blur-md p-4 rounded-xl inline-block mx-auto w-fit shadow-lg">
              🌟 Σε Προβολή Σήμερα
            </h2>
            <p className="text-center text-white text-shadow mb-6 text-sm md:text-base">
              Κάθε 24 ώρες προβάλλουμε 3 διαφορετικούς επαγγελματίες
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rotating.map((electrician, index) => (
                <ElectricianCard
                  key={electrician.id}
                  {...electrician}
                  tier="rotating"
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Electricians */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-8 bg-white/90 backdrop-blur-md p-4 rounded-xl inline-block mx-auto w-fit shadow-lg">
              Προτεινόμενοι Ηλεκτρολόγοι
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...premium, ...featured, ...all.filter(e => e.tier === 'free')].map((electrician, index) => (
                <ElectricianCard
                  key={electrician.id}
                  {...electrician}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-md text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
                Ηλεκτρολόγοι Θεσσαλονίκη
              </h3>
              <p className="text-gray-400 text-sm">
                Βρείτε τους καλύτερους ηλεκτρολόγους στην περιοχή σας
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Υπηρεσίες</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Επισκευές Ηλεκτρολογικών Συστημάτων</li>
                <li>Εγκαταστάσεις & Ανακαινίσεις</li>
                <li>Συντήρηση & Έλεγχος</li>
                <li>24ωρη Εξυπηρέτηση</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Επικοινωνία</h4>
              <p className="text-gray-400 text-sm">Θεσσαλονίκη, Ελλάδα</p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 Ηλεκτρολόγοι Θεσσαλονίκη. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
