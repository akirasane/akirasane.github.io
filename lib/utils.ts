import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// `main` uses `scroll-snap-stop: always` so wheel/touch flings can't skip a
// section. Chromium (and per-spec) also applies scroll-snap-stop to
// programmatic scrollIntoView — a multi-hop nav jump (e.g. Hero -> Contact)
// would otherwise halt at the first intermediate snap point instead of
// reaching the target. Temporarily disabling snap for the duration of the
// jump sidesteps that without weakening the wheel/touch protection.
export function scrollToSectionId(id: string) {
  const mainEl = document.querySelector('main') as HTMLElement | null
  const target = document.getElementById(id)
  if (!target) return

  if (!mainEl) {
    target.scrollIntoView({ behavior: 'smooth' })
    return
  }

  const prevSnapType = mainEl.style.scrollSnapType
  mainEl.style.scrollSnapType = 'none'

  let restored = false
  const restore = () => {
    if (restored) return
    restored = true
    mainEl.style.scrollSnapType = prevSnapType
    mainEl.removeEventListener('scrollend', restore)
  }

  mainEl.addEventListener('scrollend', restore, { once: true })
  // Fallback in case `scrollend` isn't supported (older Safari).
  setTimeout(restore, 1200)

  target.scrollIntoView({ behavior: 'smooth' })
}
