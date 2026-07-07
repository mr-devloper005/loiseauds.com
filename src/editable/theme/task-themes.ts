import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Hedvig Letters Serif', Georgia, 'Times New Roman', serif"
const BODY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: true,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#0b0b0b',
  surface: '#1d1d1d',
  raised: '#262626',
  text: '#ffffffe6',
  muted: '#ffffffb3',
  line: '#ffffff1a',
  accent: '#24d861',
  accentSoft: '#7aff9026',
  onAccent: '#0b0b0b',
  glow: 'rgba(36,216,97,0.14)',
  radius: '1.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Reading desk', note: 'Long-form context connected to the library.' },
  listing: { ...base, kicker: 'Records', note: 'Internal record surfaces stay visually consistent.' },
  classified: { ...base, kicker: 'Notices', note: 'Internal notice pages remain functional.' },
  image: { ...base, kicker: 'Media', note: 'Visual records remain available where routed.' },
  sbm: { ...base, kicker: 'Saved links', note: 'Curated external references for internal use.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Guides, reports, and resources arranged for fast use.' },
  profile: { ...base, kicker: 'Contributor', note: 'A direct-access contributor record with contact context.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}

