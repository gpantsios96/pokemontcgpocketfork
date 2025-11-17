# Electrician Directory Website Modernization Skill

**Purpose**: Claude Code skill for modernizing the Ηλεκτρολόγοι Θεσσαλονίκη (Thessaloniki Electricians) directory website with modern design patterns, smooth animations, and enhanced user experience.

**Use When**: Analyzing and redesigning the electrician directory interface with focus on modern aesthetics, improved gradients, smooth interactions, mobile optimization, and potential Next.js conversion.

**Current Tech Stack**: Static HTML, CSS, JavaScript (Greek language site)
**Target Tech Stack**: Next.js 14+, React, Tailwind CSS, TypeScript (optional conversion)

---

## Current Site Analysis

### Existing Structure
- **Main Page**: `index.html` - Search functionality, rotating spotlight, featured electricians
- **Detail Pages**: `electrician-detail.html` - Individual electrician profiles
- **Neighborhoods**: Separate pages for different areas of Thessaloniki
- **Language**: Greek (el) - All content and UI text must remain in Greek
- **Design**: Already mobile-first with blur effects, gradients, and glassmorphism

### Current Strengths
✅ Mobile-first responsive design
✅ Touch-optimized (44px minimum touch targets)
✅ Blur effects and glassmorphism
✅ Gradient backgrounds and cards
✅ Good accessibility features
✅ Smooth scroll behavior
✅ Loading states and animations

### Modernization Opportunities
🎯 Enhanced gradient animations
🎯 Improved card hover effects
🎯 Better micro-interactions
🎯 Smooth page transitions
🎯 Enhanced typography with variable fonts
🎯 Improved search UI with autocomplete
🎯 Dark mode support (optional)
🎯 Better skeleton loaders
🎯 Parallax effects on background
🎯 Conversion to Next.js for better performance

---

## Core Principles

When modernizing this electrician directory:
1. **Preserve Greek language** - All content stays in Greek (el)
2. **Maintain SEO** - Keep meta tags, semantic HTML, structured data
3. **Enhance existing design** - Build on current glassmorphism aesthetic
4. **Improve performance** - Optimize images, lazy loading, faster load times
5. **Keep functionality** - Search, phone calls, rotation system all work better
6. **Mobile priority** - Most users will be on mobile searching for electricians

---

## Quick Modernization Checklist

### Phase 1: CSS/JavaScript Enhancements (No framework change)
- [ ] Add animated gradient backgrounds
- [ ] Enhance card hover effects with 3D transforms
- [ ] Implement smooth page transitions
- [ ] Add skeleton loaders for better perceived performance
- [ ] Improve search with debounced filtering
- [ ] Add micro-interactions to buttons
- [ ] Implement intersection observer for scroll animations
- [ ] Add parallax effect to background image
- [ ] Enhance blur effects with better fallbacks

### Phase 2: Next.js Conversion (Major upgrade)
- [ ] Set up Next.js 14+ with App Router
- [ ] Install Tailwind CSS and configure
- [ ] Convert HTML pages to React components
- [ ] Implement Image optimization with next/image
- [ ] Add Font optimization with next/font
- [ ] Create API routes for electrician data
- [ ] Implement Static Generation (SSG) for performance
- [ ] Add Loading UI with Suspense
- [ ] Implement Metadata API for SEO
- [ ] Add Analytics and tracking
- [ ] Deploy to Vercel or similar platform

---

## Phase 1: Quick CSS/JS Modernizations

### 1.1 Animated Gradient Backgrounds

**Add to `style.css`:**
```css
/* Animated gradient for hero section */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero {
  background: linear-gradient(
    -45deg,
    rgba(245, 245, 245, 0.92),
    rgba(239, 246, 255, 0.92),
    rgba(243, 244, 246, 0.92),
    rgba(255, 255, 255, 0.92)
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}

/* Animated blob backgrounds */
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animated-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.7;
  animation: blob 20s infinite;
  z-index: -1;
}
```

### 1.2 Enhanced Card Effects

**Add 3D hover transforms:**
```css
.electrician-card {
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (min-width: 1024px) {
  .electrician-card:hover {
    transform: translateY(-8px) rotateX(2deg) rotateY(2deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  .electrician-card-premium:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 24px 48px rgba(139, 92, 246, 0.4);
  }
}

/* Shine effect on hover */
.electrician-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.electrician-card:hover::before {
  left: 100%;
}
```

### 1.3 Scroll-Triggered Animations

**Add JavaScript for intersection observer:**
```javascript
// Add to script.js
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all electrician cards
  document.querySelectorAll('.electrician-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
  });
});
```

**Add CSS for fade-in:**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Stagger animation for cards */
.electrician-card:nth-child(1) { animation-delay: 0ms; }
.electrician-card:nth-child(2) { animation-delay: 100ms; }
.electrician-card:nth-child(3) { animation-delay: 200ms; }
.electrician-card:nth-child(4) { animation-delay: 300ms; }
.electrician-card:nth-child(5) { animation-delay: 400ms; }
.electrician-card:nth-child(6) { animation-delay: 500ms; }
```

### 1.4 Enhanced Search with Debouncing

**Improve search functionality:**
```javascript
// Debounced search for better performance
let searchTimeout;
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function(e) {
  clearTimeout(searchTimeout);

  // Add loading indicator
  this.classList.add('searching');

  searchTimeout = setTimeout(() => {
    performSearch(e.target.value);
    this.classList.remove('searching');
  }, 300);
});

// Add search loading animation to CSS
.searching {
  background-image: linear-gradient(
    90deg,
    white 0%,
    #f3f4f6 50%,
    white 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 1.5 Better Skeleton Loaders

**Enhanced loading states:**
```css
.skeleton-card {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 12px;
  height: 200px;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(
    90deg,
    #e0e0e0 0%,
    #f0f0f0 50%,
    #e0e0e0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 4px;
  margin: 8px 0;
}

.skeleton-text.short { width: 60%; }
.skeleton-text.medium { width: 80%; }
.skeleton-text.long { width: 100%; }
```

---

## Phase 2: Next.js Conversion Guide

### 2.1 Project Setup

**Initialize Next.js project:**
```bash
# Create new Next.js app with TypeScript and Tailwind
npx create-next-app@latest elektrologi-thessaloniki --typescript --tailwind --app --no-src-dir

cd elektrologi-thessaloniki

# Install additional dependencies
npm install @types/node @types/react @types/react-dom
npm install lucide-react # Modern icon library
npm install framer-motion # For advanced animations
npm install next-intl # For Greek language support
```

### 2.2 Project Structure

```
elektrologi-thessaloniki/
├── app/
│   ├── layout.tsx          # Root layout with Greek language
│   ├── page.tsx            # Homepage (index.html converted)
│   ├── hlektrologos/
│   │   └── [id]/
│   │       └── page.tsx    # Dynamic electrician detail pages
│   ├── periohes/
│   │   └── [neighborhood]/
│   │       └── page.tsx    # Neighborhood pages
│   ├── api/
│   │   ├── electricians/
│   │   │   └── route.ts    # API for electrician data
│   │   └── search/
│   │       └── route.ts    # Search API
│   └── globals.css         # Global styles
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SearchBar.tsx
│   ├── ElectricianCard.tsx
│   ├── ElectricianGrid.tsx
│   └── ui/                 # Reusable UI components
├── data/
│   └── electricians.json   # Electrician data
├── public/
│   ├── images/
│   └── robots.txt
├── lib/
│   └── utils.ts
└── tailwind.config.ts
```

### 2.3 Convert HTML to React Components

**Example: Header Component**
```typescript
// components/Header.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header className="bg-[rgba(26,77,122,1)] backdrop-blur-md text-white shadow-lg">
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
```

**Example: ElectricianCard Component**
```typescript
// components/ElectricianCard.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, MapPin, Star } from 'lucide-react'

interface ElectricianCardProps {
  id: string
  name: string
  neighborhood: string
  phone: string
  tier: 'premium' | 'featured' | 'free'
  services: string[]
  verified?: boolean
  index: number
}

export default function ElectricianCard({
  id,
  name,
  neighborhood,
  phone,
  tier,
  services,
  verified,
  index
}: ElectricianCardProps) {
  const tierStyles = {
    premium: 'bg-gradient-to-br from-purple-50 to-white border-3 border-purple-500 shadow-xl',
    featured: 'bg-gradient-to-b from-yellow-50 to-white border-3 border-yellow-400 shadow-lg',
    free: 'bg-white border border-gray-200'
  }

  const tierBadges = {
    premium: 'PREMIUM',
    featured: 'ΠΡΟΒΟΛΗ',
    free: null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative"
    >
      <Link href={`/hlektrologos/${id}`}>
        <div className={`${tierStyles[tier]} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl`}>
          {/* Tier Badge */}
          {tierBadges[tier] && (
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold text-white ${
                tier === 'premium' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}>
                {tierBadges[tier]}
              </span>
            </div>
          )}

          {/* Name */}
          <h3 className="text-xl font-bold text-blue-900 mb-3 hover:text-purple-600 transition-colors">
            {name}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{neighborhood}</span>
          </div>

          {/* Phone Button */}
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all gap-2 mb-4"
          >
            <Phone className="w-5 h-5" />
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
        </div>
      </Link>
    </motion.div>
  )
}
```

**Example: Homepage**
```typescript
// app/page.tsx
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import ElectricianGrid from '@/components/ElectricianGrid'
import { getElectricians } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Ηλεκτρολόγοι Θεσσαλονίκη - Βρείτε Έμπειρους Επαγγελματίες',
  description: 'Βρείτε έμπειρους ηλεκτρολόγους στη Θεσσαλονίκη. Αξιόπιστοι επαγγελματίες για όλες τις ηλεκτρολογικές σας ανάγκες.',
  openGraph: {
    title: 'Ηλεκτρολόγοι Θεσσαλονίκη',
    description: 'Βρείτε έμπειρους ηλεκτρολόγους στη Θεσσαλονίκη',
    locale: 'el_GR',
  }
}

export default async function HomePage() {
  const electricians = await getElectricians()
  const featured = electricians.filter(e => e.tier === 'featured' || e.tier === 'premium')
  const rotating = electricians.slice(0, 3) // Today's rotation

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section with Search */}
        <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 backdrop-blur-lg rounded-xl p-6 mb-8 mx-4 mt-4 shadow-xl animate-gradient">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg inline-block">
              Αναζήτηση Ηλεκτρολόγου
            </h2>
            <SearchBar />
          </div>
        </section>

        {/* Rotating Spotlight */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-indigo-900 text-center mb-2 bg-white/90 backdrop-blur-md p-4 rounded-xl inline-block mx-auto w-fit shadow-lg">
              🌟 Σε Προβολή Σήμερα
            </h2>
            <p className="text-center text-white text-shadow mb-6">
              Κάθε 24 ώρες προβάλλουμε 3 διαφορετικούς επαγγελματίες
            </p>
            <ElectricianGrid electricians={rotating} />
          </div>
        </section>

        {/* Featured Electricians */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-indigo-900 text-center mb-8 bg-white/90 backdrop-blur-md p-4 rounded-xl inline-block mx-auto w-fit shadow-lg">
              Προτεινόμενοι Ηλεκτρολόγοι
            </h2>
            <ElectricianGrid electricians={featured} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
```

### 2.4 Tailwind Configuration

**tailwind.config.ts:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a4d7a',
          light: '#2563eb',
          dark: '#1e40af',
        },
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'blob': 'blob 20s infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
```

### 2.5 Performance Optimizations

**Image Optimization:**
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  // Enable static exports if deploying to static hosting
  // output: 'export',
}

module.exports = nextConfig
```

**Font Optimization:**
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'greek'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="el" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

---

## Testing Checklist

### Visual Testing
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test all breakpoints (320px, 375px, 768px, 1024px, 1440px)
- [ ] Verify Greek text rendering correctly
- [ ] Check all gradients and animations

### Functionality Testing
- [ ] Search works correctly
- [ ] Phone call buttons work
- [ ] Navigation works
- [ ] Rotating spotlight updates daily
- [ ] Forms submit properly
- [ ] All links work
- [ ] Back button functions correctly

### Performance Testing
- [ ] Run Lighthouse audit (target: 90+ on all metrics)
- [ ] Check Core Web Vitals
- [ ] Test on slow 3G network
- [ ] Verify no layout shift (CLS < 0.1)
- [ ] Images load optimized
- [ ] Fonts load without flash

### SEO Testing
- [ ] Meta tags present and correct
- [ ] Greek language properly set (lang="el")
- [ ] Structured data for local business
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Open Graph tags for social sharing

---

## Deployment Guide

### Option 1: Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Configure custom domain
```

### Option 2: Static Export (Current hosting)
```bash
# Add to next.config.js
output: 'export'

# Build
npm run build

# Output will be in /out directory
# Upload /out to current hosting
```

### Option 3: Traditional Hosting (No Next.js conversion)
```bash
# Just upload updated HTML/CSS/JS files
# Maintain current hosting setup
# No changes to deployment process
```

---

## Maintenance Checklist

### Weekly
- [ ] Check rotating spotlight is updating
- [ ] Verify phone numbers still work
- [ ] Check for broken links
- [ ] Review analytics

### Monthly
- [ ] Update electrician listings
- [ ] Check SEO rankings
- [ ] Review and respond to any contact forms
- [ ] Update neighborhoods if needed
- [ ] Optimize new images

### Quarterly
- [ ] Run full performance audit
- [ ] Update dependencies (if using Next.js)
- [ ] Review and update content
- [ ] Check mobile experience
- [ ] Test cross-browser compatibility

---

**End of Skill Document**

*Optimized for Ηλεκτρολόγοι Θεσσαλονίκη - Electrician Directory Modernization*
*Language: Greek (el)*
*Version: 1.0*
