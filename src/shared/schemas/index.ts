import { z } from 'zod';
import { isAdult } from '../lib/date';

export const emailSchema = z.string().email('Introduce un email válido.');
export const passwordSchema = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.');

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((value) => value, 'Debes aceptar las condiciones.')
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.'
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Introduce tu contraseña.')
});

export const relationshipIntentOptions = [
  'Relación',
  'Citas sin presión',
  'Amistad',
  'Conversación',
  'No lo tengo claro'
] as const;

export const readingFrequencyOptions = [
  'A diario',
  'Varias veces por semana',
  'De vez en cuando',
  'Por épocas',
  'Casi nunca'
] as const;

export const preferredFormatOptions = [
  'Papel',
  'Ebook',
  'Audiolibro',
  'Manga / cómic',
  'Artículos / ensayo corto',
  'Me da igual'
] as const;

export const basicProfileSchema = z.object({
  display_name: z.string().trim().min(2, 'Escribe tu nombre visible.').max(40),
  birth_date: z.string().refine(isAdult, 'Debes tener al menos 18 años.'),
  city: z.string().trim().min(2, 'Indica una ciudad.').max(80),
  country: z.string().trim().min(2, 'Indica un país.').max(80),
  gender: z.string().trim().min(1, 'Selecciona una opción.'),
  interested_in: z.array(z.string()).min(1, 'Selecciona al menos una opción.'),
  relationship_intent: z.enum(relationshipIntentOptions)
});

export const photosSchema = z.object({
  urls: z.array(z.string().url('Introduce una URL válida.')).min(1).max(6)
});

export const readerProfileSchema = z.object({
  reading_frequency: z.enum(readingFrequencyOptions),
  preferred_formats: z.array(z.enum(preferredFormatOptions)).min(1),
  languages: z.array(z.string().min(2)).min(1),
  favorite_genres: z.array(z.string().min(2)).min(1),
  disliked_genres: z.array(z.string()).default([])
});

export const bookStatusSchema = z.enum(['read', 'reading', 'pending', 'abandoned', 'favorite']);

export const userBookSchema = z
  .object({
    status: bookStatusSchema,
    rating: z.number().int().min(1).max(5).nullable().optional(),
    private_note: z.string().max(1200).nullable().optional(),
    public_comment: z.string().max(600).nullable().optional(),
    is_favorite: z.boolean().default(false),
    show_on_profile: z.boolean().default(true)
  })
  .refine((data) => !data.rating || data.status === 'read' || data.status === 'abandoned', {
    path: ['rating'],
    message: 'Solo puedes valorar libros leídos o abandonados.'
  });

export const openAnswersSchema = z.object({
  tasteBook: z.string().min(2),
  overratedBook: z.string().min(2),
  hook: z.string().min(2),
  conversationLoss: z.string().min(2)
});

export const messageSchema = z.object({
  body: z.string().trim().min(1, 'Escribe un mensaje.').max(2000)
});

export const reportSchema = z.object({
  reason: z.string().min(1, 'Selecciona un motivo.'),
  details: z.string().max(1200).optional()
});

export const aiAnalyzeOutputSchema = z.object({
  themes: z.array(z.string()),
  tones: z.array(z.string()),
  conversation_style: z.string(),
  ai_summary: z.string(),
  suggested_profile_tags: z.array(z.string())
});

export const aiSuggestReplyOutputSchema = z.object({
  suggestions: z.array(z.string().min(1)).length(3)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BasicProfileInput = z.infer<typeof basicProfileSchema>;
export type ReaderProfileInput = z.infer<typeof readerProfileSchema>;
