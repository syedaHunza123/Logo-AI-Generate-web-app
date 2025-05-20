import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import LogoEditor from '@/components/logo/LogoEditor';
import { useSession } from 'next-auth/react';

export default function EditLogoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const { imageUrl, businessName } = router.query;
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    if (status === 'authenticated' && router.isReady) {
      if (!imageUrl) {
        router.push('/my-logos');
        return;
      }
      setLoaded(true);
    }
  }, [status, router, imageUrl, router.isReady]);
  
  if (status === 'loading' || !loaded) {
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
  
  return (
    <Layout title="Edit Logo - LogoAI">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <LogoEditor 
              imageUrl={imageUrl as string} 
              businessName={businessName as string}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}