import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  return (
    <Layout title="LogoAI - Generate Stunning Logos with AI">
      <div className="container">
        {/* Hero Section */}
        <section className="py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">Create Professional Logos in Seconds</h1>
              <p className="lead mb-4">
                Generate stunning, unique logos for your business with the power of AI. Just enter your business name, niche, and color preferences.
              </p>
              <div className="d-grid gap-2 d-md-flex">
                <button 
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => router.push('/generate')}
                >
                  Get Started
                </button>
                <Link href="/login" className="btn btn-outline-dark btn-lg px-4">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="position-relative" style={{ height: '400px' }}>
                <Image
                  src="/logo-examples.png"
                  alt="AI Generated Logo Examples"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-5">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-pencil-square text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">1. Enter Details</h3>
                  <p>Provide your business name, industry, and color preferences to guide the AI.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-stars text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">2. AI Creates Logos</h3>
                  <p>Our AI generates multiple unique logo options based on your specifications.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-sliders text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h3 className="h4 mb-3">3. Customize & Download</h3>
                  <p>Edit colors, size, and fonts, then download your perfect logo in PNG or SVG format.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-5">
          <h2 className="text-center mb-5">Features</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="bi bi-lightning-charge text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="h5">Fast Generation</h3>
                  <p>Create multiple logo options in seconds, not days or weeks.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="bi bi-palette text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="h5">Full Customization</h3>
                  <p>Edit colors, fonts, and sizes to match your brand perfectly.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="bi bi-file-earmark-arrow-down text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="h5">Multiple Formats</h3>
                  <p>Download your logo in PNG or SVG format for any use case.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="bi bi-collection text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="h5">Logo History</h3>
                  <p>Save your generated logos and access them anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-5 mb-5">
          <div className="p-5 text-center bg-primary text-white rounded-3">
            <h2 className="mb-3">Ready to Create Your Logo?</h2>
            <p className="lead mb-4">No design skills needed. Let AI do the heavy lifting for you.</p>
            <button 
              className="btn btn-light btn-lg px-4" 
              onClick={() => router.push('/generate')}
            >
              Generate Your Logo Now
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}