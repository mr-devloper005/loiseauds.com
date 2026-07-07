import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Download, ExternalLink, Globe2, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { Ads, getSlotSizes } from '@/lib/ads'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const relatedTask = task === 'profile' ? 'pdf' : task
  const related = (await fetchTaskPosts(relatedTask, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim()
const displayTitle = (value: string) => value.replace(/\bPDFs?\b/gi, 'Resource').replace(/\bDocuments?\b/gi, 'Resources').replace(/\bProfiles?\b/gi, 'Contributors')
const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const leadText = (post: SitePost) => {
  const lead = stripHtml(summaryText(post))
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const fileUrlOf = (post: SitePost) => getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url', 'website'])
const filenameOf = (post: SitePost) => getField(post, ['fileName', 'filename', 'name']) || `${post.slug || post.id || 'resource'}.pdf`

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task !== 'pdf' && task !== 'profile' ? <GenericDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task, label }: { task: TaskKey; label?: string }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> {label || 'Back'}
    </Link>
  )
}

function BodyContent({ post }: { post: SitePost }) {
  return <div className="article-content mt-7 max-w-none text-[1.0625rem] leading-8 text-[var(--tk-muted)]" dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function ResourceGlyph({ title, large = false }: { title: string; large?: boolean }) {
  const initials = title.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'RL'
  return <span className={`editable-display flex items-center justify-center rounded-[22px] border border-white/10 bg-[var(--tk-accent-soft)] text-[var(--tk-accent)] ${large ? 'h-28 w-28 text-6xl' : 'h-16 w-16 text-3xl'}`}>{initials}</span>
}

function Tags({ post }: { post: SitePost }) {
  if (!post.tags?.length) return null
  return <div className="mt-7 flex flex-wrap gap-2">{post.tags.slice(0, 10).map((tag) => <span key={tag} className="rounded-full border border-[var(--tk-line)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-[var(--tk-muted)]">{tag}</span>)}</div>
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = fileUrlOf(post)
  const category = categoryOf(post, 'Resource')
  const lead = leadText(post)
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--tk-line)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_55%_at_78%_10%,rgba(220,226,51,0.14),transparent_65%),radial-gradient(45%_50%_at_18%_15%,var(--tk-glow),transparent_70%)]" />
        <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <BackLink task="pdf" label="Back to Reference Library" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <EditableReveal>
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="editable-mono rounded-full bg-[var(--tk-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--tk-accent)]">Reference item</span>
                  <span className="editable-mono rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-xs font-semibold text-[var(--tk-muted)]">File access</span>
                  <span className="editable-mono rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-xs font-semibold text-[var(--tk-muted)]">{category}</span>
                </div>
                <h1 className="editable-display mt-6 max-w-5xl text-6xl leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[6.25rem]">{displayTitle(post.title)}</h1>
                {lead ? <p className="mt-8 max-w-3xl text-xl leading-9 text-[var(--tk-muted)]">{lead}</p> : null}
                <div className="mt-8 flex flex-wrap gap-3">
                  {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.primary}>Download <Download className="h-4 w-4" /></Link> : null}
                  {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.secondary}>Open in new tab <ExternalLink className="h-4 w-4" /></Link> : null}
                </div>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="rounded-[28px] border border-[var(--tk-line)] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
                <ResourceGlyph title={displayTitle(post.title)} large />
                <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-[var(--tk-muted)]">RESOURCE IDENTITY</p>
                <p className="mt-3 break-words text-lg font-semibold leading-7 text-[var(--tk-text)]">{filenameOf(post)}</p>
                <div className="mt-6 grid gap-3">
                  <MetaRow label="Category" value={category} />
                  <MetaRow label="Source" value={SITE_CONFIG.name} />
                </div>
              </div>
            </EditableReveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0 space-y-8">
            {fileUrl ? (
              <EditableReveal>
                <div className="overflow-hidden rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--tk-line)] bg-white/[0.03] p-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--tk-text)]">Preview workspace</p>
                      <p className="mt-1 text-xs text-[var(--tk-muted)]">Open the resource without leaving this page.</p>
                    </div>
                    <Link href={fileUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-xs font-semibold text-[var(--tk-muted)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">New tab</Link>
                  </div>
                  <iframe src={`${fileUrl}#toolbar=0&navpanes=0`} title={displayTitle(post.title)} className="h-[78vh] w-full bg-[var(--tk-raised)]" />
                </div>
              </EditableReveal>
            ) : null}

            <EditableReveal index={1}>
              <div className="rounded-[28px] border border-[var(--tk-line)] bg-white/5 p-6 lg:p-8">
                <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-[var(--tk-accent)]">FIELD NOTES</p>
                    <h2 className="editable-display mt-3 text-4xl leading-[1.08] sm:text-5xl">Context before download</h2>
                  </div>
                  <div>
                    <BodyContent post={post} />
                    <Tags post={post} />
                  </div>
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={2}>
              <div className="rounded-[28px] border border-[var(--tk-line)] bg-[radial-gradient(circle_at_20%_20%,rgba(36,216,97,0.14),transparent_35%),var(--tk-surface)] p-6 lg:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-[var(--tk-accent)]">ACCESS</p>
                    <h2 className="editable-display mt-2 text-4xl leading-[1.08]">Use this resource</h2>
                  </div>
                  {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.primary}>Download <Download className="h-4 w-4" /></Link> : null}
                </div>
              </div>
            </EditableReveal>
            <div><Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel /></div>
          </article>
          <PdfSidebar post={post} fileUrl={fileUrl} />
        </div>
      </section>
      <RelatedResources related={related} />
    </>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--tk-line)] bg-white/5 px-4 py-3 text-sm">
      <span className="text-[var(--tk-muted)]">{label}</span>
      <span className="text-right font-semibold text-[var(--tk-text)]">{value}</span>
    </div>
  )
}

function PdfSidebar({ post, fileUrl }: { post: SitePost; fileUrl: string }) {
  const category = categoryOf(post, 'Resource')
  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-[var(--tk-accent)]">RESOURCE CONSOLE</p>
        <h2 className="editable-display mt-3 text-3xl leading-tight">Ready when you are.</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--tk-muted)]">Preview, open, or download the source file from this workspace.</p>
        {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className={`mt-6 w-full ${dc.button.primary}`}>Download <Download className="h-4 w-4" /></Link> : null}
        {fileUrl ? <Link href={fileUrl} target="_blank" rel="noreferrer" className={`mt-3 w-full ${dc.button.secondary}`}>Open source <ExternalLink className="h-4 w-4" /></Link> : null}
      </div>
      <div className="rounded-[28px] border border-[var(--tk-line)] bg-white/5 p-6">
        <p className="text-sm font-semibold text-[var(--tk-text)]">Signal checks</p>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--tk-muted)]">
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Category: {category}</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Preview workspace included</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Download action preserved</li>
        </ul>
      </div>
    </aside>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const avatar = images[0]
  const role = getField(post, ['role', 'designation', 'company']) || 'Contributor'
  const location = getField(post, ['location', 'address', 'city'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const mapSrc = mapSrcFor(post)
  const lead = leadText(post)
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--tk-line)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(42%_48%_at_22%_12%,var(--tk-glow),transparent_70%),radial-gradient(38%_45%_at_88%_8%,rgba(255,121,253,0.11),transparent_70%)]" />
        <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <EditableReveal>
            <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
              <div className="rounded-[32px] border border-[var(--tk-line)] bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
                <div className="aspect-square overflow-hidden rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                  {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><UserRound className="h-24 w-24 text-[var(--tk-muted)]" /></div>}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role ? <span className="rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-xs font-semibold text-[var(--tk-muted)]">{role}</span> : null}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[var(--tk-accent)]">DIRECT ACCESS RECORD</p>
                <h1 className="editable-display mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-7xl">{displayTitle(post.title)}</h1>
                {lead ? <p className="mt-6 max-w-3xl text-xl leading-9 text-[var(--tk-muted)]">{lead}</p> : null}
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <MetaCard label="Location" value={location || 'Not listed'} />
                  <MetaCard label="Role" value={role} />
                  <MetaCard label="Links" value={website ? 'Available' : 'Not listed'} />
                </div>
              </div>
            </div>
          </EditableReveal>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="space-y-8">
            <EditableReveal>
              <div className="rounded-[28px] border border-[var(--tk-line)] bg-white/5 p-6 lg:p-8">
                <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-[var(--tk-accent)]">DOSSIER</p>
                    <h2 className="editable-display mt-3 text-4xl leading-[1.08] sm:text-5xl">Contributor context</h2>
                  </div>
                  <div>
                    <BodyContent post={post} />
                    <Tags post={post} />
                  </div>
                </div>
              </div>
            </EditableReveal>
            {mapSrc ? <EditableReveal index={1}><MapBox src={mapSrc} label={location || displayTitle(post.title)} /></EditableReveal> : null}
            <RelatedResources related={related} title="Contributed resources" />
          </article>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ContactCard address={location} phone={phone} email={email} website={website} />
            <div className="rounded-[28px] border border-[var(--tk-line)] bg-white/5 p-6">
              <p className="text-sm font-semibold">Verification notes</p>
              <div className="mt-4 grid gap-3 text-sm text-[var(--tk-muted)]">
                {['Direct URL only', 'Contact data preserved', 'Resource links stay in the library'].map((item) => <p key={item} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {item}</p>)}
              </div>
            </div>
            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
          </aside>
        </div>
      </section>
    </>
  )
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--tk-line)] bg-white/5 p-4">
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--tk-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-[var(--tk-text)]">{value}</p>
    </div>
  )
}

function ContactCard({ address, phone, email, website }: { address?: string; phone?: string; email?: string; website?: string }) {
  const rows = [
    ['Address', address, MapPin, address ? undefined : undefined],
    ['Phone', phone, Phone, phone ? `tel:${phone}` : undefined],
    ['Email', email, Mail, email ? `mailto:${email}` : undefined],
    ['Website', website, Globe2, website],
  ] as const
  return (
    <div className="rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="text-xs font-semibold tracking-[0.18em] text-[var(--tk-accent)]">CONTACT</p>
      <h2 className="editable-display mt-3 text-3xl">Reach point</h2>
      <div className="mt-5 grid gap-2">
        {rows.filter(([, value]) => value).map(([label, value, Icon, href]) => {
          const content = <><Icon className="h-4 w-4 text-[var(--tk-accent)]" /><span className="min-w-0 flex-1 break-words text-sm text-[var(--tk-muted)]">{value}</span></>
          return href ? <Link key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="flex gap-3 rounded-2xl border border-[var(--tk-line)] bg-white/5 p-3 transition hover:border-[var(--tk-accent)]/45">{content}</Link> : <div key={label} className="flex gap-3 rounded-2xl border border-[var(--tk-line)] bg-white/5 p-3">{content}</div>
        })}
      </div>
      {email ? <a href={`mailto:${email}`} className={`mt-5 w-full ${dc.button.primary}`}>Contact contributor</a> : null}
    </div>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function RelatedResources({ related, title = 'Related resources' }: { related: SitePost[]; title?: string }) {
  if (!related.length) return null
  return (
    <section className="mt-12 border-t border-[var(--tk-line)] pt-10">
      <div className="flex items-end justify-between gap-4">
        <h2 className="editable-display text-4xl leading-[1.08]">{title}</h2>
        <Link href="/pdf" className="text-sm font-semibold text-[var(--tk-accent)]">View library</Link>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item, index) => <RelatedResourceCard key={item.id || item.slug} post={item} index={index} />)}
      </div>
    </section>
  )
}

function RelatedResourceCard({ post, index }: { post: SitePost; index: number }) {
  return (
    <EditableReveal index={index}>
      <Link href={`/pdf/${post.slug}`} className="group block rounded-[22px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5 transition hover:border-[var(--tk-accent)]/45">
        <ResourceGlyph title={displayTitle(post.title)} />
        <h3 className="editable-display mt-5 line-clamp-2 text-2xl leading-tight">{displayTitle(post.title)}</h3>
        <span className="mt-4 inline-flex rounded-full border border-[var(--tk-line)] px-3 py-1 text-xs font-semibold text-[var(--tk-muted)]">{categoryOf(post, 'Resource')}</span>
      </Link>
    </EditableReveal>
  )
}
function GenericDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const theme = getTaskTheme(task)
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackLink task={task} />
      <p className="mt-10 text-sm font-semibold text-[var(--tk-accent)]">{theme.kicker}</p>
      <h1 className="editable-display mt-4 text-5xl leading-[1.05] sm:text-6xl">{displayTitle(post.title)}</h1>
      {leadText(post) ? <p className="mt-6 text-xl leading-9 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
      <BodyContent post={post} />
      <Tags post={post} />
      {task === 'article' ? <EditableArticleComments slug={post.slug} comments={comments} /> : null}
      {related.length ? <RelatedResources related={related} /> : null}
    </article>
  )
}







