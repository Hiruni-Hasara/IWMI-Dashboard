export default function Contact() {
  return (
    <>
      <section id="contact" className="contact-section">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtext">We’d love to hear from you!</p>

        {/* CONTACT FORM */}
        <form className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Write your message..." required></textarea>
          </div>

          <button type="submit" className="contact-btn">Send Message</button>
        </form>

        {/* IWMI INFO SECTION */}
        <div className="contact-info">
          <h3>IWMI Headquarters</h3>
          <p>International Water Management Institute (IWMI)</p>
          <p>127 Sunil Mawatha, Pelawatte, Battaramulla, Sri Lanka</p>

          <p><strong>Phone:</strong> +94 11 2880000</p>
          <p><strong>Email:</strong> info@iwmi.org</p>

          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} International Water Management Institute (IWMI).  
        All Rights Reserved.
      </footer>
    </>
  );
}
