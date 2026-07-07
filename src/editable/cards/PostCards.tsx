import Link from 'next/link'
import { ArrowRight, Clock3, Download, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const displayTitle = (value: string) => value.replace(/\bPDFs?\b/gi, 'Resource').replace(/\bDocuments?\b/gi, 'Resources')

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Resource'
}

function getEditableFileSize(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.fileSize === 'string' && content.fileSize) || (typeof content.size === 'string' && content.size) || 'Reference file'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

function ResourceGlyph({ title, className = 'h-16 w-16 text-3xl' }: { title: string; className?: string }) {
  const initials = title.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'RL'
  return <span className={`editable-display flex shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] ${className}`}>{initials}</span>
}

export function EditorialFeatureCard({ post, href, label = 'Featured resource' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[460px] overflow-hidden rounded-[24px] p-6 sm:p-8 lg:min-h-[560px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(36,216,97,0.2),transparent_36%),linear-gradient(135deg,#141414,#0b0b0b)]" />
        <div className="relative z-10 flex h-full min-h-[400px] flex-col justify-between lg:min-h-[500px]">
          <div className="flex items-center justify-between gap-4">
            <span className={dc.badge.accentPill}>{label}</span>
            <FileText className="h-7 w-7 text-[var(--slot4-muted-text)]" />
          </div>
          <div>
            <ResourceGlyph title={displayTitle(post.title)} className="h-24 w-24 text-5xl" />
            <h3 className="editable-display mt-8 max-w-3xl text-5xl leading-[1.02] text-white sm:text-6xl">{displayTitle(post.title)}</h3>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/70 sm:text-base">{getEditableExcerpt(post, 190)}</p>
            <span className={`mt-8 ${dc.button.primary}`}>Open resource <ArrowRight className="h-4 w-4" /></span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block ${dc.surface.card} p-5 ${dc.motion.lift}`}>
      <div className="flex items-start justify-between gap-4">
        <ResourceGlyph title={displayTitle(post.title)} />
        <span className="rounded-full border border-[var(--editable-border)] px-3 py-1 text-[11px] font-semibold text-[var(--slot4-soft-muted-text)]">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
      <h3 className="editable-display mt-3 line-clamp-3 text-3xl leading-[1.05] text-[var(--slot4-page-text)]">{displayTitle(post.title)}</h3>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 135)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--editable-border)] pt-4 text-xs font-semibold text-[var(--slot4-soft-muted-text)]">
        <span>{getEditableFileSize(post)}</span>
        <Download className="h-4 w-4 text-[var(--slot4-accent)]" />
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="editable-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-xl text-black">{index + 1}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-[var(--slot4-accent)]"><Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}</p>
          <h3 className="editable-display mt-2 line-clamp-2 text-2xl leading-tight text-[var(--slot4-page-text)]">{displayTitle(post.title)}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 ${dc.surface.card} p-5 ${dc.motion.lift} sm:grid-cols-[120px_minmax(0,1fr)]`}>
      <ResourceGlyph title={displayTitle(post.title)} className="h-24 w-24 text-5xl" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--slot4-accent)]">Resource {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-3xl leading-tight text-[var(--slot4-page-text)]">{displayTitle(post.title)}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">Open resource <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}





