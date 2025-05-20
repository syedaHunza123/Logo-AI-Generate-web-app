import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import LogoEditor from '@/components/logo/LogoEditor';
import { useSession } from 'next-auth/react';
import { Logo } from '@/types';

export default function EditSavedLogoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [logo, setLogo] = useState<Logo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && id) {
      fetchLogo();
    }
  }, [status, id]);
  
  const fetchLogo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/logos/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch logo');
      }
      
      const data = await response.json();
      setLogo(data);
    } catch (error) {
      console.error('Error fetching logo:', error);
      setError('Failed to load logo. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading' || loading) {
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
  
  if (error || !logo) {
    return (
      <Layout title="Error - LogoAI">
        <div className="container">
          <div className="alert alert-danger">
            {error || 'Logo not found'}
            <button 
              className="btn btn-outline-danger ms-2"
              onClick={() => router.push('/my-logos')}
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={`Edit ${logo.business_name} Logo - LogoAI`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <LogoEditor 
              logoId={logo.id}
              imageUrl={logo.image_url}
              businessName={logo.business_name}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}