'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface ElectricianCardProps {
  id: string
  name: string
  neighborhood: string
  phone: string
  tier: 'premium' | 'featured' | 'free' | 'rotating'
  services?: string[]
  index: number
}

export default function ElectricianCard({
  id,
  name,
  neighborhood,
  phone,
  tier,
  services = [],
  index
}: ElectricianCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const tierStyles = {
    premium: 'bg-gradient-to-br from-purple-50 to-white border-3 border-purple-500 shadow-xl',
    featured: 'bg-gradient-to-b from-yellow-50 to-white border-3 border-yellow-400 shadow-lg',
    rotating: 'bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 border-l-4 border-sky-500',
    free: 'bg-white border border-gray-200'
  }

  const tierBadges = {
    premium: { text: 'PREMIUM', color: 'bg-gradient-to-r from-purple-600 to-indigo-600' },
    featured: { text: 'ΠΡΟΒΟΛΗ', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    rotating: { text: '🌟 Σε Προβολή', color: 'bg-sky-500' },
    free: null
  }

  return (
    <div
      ref={cardRef}
      className={`
        ${tierStyles[tier]}
        rounded-xl p-4 cursor-pointer transition-all duration-300
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.01]
        ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/hlektrologos/${id}`} className="block">
        {/* Tier Badge */}
        {tierBadges[tier] && (
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold text-white ${tierBadges[tier].color}`}>
              {tierBadges[tier].text}
            </span>
          </div>
        )}

        {/* Name */}
        <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-3 hover:text-purple-600 transition-colors">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4 text-sm">
          <span className="mr-2">📍</span>
          <span>{neighborhood}</span>
        </div>

        {/* Phone Button */}
        <a
          href={`tel:${phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all gap-2 mb-4 hover:-translate-y-1"
        >
          <span>📞</span>
          <span>{phone}</span>
        </a>

        {/* Services */}
        {services.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 3).map((service, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
              >
                {service}
              </span>
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}
