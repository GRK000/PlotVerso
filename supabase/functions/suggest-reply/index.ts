import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

serve(async (req) => {
  const input = await req.json().catch(() => ({}));
  const matched = input?.matched ?? {};
  const genre = matched?.reader?.favorite_genres?.[0] ?? 'tu biblioteca';
  const book = matched?.library?.[0]?.book?.title;
  return Response.json({
    suggestions: [
      `Me interesa ${genre}. ¿Qué buscas normalmente en ese tipo de lectura?`,
      book ? `He visto que tienes ${book}. ¿Qué te llevó a elegirlo?` : '¿Qué lectura te está funcionando últimamente?',
      '¿Hay algún libro reciente que te haya cambiado una opinión o te haya dejado pensando?'
    ]
  });
});
