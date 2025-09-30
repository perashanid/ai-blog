const Contact = () => {
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1>Contact Us</h1>
        <div className="contact-content">
          <p>We'd love to hear from you. Get in touch with us for any questions or feedback.</p>
          
          <div className="contact-info">
            <div className="contact-item">
              <h3>Email</h3>
              <p>contact@intellect.com</p>
            </div>
            
            <div className="contact-item">
              <h3>Address</h3>
              <p>123 AI Street<br />Tech City, TC 12345</p>
            </div>
            
            <div className="contact-item">
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Send us a message</h3>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;