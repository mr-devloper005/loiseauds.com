import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Reference Library for useful resources',
      description: 'Browse guides, reports, downloads, and practical resources in a focused reference library.',
      openGraphTitle: 'Reference Library for useful resources',
      openGraphDescription: 'Find practical guides, reports, downloads, and resource collections in one focused library.',
      keywords: ['reference library', 'resource library', 'guides', 'reports', 'downloads'],
    },
    hero: {
      badge: 'Reference Library',
      title: ['Guides, reports, and', 'resources with a sharper signal.'],
      description: 'A dark, focused library for finding useful resources, scanning context quickly, and opening the files that matter.',
      primaryCta: { label: 'Open Reference Library', href: '/pdf' },
      secondaryCta: { label: 'Submit a resource', href: '/create' },
      searchPlaceholder: 'Search resources, topics, categories',
      focusLabel: 'Library focus',
      featureCardBadge: 'Featured resource',
      featureCardTitle: 'The latest resources shape the front page.',
      featureCardDescription: 'New library entries stay central while the platform keeps routing and publishing behavior intact.',
    },
    intro: {
      badge: 'About the library',
      title: 'Built for people who return to useful references more than once.',
      paragraphs: [
        'The platform keeps resources easy to scan, search, open, and revisit.',
        'Each entry carries enough context to decide quickly whether it belongs in your reading queue.',
        'The public surface is intentionally focused on the library, so visitors are not pulled into unrelated directory paths.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A focused library for guides, reports, downloads, and reference material.',
        'Compact metadata and category cues for faster scanning.',
        'A premium reading and download workspace for each resource.',
        'Submission flow centered on resource contribution.',
      ],
      primaryLink: { label: 'Open Reference Library', href: '/pdf' },
      secondaryLink: { label: 'Contact', href: '/contact' },
    },
    cta: {
      badge: 'Contribute',
      title: 'Have a useful resource worth adding?',
      description: 'Submit a guide, report, checklist, or reference file for review and publication in the library.',
      primaryCta: { label: 'Submit a resource', href: '/create' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest resources in this section.',
    },
  },
  about: {
    badge: 'Our Story',
    title: 'A focused home for practical resources.',
    description: `${slot4BrandConfig.siteName} keeps useful guides, reports, and reference materials organized in one calm library experience.`,
    paragraphs: [
      'The public site is intentionally centered on the resource collection. Visitors can browse, search, and open entries without being routed through unrelated surfaces.',
      'Each page favors clear context, compact metadata, and direct access to the file or resource behind the entry.',
    ],
    values: [
      { title: 'Signal first', description: 'Strong hierarchy and compact metadata make useful resources easier to identify.' },
      { title: 'Designed for return visits', description: 'The library rhythm supports scanning, saving, and coming back to important references.' },
      { title: 'Focused public surface', description: 'Public navigation stays clean and keeps attention on resources.' },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Need help with a resource, collection, or submission?',
    description: 'Tell us what you want to publish, update, or clarify and we will route it to the right place.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: { title: 'Search', description: 'Search resources, topics, and categories across the library.' },
    hero: {
      badge: 'Library search',
      title: 'Find the right resource faster.',
      description: 'Use keywords and categories to locate guides, reports, checklists, and reference material.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest resources',
  },
  create: {
    metadata: { title: 'Submit', description: 'Submit a new resource for the library.' },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit a resource.',
      description: 'Use your account to open the submission workspace and prepare a new library entry.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Add a resource to the library.',
      description: 'Share the title, summary, category, file link, and supporting context for a useful resource.',
    },
    formTitle: 'Resource details',
    submitLabel: 'Submit resource',
    successTitle: 'Resource submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your library workspace.',
      description: 'Sign in to continue browsing and submitting resources from your account.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Sign in successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Account creation page for this site.',
      badge: 'Library access',
      title: 'Create your account and start contributing.',
      description: 'Create an account to access the resource submission workspace.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: { relatedTitle: 'Related reads', fallbackTitle: 'Resource context' },
    listing: { relatedTitle: 'Related records', fallbackTitle: 'Record details' },
    image: { relatedTitle: 'Related media', fallbackTitle: 'Media details' },
    profile: { relatedTitle: 'Contributed resources', fallbackDescription: 'Contributor details will appear here once available.', visitButton: 'Visit website' },
  },
} as const

