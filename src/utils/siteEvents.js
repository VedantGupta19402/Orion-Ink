export const SITE_NOTICE_EVENT = 'orion:notice'

export const emitSiteNotice = ({ title, message }) => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent(SITE_NOTICE_EVENT, {
      detail: { title, message },
    }),
  )
}

export const scrollToSection = (selector) => {
  if (typeof document === 'undefined') return

  const target = document.querySelector(selector)
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
