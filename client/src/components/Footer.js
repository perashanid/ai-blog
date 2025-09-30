import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Intellect</h3>
          <p>Exploring the future through artificial intelligence</p>
        </div>
        
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>AI-Generated Content</li>
            <li>Automated Publishing</li>
            <li>Smart Categorization</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Intellect. Powered by artificial intelligence.</p>
      </div>
    </footer>
  );
};

export default Footer;