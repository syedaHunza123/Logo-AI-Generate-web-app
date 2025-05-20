import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LogoEditOptions } from '@/types';

interface LogoEditorProps {
  logoId?: number;
  imageUrl: string;
  businessName?: string;
}

export default function LogoEditor({ logoId, imageUrl, businessName }: LogoEditorProps) {
  const router = useRouter();
  const [editedImageUrl, setEditedImageUrl] = useState(imageUrl);
  const [loading, setLoading] = useState(false);
  const [editOptions, setEditOptions] = useState<LogoEditOptions>({
    logoId,
    imageUrl,
    size: 'medium',
    fontFamily: 'sans-serif',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
  });
  
  const updateEditOptions = (name: string, value: string) => {
    setEditOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyEdits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/logos/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editOptions),
      });
      
      if (!response.ok) {
        throw new Error('Failed to edit logo');
      }
      
      const data = await response.json();
      setEditedImageUrl(data.editedImageUrl);
    } catch (err) {
      console.error('Error editing logo:', err);
      alert('Failed to apply edits. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const saveLogo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/logos/save-edited', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoId,
          imageUrl: editedImageUrl,
          edited: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save edited logo');
      }
      
      alert('Logo saved successfully!');
      router.push('/my-logos');
    } catch (err) {
      console.error('Error saving logo:', err);
      alert('Failed to save the logo. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const downloadLogo = async (format: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/logos/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: editedImageUrl,
          format,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to download logo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited-logo-${businessName || 'custom'}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Error downloading logo:', err);
      alert('Failed to download the logo. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-4">Logo Editor</h2>
        
        <div className="row">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Preview</h5>
                <div className="position-relative" style={{ height: '300px' }}>
                  <Image
                    src={editedImageUrl}
                    alt="Logo preview"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Edit Options</h5>
                
                <div className="mb-3">
                  <label className="form-label">Size</label>
                  <select
                    className="form-select"
                    value={editOptions.size}
                    onChange={(e) => updateEditOptions('size', e.target.value)}
                    disabled={loading}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Font</label>
                  <select
                    className="form-select"
                    value={editOptions.fontFamily}
                    onChange={(e) => updateEditOptions('fontFamily', e.target.value)}
                    disabled={loading}
                  >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="cursive">Cursive</option>
                    <option value="fantasy">Fantasy</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Primary Color</label>
                  <div className="d-flex">
                    <input
                      type="color"
                      className="form-control form-control-color me-2"
                      value={editOptions.primaryColor}
                      onChange={(e) => updateEditOptions('primaryColor', e.target.value)}
                      disabled={loading}
                      title="Choose primary color"
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={editOptions.primaryColor}
                      onChange={(e) => updateEditOptions('primaryColor', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Secondary Color</label>
                  <div className="d-flex">
                    <input
                      type="color"
                      className="form-control form-control-color me-2"
                      value={editOptions.secondaryColor}
                      onChange={(e) => updateEditOptions('secondaryColor', e.target.value)}
                      disabled={loading}
                      title="Choose secondary color"
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={editOptions.secondaryColor}
                      onChange={(e) => updateEditOptions('secondaryColor', e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={applyEdits}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Apply Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-4">
          <div>
            <button
              className="btn btn-success me-2"
              onClick={saveLogo}
              disabled={loading}
            >
              Save Logo
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          
          <div className="dropdown">
            <button 
              className="btn btn-outline-primary dropdown-toggle" 
              type="button"
              id="downloadDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              disabled={loading}
            >
              Download
            </button>
            <ul className="dropdown-menu" aria-labelledby="downloadDropdown">
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => downloadLogo('png')}
                >
                  Download as PNG
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => downloadLogo('svg')}
                >
                  Download as SVG
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}