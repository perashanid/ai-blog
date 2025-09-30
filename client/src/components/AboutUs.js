const AboutUs = () => {
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1>About Us</h1>
        <div className="about-content">
          <section>
            <h2>Our Mission</h2>
            <p>At Intellect, we're dedicated to exploring the fascinating world of artificial intelligence and making complex AI concepts accessible to everyone. Our mission is to bridge the gap between cutting-edge AI research and practical understanding.</p>
          </section>
          
          <section>
            <h2>What We Do</h2>
            <p>We leverage advanced AI technologies to create insightful, engaging content that keeps you informed about the latest developments in artificial intelligence, machine learning, and emerging technologies.</p>
            
            <div className="features-grid">
              <div className="feature-item">
                <h3>AI-Powered Content</h3>
                <p>Our content is enhanced by artificial intelligence to provide you with the most relevant and up-to-date information.</p>
              </div>
              
              <div className="feature-item">
                <h3>Expert Insights</h3>
                <p>We combine AI capabilities with human expertise to deliver comprehensive analysis and insights.</p>
              </div>
              
              <div className="feature-item">
                <h3>Future-Focused</h3>
                <p>We explore emerging trends and technologies that will shape the future of AI and technology.</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2>Our Vision</h2>
            <p>We envision a future where artificial intelligence enhances human capabilities and creates new possibilities for innovation, creativity, and problem-solving. Through our platform, we aim to educate, inspire, and prepare our readers for this AI-driven future.</p>
          </section>
          
          <section>
            <h2>Join Our Journey</h2>
            <p>Whether you're an AI enthusiast, a technology professional, or simply curious about the future, we invite you to join us on this exciting journey of discovery and learning.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;