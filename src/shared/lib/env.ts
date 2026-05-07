import Constants from 'expo-constants';

export const env = {
  supabaseUrl:
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ??
    'http://127.0.0.1:54321',
  supabaseAnonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    ''
};
