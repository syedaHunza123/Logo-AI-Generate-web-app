import Layout from '@/components/layout/Layout';
import LogoForm from '@/components/logo/LogoForm';
import { useSession } from 'next-auth/react';

export default function GeneratePage() {
  const { data: session } = useSession();
  
  return (
    <Layout title="Generate Logo - LogoAI">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <LogoForm />
            
            {!session && (
              <div className="alert alert-info mt-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i>
                  <div>
                    <strong>Tip:</strong> Sign in to save your logos and access them later.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}