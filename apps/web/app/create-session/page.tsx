import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CreateSessionForm from './CreateSessionForm';

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export default async function CreateSessionPage() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }
  
  // Convert session user to the expected User type
  const user: User = {
    id: ('id' in session.user) ? (session.user.id as string) : (session.user.email || 'anonymous'),
    name: session.user.name || undefined,
    email: session.user.email || undefined,
    image: session.user.image || undefined
  };
  
  return <CreateSessionForm user={user} />;
}