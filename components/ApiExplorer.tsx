import { useEffect, useRef } from 'react'

/**
 * Renders the Scalar API Reference against the committed OpenAPI snapshot
 * (public/openapi.json). Loaded client-side from the jsDelivr CDN, so it adds
 * nothing to the build. Falls back gracefully: the page also links to the
 * gateway's live Swagger UI.
 */
export default function ApiExplorer() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container || container.childElementCount > 0) return

    const target = document.createElement('script')
    target.id = 'api-reference'
    target.setAttribute('data-url', '/openapi.json')
    target.setAttribute(
      'data-configuration',
      JSON.stringify({ theme: 'purple', darkMode: true, hideModels: false })
    )
    container.appendChild(target)

    const cdn = document.createElement('script')
    cdn.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
    cdn.async = true
    container.appendChild(cdn)

    return () => {
      container.innerHTML = ''
    }
  }, [])

  return <div ref={ref} style={{ minHeight: '80vh', marginTop: '1rem' }} />
}
