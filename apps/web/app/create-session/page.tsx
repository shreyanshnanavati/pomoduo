import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CreateSessionForm from './CreateSessionForm';

export default async function CreateSessionPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  return <CreateSessionForm user={session.user} />;
}