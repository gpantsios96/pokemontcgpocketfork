'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header className="bg-[rgba(26,77,122,1)] backdrop-blur-md text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="w-11 h-11 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            aria-label="Πίσω"
          >
            ←
          </button>

          {/* Logo */}
          <Link href="/" className="flex-1 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Ηλεκτρολόγοι Θεσσαλονίκη"
              width={600}
              height={90}
              className="h-[90px] w-auto max-w-[600px] md:h-[70px]"
              priority
            />
          </Link>

          {/* Emergency Button */}
          <button
            onClick={() => alert('Για έκτακτη ανάγκη καλέστε το 112')}
            className="h-11 px-4 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-white whitespace-nowrap transition-colors"
          >
            🚨 112
          </button>
        </div>
      </div>
    </header>
  )
}
