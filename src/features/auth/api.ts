import { supabase } from '@/shared/lib/supabase';
import type { LoginInput, RegisterInput } from '@/shared/schemas';
export { getAuthErrorMessage } from './errors';

export async function register(input: RegisterInput) {
  return supabase.auth.signUp({ email: input.email, password: input.password });
}

export async function login(input: LoginInput) {
  return supabase.auth.signInWithPassword({ email: input.email, password: input.password });
}

export async function logout() {
  return supabase.auth.signOut();
}
