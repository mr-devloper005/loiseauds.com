'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export function EditableReveal({
  children,
  index = 0,
  className = '',
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-mounted={mounted ? 'true' : 'false'}
      className={`editable-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: mounted ? `${Math.min(index, 8) * 70}ms` : undefined } as CSSProperties}
    >
      {children}
    </div>
  )
}
