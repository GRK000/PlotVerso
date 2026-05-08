import { describe, expect, it } from 'vitest';
import { getAuthErrorMessage } from './errors';

describe('getAuthErrorMessage', () => {
  it('maps Supabase email rate limits to an actionable message', () => {
    expect(getAuthErrorMessage('email rate limit exceeded')).toContain('SMTP propio');
  });

  it('maps invalid credentials without leaking provider wording', () => {
    expect(getAuthErrorMessage('Invalid login credentials')).toBe('Email o contraseña incorrectos.');
  });
});
