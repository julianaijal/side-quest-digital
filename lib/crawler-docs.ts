// Documentation URLs for AI crawler operators. Maintained by hand: the
// update-crawlers script warns when a new operator appears without an entry
// here, and the site check pings each URL to catch dead links.

export type CrawlerDoc = {
  operator: string;
  url: string;
  note: string;
};

export const crawlerDocs: CrawlerDoc[] = [
  {
    operator: 'Google',
    url: 'https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers',
    note: 'Google-Extended, GoogleOther and related tokens',
  },
  {
    operator: 'OpenAI',
    url: 'https://developers.openai.com/docs/bots',
    note: 'GPTBot, OAI-SearchBot and ChatGPT-User',
  },
  {
    operator: 'Anthropic',
    url: 'https://support.claude.com/en/articles/8896518-robots-txt-controls',
    note: 'ClaudeBot, Claude-SearchBot and Claude-User',
  },
  {
    operator: 'Apple',
    url: 'https://support.apple.com/en-us/119829',
    note: 'Applebot-Extended for AI training opt out',
  },
  {
    operator: 'Meta/Facebook',
    url: 'https://developers.facebook.com/docs/sharing/webmasters/web-crawlers',
    note: 'meta-externalagent and Meta-ExternalFetcher',
  },
  {
    operator: 'Perplexity',
    url: 'https://docs.perplexity.ai/docs/resources/perplexity-crawlers.md',
    note: 'PerplexityBot user agent and robots.txt',
  },
  {
    operator: 'Amazon',
    url: 'https://developer.amazon.com/amazonbot',
    note: 'Amazonbot and robots.txt enforcement',
  },
  {
    operator: 'Common Crawl Foundation',
    url: 'https://commoncrawl.org/ccbot',
    note: 'CCBot, used by many AI training pipelines',
  },
  {
    operator: 'Cohere',
    url: 'https://docs.cohere.com/docs/cohere-web-crawlers',
    note: 'cohere-ai and cohere-training-data-crawler',
  },
  {
    operator: 'Mistral AI',
    url: 'https://docs.mistral.ai/robots',
    note: 'MistralAI-User, MistralAI-Training and MistralAI-Index',
  },
  {
    operator: 'Diffbot',
    url: 'https://docs.diffbot.com/docs/does-crawl-respect-robotstxt',
    note: 'Diffbot crawler and robots.txt support',
  },
  {
    operator: 'Brave',
    url: 'https://safe.search.brave.com/help/brave-search-crawler',
    note: 'Bravebot for Brave Search',
  },
];
