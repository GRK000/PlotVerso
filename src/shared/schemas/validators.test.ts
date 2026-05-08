import { describe, expect, it } from 'vitest';
import { basicProfileSchema, messageSchema, photosSchema, registerSchema, reportSchema, userBookSchema } from './index';

describe('validators', () => {
  it('rejects underage users', () => {
    const result = basicProfileSchema.safeParse({
      display_name: 'Ana',
      birth_date: '2012-01-01',
      city: 'Madrid',
      country: 'España',
      gender: 'Mujer',
      interested_in: ['Hombre'],
      relationship_intent: 'Conversación'
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      confirmPassword: 'password124',
      acceptTerms: true
    });
    expect(result.success).toBe(false);
  });

  it('only allows rating read or abandoned books', () => {
    expect(userBookSchema.safeParse({ status: 'pending', rating: 4, is_favorite: false, show_on_profile: true }).success).toBe(false);
    expect(userBookSchema.safeParse({ status: 'read', rating: 4, is_favorite: false, show_on_profile: true }).success).toBe(true);
  });

  it('rejects empty chat messages and oversized reports', () => {
    expect(messageSchema.safeParse({ body: '   ' }).success).toBe(false);
    expect(reportSchema.safeParse({ reason: 'safety', details: 'x'.repeat(1201) }).success).toBe(false);
  });

  it('requires valid profile photo URLs', () => {
    expect(photosSchema.safeParse({ urls: ['not-a-url'] }).success).toBe(false);
    expect(photosSchema.safeParse({ urls: ['https://example.com/photo.jpg'] }).success).toBe(true);
  });
});
