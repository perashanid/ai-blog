const PrivacyPolicy = () => {
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1>Privacy Policy</h1>
        <div className="privacy-content">
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us.</p>
          </section>
          
          <section>
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Communicate with you about products, services, and events</li>
            </ul>
          </section>
          
          <section>
            <h2>Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
          </section>
          
          <section>
            <h2>Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>
          
          <section>
            <h2>Cookies</h2>
            <p>We use cookies and similar technologies to enhance your experience on our website and analyze usage patterns.</p>
          </section>
          
          <section>
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@intellect.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;