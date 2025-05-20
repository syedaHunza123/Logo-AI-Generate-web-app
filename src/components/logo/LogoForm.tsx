import { useState } from 'react';
import { useRouter } from 'next/router';
import { GenerateLogoParams } from '@/types';

const businessNiches = [
  'Technology',
  'Food & Restaurant',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Real Estate',
  'Travel',
  'Fitness',
  'Creative Arts',
  'Beauty & Cosmetics',
  'Construction',
  'Legal Services',
  'Entertainment',
  'Automotive',
  'Agriculture',
  'Non-profit',
  'Other'
];

export default function LogoForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<GenerateLogoParams>({
    businessName: '',
    niche: '',
    colors: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [apiWarning, setApiWarning] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName.trim() || !formData.niche || !formData.colors.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setApiWarning('');
    setIsSubmitting(true);
    
    try {
      console.log('Submitting form data:', formData);
      
      const response = await fetch('/api/logos/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate logos');
      }
      
      // Check if we're using placeholder images
      if (data.warning) {
        setApiWarning(data.warning);
      }
      
      if (!data.imageUrls || data.imageUrls.length === 0) {
        throw new Error('No logos were generated');
      }
      
      // Redirect to results page with the generated images
      router.push({
        pathname: '/results',
        query: { 
          images: JSON.stringify(data.imageUrls),
          businessName: formData.businessName,
          niche: formData.niche,
          colors: formData.colors,
          warning: data.warning || ''
        }
      });
    } catch (err) {
      console.error('Error generating logos:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during logo generation');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-4">Generate Your Logo</h2>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        {apiWarning && (
          <div className="alert alert-warning">{apiWarning}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="businessName" className="form-label">Business Name</label>
            <input
              type="text"
              className="form-control"
              id="businessName"
              name="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="niche" className="form-label">Business Niche/Industry</label>
            <select
              className="form-select"
              id="niche"
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Select your business niche</option>
              {businessNiches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="colors" className="form-label">Color Preferences</label>
            <input
              type="text"
              className="form-control"
              id="colors"
              name="colors"
              placeholder="E.g., blue and gold, earth tones, vibrant colors"
              value={formData.colors}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            <div className="form-text">Describe your preferred colors or color scheme.</div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating Logos...
              </>
            ) : (
              'Generate Logos'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}