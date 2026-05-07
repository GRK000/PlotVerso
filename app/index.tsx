import { Redirect } from 'expo-router';
import { useAuth } from '@/shared/auth/AuthProvider';
import { LoadingState } from '@/shared/ui/core';

export default function Index() {
  const { session, loading } = useAuth();
  if (loading) return <LoadingState />;
  return <Redirect href={session ? '/(tabs)/discover' : '/welcome'} />;
}
