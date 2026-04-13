const CATEGORY_MAP = {
  식료품:   { badge: 'bg-green-100 text-green-700',   hex: '#16a34a' },
  외식:     { badge: 'bg-orange-100 text-orange-700', hex: '#ea580c' },
  교통:     { badge: 'bg-blue-100 text-blue-700',     hex: '#2563eb' },
  의류:     { badge: 'bg-purple-100 text-purple-700', hex: '#9333ea' },
  의료:     { badge: 'bg-red-100 text-red-700',       hex: '#dc2626' },
  문화:     { badge: 'bg-pink-100 text-pink-700',     hex: '#db2777' },
  교육:     { badge: 'bg-yellow-100 text-yellow-700', hex: '#ca8a04' },
  생활용품: { badge: 'bg-teal-100 text-teal-700',     hex: '#0d9488' },
  기타:     { badge: 'bg-gray-100 text-gray-600',     hex: '#6b7280' },
}

const DEFAULT = { badge: 'bg-indigo-100 text-indigo-700', hex: '#4f46e5' }

export function getCategoryBadgeClass(category) {
  return (CATEGORY_MAP[category] ?? DEFAULT).badge
}

export function getCategoryHex(category) {
  return (CATEGORY_MAP[category] ?? DEFAULT).hex
}

export function getAllCategories() {
  return Object.keys(CATEGORY_MAP)
}
