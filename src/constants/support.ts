export const supportQuickActions = [
  'My video got a copyright claim',
  'How do I download songs?',
  'Find downloads & license links',
  'Help with my subscription',
  'Something else',
] as const;

export const supportFaqs = [
  {
    id: 'faq-1',
    title: 'How do I inquire about partnership opportunities with Thematic?',
    body:
      "If you're interested in partnership opportunities with Thematic, send your inquiry to info@hellothematic.com with the details of your proposal and collaboration idea.",
  },
  {
    id: 'faq-2',
    title: 'I need help using Thematic!',
    body:
      'Open a support conversation or browse the Help Center articles to find step-by-step answers for downloads, licenses, playlists, and creator workflows.',
  },
  {
    id: 'faq-3',
    title: 'How is Thematic different from other music libraries?',
    body:
      'Thematic focuses on creators and artist discovery, with curated playlists, creator-friendly licensing, and discovery tools designed around content workflows.',
  },
  {
    id: 'faq-4',
    title: "What if I'm both a content creator and a music artist?",
    body:
      'You can use the platform from both angles by switching accounts or channels. This app mirrors that flow with a persisted channel switcher in the profile menu.',
  },
  {
    id: 'faq-5',
    title: 'What are Thematic Badges?',
    body:
      'Badges are milestone markers tied to product activity. In this build they surface inside the notifications menu to match the provided UI states.',
  },
] as const;
