// All site copy lives here. Values in [brackets] are placeholders that Julian
// fills in later. Search the project for "[" to find them.

export const site = {
  name: 'Side Quest Digital',
  person: 'Julian Aijal',
  jobTitle: 'Senior SEO specialist',
  domain: '[domein]',
  email: '[hallo@sidequestdigital.nl]',
  linkedin: 'https://www.linkedin.com/in/[profiel]',
  kvk: '[12345678]',
  city: 'Amsterdam',
  country: 'Nederland',
  replyTime: '[twee werkdagen]',
  yearsExperience: '[X]',
  availability: '[X] dagen per maand',

  meta: {
    title: 'Side Quest Digital · Technische SEO en webontwikkeling in Amsterdam',
    description:
      'Freelance technische SEO en webontwikkeling voor bureaus en webshops. Van crawlen en indexeren tot zichtbaarheid in AI zoekmachines.',
  },

  nav: [
    { label: 'Diensten', href: '#diensten' },
    { label: 'Werkwijze', href: '#werkwijze' },
    { label: 'Over mij', href: '#over' },
  ],
  navCta: { label: 'Contact', href: '#contact' },
  navLabel: 'Hoofdmenu',
  menuOpenLabel: 'Menu openen',
  menuCloseLabel: 'Menu sluiten',
  homeLabel: 'Side Quest Digital, naar boven',

  hero: {
    eyebrow: 'Freelance SEO en webontwikkeling · Amsterdam',
    eyebrowMobile: 'Freelance SEO · Amsterdam',
    title: 'Technische SEO en snelle websites voor bureaus en webshops.',
    lead: 'Ik help teams met de technische kant van vindbaarheid: van crawlen en indexeren tot zichtbaarheid in AI zoekmachines. Grondig, rustig en in begrijpelijke taal.',
    primaryCta: 'Neem contact op',
    secondaryCta: 'Bekijk de diensten',
  },

  services: {
    eyebrow: 'Diensten',
    title: 'Vier dingen, goed gedaan.',
    items: [
      {
        id: 'technical-seo',
        title: 'Technische SEO',
        text: 'Site audits, crawlen en indexeren, logfile analyse en migraties. Ik zoek uit wat zoekmachines tegenhoudt en maak een plan dat je team kan uitvoeren.',
        tags: ['Audits', 'Logfiles', 'Migraties'],
        wide: true,
        snippet: 'robots',
      },
      {
        id: 'geo',
        title: 'GEO en AI zichtbaarheid',
        text: 'Hoe verschijnt je merk in AI zoekmachines en assistenten? Ik breng in kaart waar je genoemd wordt en wat je eraan kunt doen.',
        wide: false,
        snippet: 'ai-answer',
      },
      {
        id: 'webdev',
        title: 'Webontwikkeling',
        text: 'Snelle, toegankelijke en zoekvriendelijke websites, nieuw gebouwd of stap voor stap verbeterd.',
        wide: false,
        snippet: 'web-vitals',
      },
      {
        id: 'analytics',
        title: 'Analytics en tracking',
        text: 'Een meetplan, een nette implementatie en dashboards die je echt gebruikt. Terugkerend werk automatiseer ik waar dat kan.',
        tags: ['Meetplan', 'Dashboards', 'Automatisering'],
        wide: true,
        snippet: 'dashboard',
      },
    ],
  },

  snippets: {
    robotsLabel: 'Voorbeeld van een robots.txt bestand',
    robotsFile: 'robots.txt',
    robotsStatus: '200 OK',
    // Literal file contents: "User-agent" is robots.txt syntax, not copy.
    robots: [
      'User-agent: *',
      'Disallow: /zoeken?',
      'Disallow: /*?sort=',
      '',
      'Sitemap: https://[jouwsite].nl/sitemap.xml',
    ],
    aiLabel: 'Voorbeeld van een AI antwoord met een bronvermelding',
    aiQuestion: 'Waar koop ik een goede [product] online?',
    aiAnswerBefore: 'Een veelgenoemde optie is ',
    aiAnswerBrand: '[jouw merk]',
    aiAnswerAfter: ', met een ruim aanbod en …',
    aiSource: 'Bron: [jouwsite].nl',
    vitalsLabel: 'Drempels voor een goede Core Web Vitals score',
    vitalsCaption: 'Core Web Vitals · drempel voor goed',
    vitals: [
      { metric: 'LCP', threshold: '≤ 2,5 s' },
      { metric: 'INP', threshold: '≤ 200 ms' },
      { metric: 'CLS', threshold: '≤ 0,1' },
    ],
    dashboardAriaLabel: 'Illustratie van een dashboard',
    dashboardLabel: 'Dashboard · voorbeeld',
    dashboardLabelMobile: 'Voorbeeld',
    dashboardLegend: ['Organisch', 'Conversies'],
  },

  steps: {
    eyebrow: 'Werkwijze',
    title: 'Van eerste vraag tot iets dat live staat.',
    items: [
      { title: 'Kennismaken', text: 'Een kort gesprek over je site, je doelen en wat er al gedaan is.' },
      { title: 'Onderzoeken', text: 'Ik duik in de data: crawls, logfiles, analytics en de code zelf.' },
      { title: 'Prioriteren', text: 'Je krijgt een helder overzicht van wat het meeste oplevert, in volgorde.' },
      { title: 'Uitvoeren', text: 'Ik bouw mee of begeleid je team, tot het live staat en gemeten wordt.' },
    ],
  },

  about: {
    eyebrow: 'Over mij',
    title: 'Hoi, ik ben Julian.',
    paragraphs: [
      'Ik ben senior SEO specialist met een achtergrond in frontend development. Al [X] jaar werk ik aan de vindbaarheid van grote en kleine websites, vaak precies op het punt waar SEO en code elkaar raken.',
      'Naast mijn vaste baan neem ik via Side Quest Digital een beperkt aantal opdrachten aan. Zo houd ik tijd en aandacht voor elk project.',
    ],
    facts: [
      { label: 'Gevestigd in', value: 'Amsterdam', mobile: true },
      { label: 'Werkt in', value: 'Nederlands en Engels', mobile: false },
      { label: 'Beschikbaar', value: '[X] dagen per maand', mobile: true },
    ],
    // Set photo to e.g. '/julian.jpg' (in public/) once it exists.
    photo: null as string | null,
    photoAlt: '[Foto van Julian Aijal]',
    photoPlaceholderLabel: 'Plek voor een foto van Julian',
    photoPlaceholderText: '[Foto Julian]',
  },

  contact: {
    title: 'Een vraag of een klus?',
    text: 'Stuur me een mail met een paar regels over je site en je vraag.',
    copyLabel: 'Kopieer adres',
    copiedLabel: 'Gekopieerd',
    timePrefix: 'Het is nu',
    timeSuffix: 'in Amsterdam · reactie meestal binnen',
    linkedinLabel: 'Of vind me op LinkedIn',
  },

  footer: {
    kvkLabel: 'KVK',
  },
} as const;

export type Site = typeof site;
export type ServiceItem = Site['services']['items'][number];
