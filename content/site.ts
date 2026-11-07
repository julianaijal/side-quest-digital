// All site copy lives here. Values in [brackets] are placeholders that Julian
// fills in later. Search the project for "[" to find them.

export const site = {
  name: 'Side Quest Digital',
  person: 'Julian Aijal',
  jobTitle: 'Senior SEO specialist',
  domain: 'side-quest-digital.com',
  // The address is stored in two parts and shown as "julian [@] domain", so the
  // full address never appears in the HTML for bots to harvest. The copy button
  // joins the parts on click.
  emailUser: 'julian',
  emailDomain: 'side-quest-digital.com',
  linkedin: 'https://www.linkedin.com/in/jaijal',
  kvk: '42206724',
  city: 'Amsterdam',
  country: 'Netherlands',

  meta: {
    title: 'Side Quest Digital · SEO and web development in Amsterdam',
    description:
      'Freelance SEO and web development for agencies and online stores. Get found in Google and AI search, with clear priorities and no noise.',
  },

  nav: [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
  ],
  navCta: { label: 'Contact', href: '#contact' },
  navLabel: 'Main menu',
  menuOpenLabel: 'Open menu',
  menuCloseLabel: 'Close menu',
  homeLabel: 'Side Quest Digital, back to top',
  skipLabel: 'Skip to content',

  hero: {
    eyebrow: 'Freelance SEO and web development · Amsterdam',
    eyebrowMobile: 'Freelance SEO · Amsterdam',
    title: 'Get found, without the noise.',
    lead: 'I help agencies and online stores get found in Google and in AI search. With clear priorities and an eye for what your own team can take on.',
    primaryCta: 'Get in touch',
    secondaryCta: 'View services',
  },

  services: {
    title: 'Five things, done well.',
    items: [
      {
        id: 'technical-seo',
        title: 'Technical SEO',
        text: 'Site audits, crawling and indexing, log file analysis and migrations. I find out what holds search engines back and write a plan your team can carry out.',
        wide: true,
        snippet: 'robots',
      },
      {
        id: 'performance',
        title: 'Performance',
        text: 'Faster pages for visitors and search engines. I measure Core Web Vitals with real user data, find what slows your site down and fix it with your developers.',
        wide: false,
        snippet: 'web-vitals',
      },
      {
        id: 'geo',
        title: 'GEO and AI visibility',
        text: 'How does your brand show up in AI search engines and assistants? I map where you are mentioned and what you can do about it.',
        wide: false,
        snippet: 'ai-answer',
      },
      {
        id: 'analytics',
        title: 'Analytics and tracking',
        text: 'A measurement plan, a clean implementation and dashboards you actually use. Where I can, I automate the recurring work.',
        wide: true,
        snippet: 'dashboard',
      },
      {
        id: 'webdev',
        title: 'Web development',
        text: 'Frontend development, from new builds to step by step improvements. Fast, accessible components and design systems that your team can keep building on.',
        wide: true,
        // Spans the full last row so five cards fill the bento without a gap.
        full: true,
        snippet: 'component',
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
    componentLabel: 'Example of an accessible component in code',
    componentFile: 'ServiceCard.tsx',
    componentLang: 'TSX',
    // Literal code: attribute names like "aria-labelledby" are syntax, not copy.
    component: [
      '<article aria-labelledby={id}>',
      '  <h3 id={id}>{title}</h3>',
      '  <p>{text}</p>',
      '</article>',
    ],
    dashboardAriaLabel: 'Illustration of a dashboard',
    dashboardLabel: 'Dashboard · example',
    dashboardLabelMobile: 'Example',
    dashboardLegend: ['Organic', 'Conversions'],
  },

  // Not shown for now (see ROADMAP.md). Kept so the Steps section can return.
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
    title: 'Hi, I’m Julian.',
    paragraphs: [
      'I’ve worked in SEO since 2011, for large media sites and international platforms, with a few years as a frontend developer along the way. That’s why I’m most at home where SEO and code meet.',
      'Through Side Quest Digital I take on a limited number of projects, so each one gets proper time and attention.',
    ],
    facts: [
      { label: 'Based in', value: 'Amsterdam', mobile: true },
      { label: 'In SEO since', value: '2011', mobile: true },
      { label: 'Works in', value: 'English and Dutch', mobile: false },
    ],
    // The photo block only shows once this is set, e.g. '/julian.jpg' (in public/).
    photo: null as string | null,
    photoAlt: '[Photo of Julian Aijal]',
  },

  contact: {
    title: 'A question or a project?',
    text: 'Send me an email with a few lines about your site and your question.',
    copyLabel: 'Copy address',
    copiedLabel: 'Copied',
    timePrefix: 'It’s',
    timeSuffix: 'in Amsterdam.',
    linkedinLabel: 'Or find me on LinkedIn',
  },

  footer: {
    kvkLabel: 'KVK',
  },

  notFound: {
    metaTitle: 'Page not found · Side Quest Digital',
    title: 'This page does not exist.',
    text: 'The link may be old, or the address has a typo. Everything I offer is on the homepage.',
    homeLabel: 'Go to the homepage',
  },

  privacy: {
    linkLabel: 'Privacy',
    metaTitle: 'Privacy · Side Quest Digital',
    metaDescription:
      'How Side Quest Digital handles visitor data: Google Analytics only with your consent, and email used only to reply.',
    backLabel: 'Back to the homepage',
    title: 'Privacy',
    updated: 'Last updated November 2026',
    sections: [
      {
        title: 'Who is responsible',
        paragraphs: [
          'This site belongs to Side Quest Digital, the freelance practice of Julian Aijal in Amsterdam (KVK 42206724). For questions about your data, use the email address under Contact on the homepage.',
        ],
      },
      {
        title: 'Analytics',
        paragraphs: [
          'I use Google Analytics, loaded through Google Tag Manager, to see how people find and use this site. It only sets cookies after you click Allow in the cookie bar.',
          'Without your consent, Google receives a basic signal without cookies, so visits can still be counted in total.',
          'With your consent, Google Analytics stores a random visitor ID in a cookie (_ga) for up to two years. It collects the pages you view, how you arrived, your device type and an approximate location. Google does not store your IP address. Data is kept for two months.',
          'Google processes this data on my behalf under its data processing terms. Sharing data with Google for its own purposes is turned off.',
        ],
      },
      {
        title: 'Hosting',
        paragraphs: [
          'The site runs on Cloudflare, which processes technical data such as IP addresses to deliver the site and protect it against abuse.',
        ],
      },
      {
        title: 'Email',
        paragraphs: [
          'If you send me an email, I use your address and message only to reply and to follow up on your question. Mail is forwarded by Cloudflare and stored in Gmail. I do not add you to a mailing list.',
        ],
      },
      {
        title: 'Your choices and rights',
        paragraphs: [
          'You can change your choice at any time with Cookie settings at the bottom of every page. Choosing Decline removes the analytics cookies. If your browser sends a Global Privacy Control signal, analytics stays off and the cookie bar does not appear.',
          'You have the right to access, correct or delete your data. Send me an email and I will take care of it. You can also file a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).',
        ],
      },
    ],
  },

  cookies: {
    label: 'Cookie choice',
    text: 'I use Google Analytics to see how people find this site. It only sets cookies if you allow it.',
    acceptLabel: 'Allow',
    declineLabel: 'Decline',
    settingsLabel: 'Cookie settings',
  },

  // Plain text summary served at /llms.txt.
  llms: {
    intro:
      'Side Quest Digital is the freelance practice of Julian Aijal, a senior SEO specialist with a background in frontend development, based in Amsterdam.',
    servicesTitle: 'Services',
    contactTitle: 'Contact',
    websiteLabel: 'Website',
    mailLabel: 'Email',
    linkedinLabel: 'LinkedIn',
    locationLabel: 'Location',
  },
} as const;

export type Site = typeof site;
export type ServiceItem = Site['services']['items'][number];
