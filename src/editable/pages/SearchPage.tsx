import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import type { SitePost } from '@/lib/site-connector'
import { Ads, getSlotSizes } from '@/lib/ads'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/search', title: pagesContent.search.metadata.title, description: pagesContent.search.metadata.description })
}

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const displayTitle = (value: string) => value.replace(/\bPDFs?\b/gi, 'Resource').replace(/\bDocuments?\b/gi, 'Resources').replace(/\bProfiles?\b/gi, 'Contributors')
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost) => compactRaw(getContent(post).category) || post.tags?.[0] || 'Resource'
const fileSizeOf = (post: SitePost) => compactRaw(getContent(post).fileSize) || compactRaw(getContent(post).size) || 'Reference file'

const matches = (post: SitePost, query: string, category: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (derivedTask !== 'pdf') return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function Glyph({ title }: { title: string }) {
  const initials = title.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'RL'
  return <span className="editable-display flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-[var(--slot4-accent-soft)] text-3xl text-[var(--slot4-accent)]">{initials}</span>
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const href = `/pdf/${post.slug}`
  const summary = summaryOf(post)
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`group grid h-full gap-5 ${dc.surface.card} p-5 ${dc.motion.lift}`}>
        <div className="flex items-start justify-between gap-4">
          <Glyph title={displayTitle(post.title)} />
          <span className="rounded-full border border-[var(--editable-border)] px-3 py-1 text-[11px] font-semibold text-[var(--slot4-soft-muted-text)]">{categoryOf(post)}</span>
        </div>
        <div>
          <h2 className="editable-display line-clamp-3 text-3xl leading-[1.05] text-[var(--slot4-page-text)]">{displayTitle(post.title)}</h2>
          {summary ? <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        </div>
        <div className="flex items-center justify-between border-t border-[var(--editable-border)] pt-4 text-sm font-semibold text-[var(--slot4-muted-text)]">
          <span>{fileSizeOf(post)}</span>
          <span className="inline-flex items-center gap-2 text-[var(--slot4-accent)]">Open <ArrowRight className="h-4 w-4" /></span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: 'pdf' } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : getMockPostsForTask('pdf')
  const results = posts.filter((post) => matches(post, normalized, category)).slice(0, normalized ? 80 : 36)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--editable-page-bg)] text-[var(--editable-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <EditableReveal>
            <div className="grid gap-8 rounded-[24px] border border-[var(--editable-border)] bg-white/5 p-6 md:grid-cols-[0.8fr_1.2fr] lg:p-10">
              <div>
                <p className={dc.type.eyebrow}>{pagesContent.search.hero.badge}</p>
                <h1 className="editable-display mt-5 text-5xl leading-[1.02] sm:text-7xl">{pagesContent.search.hero.title}</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
              </div>
              <form action="/search" className="self-end rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 sm:p-5">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-2xl border border-[var(--editable-border)] bg-white/5 px-4 py-3">
                  <Search className="h-5 w-5 text-[var(--slot4-accent)]" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                </label>
                <label className="mt-3 flex items-center gap-2 rounded-2xl border border-[var(--editable-border)] bg-white/5 px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-accent)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                </label>
                <button className={`mt-3 w-full ${dc.button.primary}`} type="submit">Search</button>
              </form>
            </div>
          </EditableReveal>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">{results.length} results</p>
              <h2 className="editable-display mt-2 text-4xl leading-[1.08]">{query ? `Results for ${query}` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/pdf" className={dc.button.secondary}>Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[24px] border border-dashed border-[var(--editable-border)] bg-white/5 p-10 text-center">
              <p className="editable-display text-3xl">No matching resources found.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword or category.</p>
            </div>
          )}
          <div className="mt-12"><Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel /></div>
        </section>
      </main>
    </EditableSiteShell>
  )
}



