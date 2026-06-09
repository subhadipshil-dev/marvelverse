export async function GET() {
  const content = 'google.com, pub-3996858089273040, DIRECT, f08c47fec0942fa0';
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // cache for 1 day
    },
  });
}
