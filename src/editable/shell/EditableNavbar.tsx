'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const staticLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const linkClass = (href: string) => {
    const active = pathname === href
    return `relative rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
      active
        ? 'bg-[var(--slot4-accent)] text-black shadow-[0_0_28px_rgba(36,216,97,0.22)]'
        : 'text-[var(--slot4-muted-text)] hover:bg-white/8 hover:text-[var(--slot4-page-text)]'
    }`
  }

  const mobileItems = [
    { label: 'Home', href: '/' },
    ...staticLinks,
    { label: 'Search', href: '/search' },
    ...(session ? [{ label: 'Submit', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }]),
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/82 text-[var(--editable-nav-text)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(36,216,97,0.65),transparent)]" />
      <nav className="mx-auto grid min-h-[84px] w-full max-w-[var(--editable-container)] grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white/[0.045] py-2 pl-2 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-[var(--slot4-accent)]/45 hover:bg-white/[0.07]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full  border border-white/15 bg-white text-black transition group-hover:scale-[1.03]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object" />
          </span>
          <span className="min-w-0">
            <span className="editable-display block max-w-[210px] truncate text-2xl leading-none text-[var(--slot4-page-text)]">{SITE_CONFIG.name}</span>
            <span className="mt-1 hidden max-w-[230px] truncate text-[11px] font-semibold text-[var(--slot4-muted-text)] sm:block">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-[var(--editable-border)] bg-white/[0.045] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:flex">
          {staticLinks.map((item) => <Link key={item.href} href={item.href} className={linkClass(item.href)}>{item.label}</Link>)}
          <span className="mx-1 h-6 w-px bg-[var(--editable-border)]" />
          <Link href="/search" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--slot4-muted-text)] transition hover:bg-white/8 hover:text-[var(--slot4-accent)]">
            <Search className="h-4 w-4" /> Search
          </Link>
        </div>

        <div className="ml-auto flex items-center justify-end gap-2">
          <Link href="/search" aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-white/[0.045] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] lg:hidden">
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link href="/create" className={`hidden sm:inline-flex ${dc.button.primary}`}><PlusCircle className="h-4 w-4" /> Submit</Link>
              <button type="button" onClick={logout} className="hidden rounded-full border border-[var(--editable-border)] bg-white/[0.045] px-4 py-3 text-sm font-semibold text-[var(--slot4-muted-text)] transition hover:border-white/25 hover:text-[var(--slot4-page-text)] sm:inline-flex">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/[0.045] px-4 py-3 text-sm font-semibold text-[var(--slot4-muted-text)] transition hover:border-white/25 hover:text-[var(--slot4-page-text)] sm:inline-flex"><LogIn className="h-4 w-4" /> Sign in</Link>
              <Link href="/signup" className={`hidden sm:inline-flex ${dc.button.primary}`}><UserPlus className="h-4 w-4" /> Get started</Link>
            </>
          )}
          <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--editable-border)] bg-white/[0.045] transition hover:border-[var(--slot4-accent)] lg:hidden" aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/96 px-4 py-5 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto max-w-[var(--editable-container)] rounded-[28px] border border-[var(--editable-border)] bg-white/[0.045] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <div className="rounded-[22px] border border-[var(--editable-border)] bg-black/20 p-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-[var(--slot4-accent)]">NAVIGATION</p>
              <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Move through the public library surface and account actions.</p>
            </div>
            <div className="mt-3 grid gap-2">
              {mobileItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                        : 'border-[var(--editable-border)] bg-white/[0.04] text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                    }`}
                  >
                    {item.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )
              })}
              {session ? <button type="button" onClick={logout} className="rounded-2xl border border-[var(--editable-border)] bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Logout</button> : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
