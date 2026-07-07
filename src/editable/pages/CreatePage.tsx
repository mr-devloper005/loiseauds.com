'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Lock, Send } from 'lucide-react'
import type { TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'
const fieldClass = 'rounded-2xl border border-[var(--editable-border)] bg-white/5 px-4 py-3 text-sm font-semibold text-[var(--editable-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const task = 'pdf' as TaskKey
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--editable-page-bg)] px-4 py-16 text-[var(--editable-page-text)] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-8 rounded-[24px] border border-[var(--editable-border)] bg-white/5 p-7 md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div className="flex h-full min-h-72 items-center justify-center rounded-[24px] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center">
              <p className={dc.type.eyebrow}>{pagesContent.create.locked.badge}</p>
              <h1 className="editable-display mt-5 text-5xl leading-[1.02] sm:text-7xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className={dc.button.primary}>Sign in <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className={dc.button.secondary}>Get started</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--editable-page-bg)] text-[var(--editable-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-[24px] border border-[var(--editable-border)] bg-white/5 p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <aside>
              <p className={dc.type.eyebrow}>{pagesContent.create.hero.badge}</p>
              <h1 className="editable-display mt-5 text-5xl leading-[1.02] sm:text-7xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
              <div className="mt-8 rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5">
                <FileText className="h-7 w-7 text-[var(--slot4-accent)]" />
                <h2 className="editable-display mt-5 text-3xl">Reference Library</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">Submissions are prepared as resource entries with title, category, source link, summary, and supporting notes.</p>
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">Submit Reference Library resource</p>
                  <h2 className="editable-display mt-1 text-4xl leading-[1.08]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-[var(--slot4-muted-text)]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Resource title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="File or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Optional preview image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main notes, context, or details" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-2xl border border-[var(--slot4-accent)]/30 bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-accent)]">
                  <p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className={`mt-5 w-full ${dc.button.primary}`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
