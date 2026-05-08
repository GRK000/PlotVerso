export function getAuthErrorMessage(message?: string) {
  const normalized = message?.toLowerCase() ?? '';
  if (normalized.includes('email rate limit exceeded')) {
    return 'Supabase ha bloqueado temporalmente el envío de emails. Para desarrollo usa Supabase local o configura SMTP propio en el proyecto remoto.';
  }
  if (normalized.includes('invalid login credentials')) {
    return 'Email o contraseña incorrectos.';
  }
  if (normalized.includes('user already registered') || normalized.includes('already registered')) {
    return 'Ese email ya tiene una cuenta. Inicia sesión o usa otro email.';
  }
  return message || 'No se pudo completar la operación de autenticación.';
}
