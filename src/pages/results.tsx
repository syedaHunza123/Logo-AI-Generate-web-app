import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import LogoResults from '@/components/logo/LogoResults';

export default function ResultsPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [warning, setWarning] = useState('');
  const [logoData, setLogoData] = useState({
    imageUrls: [] as string[],
    businessName: '',
    niche: '',
    colors: '',
  });
  
  useEffect(() => {
    if (!router.isReady) return;
    
    const { images, businessName, niche, colors, warning } = router.query;
    
    if (!images || !businessName || !niche || !colors) {
      router.push('/generate');
      return;
    }
    
    try {
      setLogoData({
        imageUrls: JSON.parse(images as string),
        businessName: businessName as string,
        niche: niche as string,
        colors: colors as string,
      });
      
      if (warning) {
        setWarning(warning as string);
      }
      
      setLoaded(true);
    } catch (error) {
      console.error('Error parsing image URLs:', error);
      router.push('/generate');
    }
  }, [router.isReady, router.query, router]);
  
  if (!loaded) {
    return (
      <Layout title="Loading Results - LogoAI">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your logo results...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={`Logo Results for ${logoData.businessName} - LogoAI`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {warning && (
              <div className="alert alert-warning mb-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {warning}
              </div>
            )}
            
            <LogoResults
              imageUrls={logoData.imageUrls}
              businessName={logoData.businessName}
              niche={logoData.niche}
              colors={logoData.colors}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}