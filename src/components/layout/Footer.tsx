export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>LogoAI Generator</h5>
            <p className="mb-0">Create beautiful AI-generated logos for your business instantly.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="social-links">
              <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-light me-3"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light"><i className="bi bi-linkedin"></i></a>
            </div>
            <p className="mt-2 mb-0">&copy; {new Date().getFullYear()} LogoAI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}