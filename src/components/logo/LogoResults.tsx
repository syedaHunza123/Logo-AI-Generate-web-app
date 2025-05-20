import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { LogoEditOptions } from '@/types';

interface LogoResultsProps {
  imageUrls: string[];
  businessName: string;
  niche: string;
  colors: string;
}

export default function LogoResults({ imageUrls, businessName, niche, colors }: LogoResultsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('png');
  
  const handleSaveLogo = async () => {
    if (!selectedImage) {
      alert('Please select a logo first');
      return;
    }
    
    if (!session) {
      if (confirm('You need to be logged in to save logos. Would you like to log in now?')) {
        router.push({
          pathname: '/login',
          query: { returnUrl: router.asPath },
        });
      }
      return;
    }
    
    setSaving(true);
    try {
      const response = await fetch('/api/logos/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName,
          niche,
          colors,
          imageUrl: selectedImage,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save logo');
      }
      
      const data = await response.json();
      alert('Logo saved successfully!');
      
      // Option to redirect to edit page
      if (confirm('Would you like to edit this logo?')) {
        router.push(`/edit-logo/${data.logoId}`);
      }
    } catch (err) {
      console.error('Error saving logo:', err);
      alert('Failed to save the logo. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDownload = async () => {
    if (!selectedImage) {
      alert('Please select a logo first');
      return;
    }
    
    setDownloading(true);
    try {
      const response = await fetch('/api/logos/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: selectedImage,
          format: downloadFormat,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to download logo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logo-${businessName.replace(/\s+/g, '-').toLowerCase()}.${downloadFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error downloading logo:', err);
      alert('Failed to download the logo. Please try again.');
    } finally {
      setDownloading(false);
    }
  };
  
  const handleEditLogo = () => {
    if (!selectedImage) {
      alert('Please select a logo first');
      return;
    }
    
    if (!session) {
      if (confirm('You need to be logged in to edit logos. Would you like to log in now?')) {
        router.push({
          pathname: '/login',
          query: { returnUrl: router.asPath },
        });
      }
      return;
    }
    
    router.push({
      pathname: '/edit-logo',
      query: { 
        imageUrl: selectedImage,
        businessName
      },
    });
  };
  
  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-4">Your Generated Logos</h2>
        
        <p className="text-center mb-4">
          We've created {imageUrls.length} logo designs for <strong>{businessName}</strong> in the {niche} niche with {colors} colors.
        </p>
        
        <div className="row g-4 mb-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div 
                className={`card h-100 ${selectedImage === url ? 'border-primary' : ''}`}
                onClick={() => setSelectedImage(url)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-img-top position-relative" style={{ height: '200px' }}>
                  <Image
                    src={url}
                    alt={`${businessName} logo design ${index + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-3"
                  />
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <span>Design {index + 1}</span>
                  {selectedImage === url && (
                    <span className="badge bg-primary">Selected</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedImage && (
          <div className="p-3 border rounded mb-4">
            <h5 className="mb-3">Selected Logo</h5>
            <div className="row align-items-center">
              <div className="col-md-6 text-center mb-3 mb-md-0">
                <div className="position-relative" style={{ height: '200px' }}>
                  <Image
                    src={selectedImage}
                    alt={`Selected logo for ${businessName}`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveLogo}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Logo'}
                  </button>
                  
                  <button
                    className="btn btn-info"
                    onClick={handleEditLogo}
                  >
                    Edit Logo
                  </button>
                  
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value)}
                    >
                      <option value="png">PNG</option>
                      <option value="svg">SVG</option>
                    </select>
                    <button
                      className="btn btn-success"
                      onClick={handleDownload}
                      disabled={downloading}
                    >
                      {downloading ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <button
            className="btn btn-outline-primary"
            onClick={() => router.push('/generate')}
          >
            Generate More Logos
          </button>
        </div>
      </div>
    </div>
  );
}