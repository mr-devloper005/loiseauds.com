import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading desk',
    headline: 'Long-form context connected to the resource library.',
    description: 'Reading surfaces remain available for supporting context while the public experience centers on resources.',
    filterLabel: 'Choose topic',
    secondaryNote: 'Keep reading surfaces calm and supportive.',
    chips: ['Context', 'Reading', 'Support'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Internal notice records remain functional.',
    description: 'This route stays available without being promoted on the public surface.',
    filterLabel: 'Filter category',
    secondaryNote: 'Functional but not promoted.',
    chips: ['Internal', 'Records', 'Functional'],
  },
  sbm: {
    eyebrow: 'Saved links',
    headline: 'Curated links arranged as supporting resources.',
    description: 'Saved resources stay functional for existing routes and workflows.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Useful supporting references.',
    chips: ['Links', 'Resources', 'Collections'],
  },
  profile: {
    eyebrow: 'Contributor',
    headline: 'Contributor record with contact and resource context.',
    description: 'Direct-access contributor pages stay premium and useful without being promoted publicly.',
    filterLabel: 'Filter contributor category',
    secondaryNote: 'Direct access only.',
    chips: ['Identity', 'Contact', 'Contributions'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'Guides, reports, and resources arranged for fast use.',
    description: 'Browse practical resources with compact metadata, clear categories, and direct access to the file or reference behind each entry.',
    filterLabel: 'Filter resource type',
    secondaryNote: 'Resource surfaces need archive cues, file context, and direct actions.',
    chips: ['Guides', 'Reports', 'Resources'],
  },
  listing: {
    eyebrow: 'Records',
    headline: 'Structured records stay functional in the platform.',
    description: 'This route remains available for existing content and integrations without being promoted publicly.',
    filterLabel: 'Filter category',
    secondaryNote: 'Functional but not promoted.',
    chips: ['Records', 'Internal', 'Archive'],
  },
  image: {
    eyebrow: 'Media',
    headline: 'Media entries remain available where routed.',
    description: 'Visual entries stay functional for existing routes and data.',
    filterLabel: 'Filter media category',
    secondaryNote: 'Supportive visual context.',
    chips: ['Media', 'Visual', 'Archive'],
  },
} satisfies Record<TaskKey, TaskPageVoice>

