/**
 * Self-contained SVG data URIs used by showcase demos.
 * Keeping assets inline means the showcase works offline and follows no
 * external image hosts, while still demonstrating image-based components.
 */
function gradient(label, from, to, width = 960, height = 600) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)" />
  <circle cx="${width * 0.78}" cy="${height * 0.24}" r="${height * 0.22}" fill="rgba(255,255,255,0.16)" />
  <circle cx="${width * 0.18}" cy="${height * 0.82}" r="${height * 0.3}" fill="rgba(255,255,255,0.1)" />
  <text x="50%" y="52%" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="${height * 0.11}" font-weight="700" fill="rgba(255,255,255,0.92)">${label}</text>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const gradientA = gradient('Aurora', '#6366f1', '#ec4899')
export const gradientB = gradient('Sunset', '#f97316', '#db2777')
export const gradientC = gradient('Ocean', '#0ea5e9', '#22c55e')
export const gradientD = gradient('Citrus', '#eab308', '#84cc16')
export const gradientE = gradient('Berry', '#8b5cf6', '#06b6d4')
export const gradientF = gradient('Ember', '#ef4444', '#f59e0b')

export const galleryImages = [
  { src: gradientA, alt: 'Aurora gradient' },
  { src: gradientB, alt: 'Sunset gradient' },
  { src: gradientC, alt: 'Ocean gradient' },
  { src: gradientD, alt: 'Citrus gradient' },
  { src: gradientE, alt: 'Berry gradient' },
]

export const carouselSlides = [
  { id: 1, src: gradientA, alt: 'Aurora slide' },
  { id: 2, src: gradientB, alt: 'Sunset slide' },
  { id: 3, src: gradientC, alt: 'Ocean slide' },
  { id: 4, src: gradientD, alt: 'Citrus slide' },
]

export const diffBefore = gradient('Before', '#334155', '#0f172a')
export const diffAfter = gradient('After', '#22c55e', '#0ea5e9')
