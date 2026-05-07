import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const blocked = ['amenaza', 'odio explícito', 'menor sexual'];
const flagged = ['insulto', 'presión', 'acoso'];

serve(async (req) => {
  const { text = '' } = await req.json().catch(() => ({ text: '' }));
  const lower = String(text).toLowerCase();
  if (blocked.some((term) => lower.includes(term))) return Response.json({ decision: 'block', reason: 'Contenido no permitido.' });
  if (flagged.some((term) => lower.includes(term))) return Response.json({ decision: 'flag', reason: 'Requiere revisión.' });
  return Response.json({ decision: 'allow', reason: null });
});
