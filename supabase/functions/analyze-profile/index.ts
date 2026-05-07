import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

serve(async (req) => {
  const input = await req.json().catch(() => ({}));
  const text = JSON.stringify(input).toLowerCase();
  const genres = input?.reading_habits?.favorite_genres ?? input?.reader?.favorite_genres ?? [];
  const themes = Array.from(new Set([...genres.slice(0, 3), text.includes('memoria') ? 'memoria' : 'vínculos', text.includes('tensión') ? 'tensión' : 'detalle']));
  return Response.json({
    themes,
    tones: ['Directo', 'Curioso'],
    conversation_style: 'Concreta, con preguntas específicas y sin exceso de confianza.',
    ai_summary: `Interés principal en ${themes.slice(0, 3).join(', ')}.`,
    suggested_profile_tags: themes.slice(0, 5)
  });
});
