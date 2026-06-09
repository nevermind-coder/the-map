import { useState, useEffect, useRef } from 'react'

export function useStreamText(generatorFn, deps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fnRef = useRef(generatorFn)
  fnRef.current = generatorFn

  useEffect(() => {
    let cancelled = false
    setText('')
    setError(null)
    setLoading(true)

    ;(async () => {
      try {
        for await (const chunk of fnRef.current()) {
          if (cancelled) return
          setText(prev => prev + chunk)
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { text, loading, error }
}
