import Link from 'next/link'
import { ArrowRight, Download, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditableExcerpt, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = dc.shell.section
const displayTitle = (value: string) => value.replace(/\bPDFs?\b/gi, 'Resource').replace(/\bDocuments?\b/gi, 'Resources')
const categorySlug = (value: string) => value.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function field(post: SitePost, keys: string[]) {
  const content = getContent(post)
  for (const key of keys) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

function categoryOf(post?: SitePost | null) {
  const content = getContent(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Resource'
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function ResourceGlyph({ title, large = false }: { title: string; large?: boolean }) {
  const initials = title.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'RL'
  return <span className={`editable-display flex items-center justify-center rounded-[20px] border border-white/10 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] ${large ? 'h-24 w-24 text-5xl' : 'h-14 w-14 text-2xl'}`}>{initials}</span>
}

function ResourceCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const size = field(post, ['fileSize', 'size']) || 'Resource'
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`${dc.surface.card} group flex h-full flex-col p-5 ${dc.motion.lift}`}>
        <div className="flex items-start justify-between gap-4">
          <ResourceGlyph title={displayTitle(post.title)} />
          <span className="rounded-full border border-[var(--editable-border)] px-3 py-1 text-[11px] font-semibold text-[var(--slot4-soft-muted-text)]">{categoryOf(post)}</span>
        </div>
        <h3 className="editable-display mt-6 line-clamp-2 text-2xl leading-[1.08] text-[var(--slot4-page-text)]">{displayTitle(post.title)}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 150)}</p>
        <div className="mt-6 flex items-center justify-between border-t border-[var(--editable-border)] pt-4 text-sm font-semibold text-[var(--slot4-muted-text)]">
          <span>{size}</span>
          <span className="inline-flex items-center gap-1.5 text-[var(--slot4-accent)]">Open <ArrowRight className="h-4 w-4" /></span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool[0]
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Reference Library from ${SITE_CONFIG.name}`

  return (
    <section className="relative overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-dark-bg)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_12%,rgba(36,216,97,0.18),transparent_70%)]" />
      <div className={`${container} relative py-20 sm:py-24 lg:py-[150px]`}>
        <div className="mx-auto max-w-4xl text-center">
          <EditableReveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-[var(--slot4-muted-text)]">
              <span className="rounded-full bg-[var(--slot4-accent)] px-2 py-0.5 text-xs font-semibold text-black">New</span>
              Curated resources for faster decisions
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.heroTitle} mx-auto mt-6 max-w-4xl text-[var(--slot4-page-text)]`}>{heroTitle}</h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.description}</p>
          </EditableReveal>
          <EditableReveal index={3}>
            <form action="/search" className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 rounded-[24px] border border-[var(--editable-border)] bg-white/5 p-3 sm:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 text-[var(--slot4-accent)]" />
                <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
              </label>
              <button className={dc.button.primary}>Search</button>
            </form>
          </EditableReveal>
        </div>

        {featured ? (
          <EditableReveal index={4}>
            <Link href={postHref(primaryTask, featured, primaryRoute)} className="mx-auto mt-12 grid max-w-4xl gap-5 rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 text-left shadow-[0_30px_90px_rgba(0,0,0,0.32)] md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
              <ResourceGlyph title={displayTitle(featured.title)} large />
              <div>
                <p className="text-sm font-semibold text-[var(--slot4-accent)]">Featured resource</p>
                <h2 className="editable-display mt-2 text-3xl leading-tight text-[var(--slot4-page-text)]">{displayTitle(featured.title)}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(featured, 180)}</p>
              </div>
              <span className={dc.button.secondary}>Open <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryRoute, posts }: HomeSectionProps) {
  const categories = Array.from(new Set(posts.map(categoryOf).filter(Boolean))).slice(0, 8)
  if (!categories.length) return null
  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className={`${container} py-14 sm:py-16`}>
        <EditableReveal>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className={dc.type.eyebrow}>Library shelves</p>
              <h2 className="editable-display mt-3 text-4xl leading-[1.08] sm:text-5xl">Browse by resource focus.</h2>
            </div>
            <p className="text-base leading-8 text-[var(--slot4-muted-text)]">The reference uses a sponsor-grid rhythm; here it becomes a shelf of real resource categories pulled from the library feed.</p>
          </div>
        </EditableReveal>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category, index) => (
            <EditableReveal key={category} index={index}>
              <Link href={`${primaryRoute}?category=${encodeURIComponent(categorySlug(category))}`} className="group block min-h-[130px] rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--slot4-accent)]/45">
                <Sparkles className="h-5 w-5 text-[var(--slot4-accent)] transition group-hover:scale-110" />
                <p className="editable-display mt-8 text-2xl leading-tight">{category}</p>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!activity.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-16 sm:py-20 lg:py-[120px]`}>
        <EditableReveal>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className={dc.type.eyebrow}>Recently added</p>
              <h2 className="editable-display mt-3 max-w-xl text-5xl leading-[1.04] sm:text-6xl">New resources ready to open.</h2>
            </div>
            <p className="text-lg leading-8 text-[var(--slot4-muted-text)]">Cards follow the reference treatment: rounded dark panels, compact metadata, restrained hover, and a strong serif title.</p>
          </div>
        </EditableReveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activity.map((post, index) => <ResourceCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts(timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts).slice(0, 8)
  if (!pool.length) return null
  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className={`${container} py-16 sm:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <EditableReveal>
            <div className="lg:sticky lg:top-28">
              <p className={dc.type.eyebrow}>Library workflow</p>
              <h2 className="editable-display mt-3 text-4xl leading-[1.08] sm:text-5xl">Before the search becomes a stack of tabs.</h2>
              <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">Use the library to move from rough topic to opened resource with fewer distractions.</p>
              <Link href={primaryRoute} className={`mt-7 ${dc.button.primary}`}>Browse all <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </EditableReveal>
          <div className="grid gap-4">
            {[
              ['Scan the category', 'Find the shelf that matches the task at hand.'],
              ['Read the short context', 'Use summaries and metadata before opening the file.'],
              ['Open or download', 'Move into the full resource workspace when it is the right fit.'],
            ].map(([title, text], index) => (
              <EditableReveal key={title} index={index}>
                <div className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                  <span className="editable-display text-5xl text-[var(--slot4-accent)]">0{index + 1}</span>
                  <h3 className="editable-display mt-5 text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{text}</p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-16 sm:py-20`}>
        <EditableReveal>
          <div className="rounded-[24px] border border-[var(--editable-border)] bg-[radial-gradient(circle_at_15%_20%,rgba(36,216,97,0.18),transparent_35%),var(--slot4-surface-bg)] p-8 text-center sm:p-12">
            <p className={dc.type.eyebrow}>{pagesContent.home.cta.badge}</p>
            <h2 className="editable-display mx-auto mt-4 max-w-3xl text-4xl leading-[1.06] sm:text-6xl">{pagesContent.home.cta.title}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.home.cta.description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/create" className={dc.button.primary}><Download className="h-4 w-4" /> Submit a resource</Link>
              <Link href="/contact" className={dc.button.secondary}>Contact us</Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}







