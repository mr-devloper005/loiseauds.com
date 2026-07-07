import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Reference library platform',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Reference library platform',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Open library', href: '/pdf' },
      secondary: { label: 'Submit', href: '/create' },
    },
  },
  footer: {
    tagline: 'Guides, reports, and resources',
    description: 'A focused reference platform for collecting, browsing, and using practical resources without noisy directory surfaces.',
    columns: [
      {
        title: 'Discovery',
        links: [{ label: 'Reference Library', href: '/pdf' }],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for clean resource discovery.',
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const

