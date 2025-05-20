import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import LogoGallery from '@/components/logo/LogoGallery';

export default function MyLogosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  if (status === 'loading') {
    return (
      <Layout title="Loading - LogoAI">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!session) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <Layout title="My Logos - LogoAI">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <LogoGallery />
          </div>
        </div>
      </div>
    </Layout>
  );
}