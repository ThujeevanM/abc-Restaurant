import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import logo from "../images/logo.png";
import '../style/Footer.css';

import paymentMethods from '../images/footer-payment-methods.png'; // Payment methods image

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer_area section_padding_130_0">
      <Container>
        <Row className="footer_row">
          {/* Column 1 - Logo and About */}
          <Col md={3} className="footer_col">
            <div className="footer-logo mb-3">
              <Link to="/">
                <img src={logo} alt="ABC Restaurant Logo" style={{ width: '150px', height: 'auto' }} />
              </Link>
            </div>
            <p>Discover the best dining experience at ABC Restaurant with our delicious meals and warm hospitality.</p>
            <p className="fw-bold">Join Us on Social Media</p>
            <div className="social-media-icons">
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                <li className="list-inline-item"><a href="#"><i className="fab fa-twitter"></i></a></li>
                <li className="list-inline-item"><a href="#"><i className="fab fa-linkedin"></i></a></li>
                <li className="list-inline-item"><a href="#"><i className="fab fa-instagram"></i></a></li>
              </ul>
            </div>
          </Col>

          {/* Column 2 - About Links */}
          <Col md={2} className="footer_col">
            <h5>About Us</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </Col>

          {/* Column 3 - Support Links */}
          <Col md={2} className="footer_col">
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li><Link to="/">FAQs</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms & Conditions</Link></li>
              <li><Link to="/">Feedback</Link></li>
            </ul>
          </Col>

          {/* Column 4 - Contact Info */}
          <Col md={2} className="footer_col">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li><a href="tel:+1234567890">Call Us: +1 234 567 890</a></li>
              <li><a href="mailto:info@abcrestaurant.com">Email: info@abcrestaurant.com</a></li>
              <li><Link to="/locations">Our Locations</Link></li>
            </ul>
          </Col>

          {/* Column 5 - Payment Methods and Copyright */}
          <Col md={3} className="footer_col">
            <img src={paymentMethods} alt="Payment Methods" className="img-fluid" />
            <p className="mt-2 text-muted">© {currentYear} ABC Restaurant. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
