import type { MediaItem } from '@/services/mediaService'

/**
 * Trigger a browser download for each asset.
 *
 * Kept outside the media library component: downloading is a side effect of a
 * management action, not a rendering concern. Object URLs and data URIs both
 * work through the same anchor mechanism.
 */
export async function downloadMedia(items: MediaItem[]): Promise<void> {
  for (const item of items) {
    const link = document.createElement('a')
    link.href = item.url
    link.download = item.filename
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Give the browser a moment between downloads; some browsers otherwise
    // collapse multiple programmatic downloads into one prompt.
    await new Promise((resolve) => setTimeout(resolve, 120))
  }
}
