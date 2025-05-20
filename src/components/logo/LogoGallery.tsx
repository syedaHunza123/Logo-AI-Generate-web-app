import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Logo } from '@/types';

export default function LogoGallery() {
  const router = useRouter();
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchLogos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/logos');
      
      if (!response.ok) {
        throw new Error('Failed to fetch logos');
      }
      
      const data = await response.json();
      setLogos(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching logos:', error);
      setError('Failed to load logos. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogos();
  }, []);
  
  const handleDeleteLogo = async (logoId: number) => {
    if (confirm('Are you sure you want to delete this logo?')) {
      try {
        const response = await fetch(`/api/logos/${logoId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete logo');
        }
        
        // Remove the deleted logo from state
        setLogos(logos.filter(logo => logo.id !== logoId));
      } catch (err) {
        console.error('Error deleting logo:', err);
        alert('Failed to delete the logo. Please try again.');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your logos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button 
          className="btn btn-outline-danger ms-2"
          onClick={fetchLogos}
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (logos.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-5 text-center">
          <div className="mb-4">
            <i className="bi bi-image text-muted" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3>No Logos Yet</h3>
          <p className="text-muted mb-4">You haven't created any logos yet. Generate your first logo now!</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/generate')}
          >
            Generate Logo
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="card-title mb-0">My Logos</h2>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/generate')}
          >
            Create New Logo
          </button>
        </div>
        
        <div className="row g-4">
          {logos.map((logo) => (
            <div key={logo.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-img-top position-relative" style={{ height: '180px' }}>
                  <Image
                    src={logo.image_url}
                    alt={`Logo for ${logo.business_name}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-3"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{logo.business_name}</h5>
                  <p className="card-text text-muted small mb-0">
                    {logo.niche} • {new Date(logo.created_at).toLocaleDateString()}
                    {logo.edited && <span className="badge bg-info ms-2">Edited</span>}
                  </p>
                </div>
                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => router.push(`/edit-logo/${logo.id}`)}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteLogo(logo.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}