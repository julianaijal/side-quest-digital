export const dynamic = 'force-static';

// MCP server discovery (SEP-2127 draft). Points AI agents to the Cloudflare
// AI Search MCP endpoint so they can find it without manual configuration.
// No ratified standard yet: check back and update when one lands.
export function GET() {
  const card = {
    name: 'Side Quest Digital',
    description:
      'Search the Side Quest Digital website for information about freelance SEO, web performance, AI visibility and web development services in Amsterdam.',
    version: '1.0.0',
    remotes: [
      {
        type: 'streamable-http',
        url: 'https://53f46811-756d-464c-a904-402310246256.search.ai.cloudflare.com/mcp',
      },
    ],
  };

  return new Response(JSON.stringify(card, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
