'use client'

import Link from 'next/link'
import { ArrowUpRight, Instagram, Linkedin, Search, Youtube } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="relative overflow-hidden border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(50%_70%_at_50%_0%,rgba(36,216,97,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 rounded-[24px] border border-[var(--editable-border)] bg-white/5 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className={dc.type.eyebrow}>Keep the library close</p>
            <h2 className="editable-display mt-4 max-w-2xl text-4xl leading-[1.05] sm:text-5xl">Useful references, arranged for return visits.</h2>
          </div>
          <div className="flex items-end lg:justify-end">
            <Link href="/pdf" className={dc.button.primary}>Open Reference Library <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white text-black">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
              </span>
              <span className="editable-display text-2xl">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            
          </div>

          <FooterColumn title="Discovery" links={[{ label: 'Reference Library', href: '/pdf' }]} />
          <FooterColumn title="Resources" links={[{ label: 'Search', href: '/search' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }]} />
          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-[var(--slot4-accent)]">Account</h3>
            <div className="mt-4 grid gap-2">
              {session ? (
                <>
                  <Link href="/create" className="text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Submit</Link>
                  <button type="button" onClick={logout} className="text-left text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Sign in</Link>
                  <Link href="/signup" className="text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative border-t border-[var(--editable-border)] px-4 py-5 text-center text-xs font-medium text-[var(--slot4-soft-muted-text)]">
        (c) {year} {SITE_CONFIG.name}. {globalContent.footer?.bottomNote || 'Built for clean discovery.'}
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-[0.18em] text-[var(--slot4-accent)]">{title}</h3>
      <div className="mt-4 grid gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
            {link.label} {link.href === '/search' ? <Search className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
          </Link>
        ))}
      </div>
    </div>
  )
}

