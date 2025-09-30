const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>AI Blog</h3>
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
          <h4>Technology</h4>
          <ul>
            <li>React Frontend</li>
            <li>Node.js Backend</li>
            <li>MongoDB Database</li>
            <li>OpenAI Integration</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 AI Blog. Powered by artificial intelligence.</p>
      </div>
    </footer>
  );
};

export default Footer;