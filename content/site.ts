// All site copy lives here. Values in [brackets] are placeholders that Julian
// fills in later. Search the project for "[" to find them.

export const site = {
  name: 'Side Quest Digital',
  person: 'Julian Aijal',
  jobTitle: 'Senior SEO specialist',
  domain: 'side-quest-digital.com',
  email: '[hello@side-quest-digital.com]',
  linkedin: 'https://www.linkedin.com/in/[profile]',
  kvk: '[12345678]',
  city: 'Amsterdam',
  country: 'Netherlands',
  replyTime: '[two working days]',
  yearsExperience: '[X]',
  availability: '[X] days per month',

  meta: {
    title: 'Side Quest Digital · SEO and web development in Amsterdam',
    description:
      'Freelance SEO and web development for agencies and online stores. Get found in Google and AI search, with clear priorities and no noise.',
  },

  nav: [
    { label: 'Services', href: '#diensten' },
    { label: 'Process', href: '#werkwijze' },
    { label: 'About', href: '#over' },
  ],
  navCta: { label: 'Contact', href: '#contact' },
  navLabel: 'Main menu',
  menuOpenLabel: 'Open menu',
  menuCloseLabel: 'Close menu',
  homeLabel: 'Side Quest Digital, back to top',

  hero: {
    eyebrow: 'Freelance SEO and web development · Amsterdam',
    eyebrowMobile: 'Freelance SEO · Amsterdam',
    title: 'Get found, without the noise.',
    lead: 'I help agencies and online stores get found in Google and in AI search. With clear priorities and an eye for what your own team can take on.',
    primaryCta: 'Get in touch',
    secondaryCta: 'View services',
  },

  services: {
    eyebrow: 'Services',
    title: 'Four things, done well.',
    items: [
      {
        id: 'technical-seo',
        title: 'Technical SEO',
        text: 'Site audits, crawling and indexing, log file analysis and migrations. I find out what holds search engines back and write a plan your team can carry out.',
        tags: ['Audits', 'Log files', 'Migrations'],
        wide: true,
        snippet: 'robots',
      },
      {
        id: 'geo',
        title: 'GEO and AI visibility',
        text: 'How does your brand show up in AI search engines and assistants? I map where you are mentioned and what you can do about it.',
        wide: false,
        snippet: 'ai-answer',
      },
      {
        id: 'webdev',
        title: 'Web development',
        text: 'Fast, accessible websites that search engines understand, built from scratch or improved step by step.',
        wide: false,
        snippet: 'web-vitals',
      },
      {
        id: 'analytics',
        title: 'Analytics and tracking',
        text: 'A measurement plan, a clean implementation and dashboards you actually use. Where I can, I automate the recurring work.',
        tags: ['Measurement plan', 'Dashboards', 'Automation'],
        wide: true,
        snippet: 'dashboard',
      },
    ],
  },

  snippets: {
    robotsLabel: 'Example of a robots.txt file',
    robotsFile: 'robots.txt',
    robotsStatus: '200 OK',
    // Literal file contents: "User-agent" is robots.txt syntax, not copy.
    robots: [
      'User-agent: *',
      'Disallow: /search?',
      'Disallow: /*?sort=',
      '',
      'Sitemap: https://[yoursite].com/sitemap.xml',
    ],
    aiLabel: 'Example of an AI answer that cites a source',
    aiQuestion: 'Where can I buy a good [product] online?',
    aiAnswerBefore: 'A frequently mentioned option is ',
    aiAnswerBrand: '[your brand]',
    aiAnswerAfter: ', with a wide range and …',
    aiSource: 'Source: [yoursite].com',
    vitalsLabel: 'Thresholds for a good Core Web Vitals score',
    vitalsCaption: 'Core Web Vitals · threshold for good',
    vitals: [
      { metric: 'LCP', threshold: '≤ 2.5 s' },
      { metric: 'INP', threshold: '≤ 200 ms' },
      { metric: 'CLS', threshold: '≤ 0.1' },
    ],
    dashboardAriaLabel: 'Illustration of a dashboard',
    dashboardLabel: 'Dashboard · example',
    dashboardLabelMobile: 'Example',
    dashboardLegend: ['Organic', 'Conversions'],
  },

  steps: {
    eyebrow: 'Process',
    title: 'From first question to live and measured.',
    items: [
      { title: 'Get acquainted', text: 'A short call about your site, your goals and what has been done so far.' },
      { title: 'Research', text: 'I dig into the data: crawls, log files, analytics and the code itself.' },
      { title: 'Prioritize', text: 'You get a clear overview of what delivers the most, in order.' },
      { title: 'Deliver', text: 'I build along or guide your team until it is live and measured.' },
    ],
  },

  about: {
    eyebrow: 'About',
    title: 'Hi, I’m Julian.',
    paragraphs: [
      'I’m a senior SEO specialist with a background in frontend development. For [X] years I have worked on the visibility of large and small websites, often right where SEO and code meet.',
      'Next to my day job, I take on a limited number of projects through Side Quest Digital. That way I keep time and attention for each one.',
    ],
    facts: [
      { label: 'Based in', value: 'Amsterdam', mobile: true },
      { label: 'Works in', value: 'English and Dutch', mobile: false },
      { label: 'Available', value: '[X] days per month', mobile: true },
    ],
    // Set photo to e.g. '/julian.jpg' (in public/) once it exists.
    photo: null as string | null,
    photoAlt: '[Photo of Julian Aijal]',
    photoPlaceholderLabel: 'Space for a photo of Julian',
    photoPlaceholderText: '[Photo Julian]',
  },

  contact: {
    title: 'A question or a project?',
    text: 'Send me an email with a few lines about your site and your question.',
    copyLabel: 'Copy address',
    copiedLabel: 'Copied',
    timePrefix: 'It’s',
    timeSuffix: 'in Amsterdam · I usually reply within',
    linkedinLabel: 'Or find me on LinkedIn',
  },

  footer: {
    kvkLabel: 'KVK',
  },

  // Plain text summary served at /llms.txt.
  llms: {
    intro:
      'Side Quest Digital is the freelance practice of Julian Aijal, a senior SEO specialist with a background in frontend development, based in Amsterdam.',
    servicesTitle: 'Services',
    stepsTitle: 'Process',
    contactTitle: 'Contact',
    websiteLabel: 'Website',
    mailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    locationLabel: 'Location',
  },
} as const;

export type Site = typeof site;
export type ServiceItem = Site['services']['items'][number];
