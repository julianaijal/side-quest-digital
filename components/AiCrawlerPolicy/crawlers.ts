export type AiCrawler = {
  name: string;
  operator: string;
  purpose: 'search' | 'training' | 'both';
};

export const crawlers: AiCrawler[] = [
  { name: 'GPTBot', operator: 'OpenAI', purpose: 'both' },
  { name: 'ChatGPT-User', operator: 'OpenAI', purpose: 'search' },
  { name: 'OAI-SearchBot', operator: 'OpenAI', purpose: 'search' },
  { name: 'Google-Extended', operator: 'Google', purpose: 'training' },
  { name: 'Amazonbot', operator: 'Amazon', purpose: 'search' },
  { name: 'anthropic-ai', operator: 'Anthropic', purpose: 'training' },
  { name: 'ClaudeBot', operator: 'Anthropic', purpose: 'training' },
  { name: 'CCBot', operator: 'Common Crawl', purpose: 'training' },
  { name: 'Bytespider', operator: 'ByteDance', purpose: 'training' },
  { name: 'PerplexityBot', operator: 'Perplexity', purpose: 'search' },
  { name: 'Applebot-Extended', operator: 'Apple', purpose: 'training' },
  { name: 'cohere-ai', operator: 'Cohere', purpose: 'training' },
  { name: 'Meta-ExternalAgent', operator: 'Meta', purpose: 'training' },
];
