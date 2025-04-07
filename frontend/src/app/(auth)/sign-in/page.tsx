import SignInForm from '@/components/auth/sign-in-form';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return <SignInForm />;
}
