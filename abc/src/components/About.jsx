import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../style/about.css"; // Import your custom CSS
import back from "../images/background3.jpg";
import Navbar from "../components/NavigationBar";
const About = () => {
  return (
    <>
      <Navbar />
      <Container className="about-us" style={{ marginTop: "40px" }}>
        <div className="just">
          <Row className="justify-content-md-center">
            {" "}
            {/* g-4 class adds spacing between columns */}
            <Col md={4}>
              <div className="image-grid">
                <div className="image-item">
                  <img src={back} alt="Restaurant Interior 1" />
                </div>
                <div className="image-item">
                  <img src={back} alt="Restaurant Interior 2" />
                </div>
                <div className="image-item">
                  <img src={back} alt="Food Preparation" />
                </div>
                <div className="image-item">
                  <img src={back} alt="Food Platter" />
                </div>
              </div>
            </Col>
            <Col md={6} className="text-center">
              <h2>Welcome to [Restaurant Name]</h2>
              <p>
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                Aliqu diam amet diam et eos erat ipsum et lorem et sit, sed stet
                lorem sit.
              </p>
              <p>
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                sed stet lorem sit clita duo justo magna dolore erat amet.
              </p>
              <div className="highlights d-flex justify-content-around mb-4">
                <div className="info-box">
                  <h3>15</h3>
                  <p>Years of</p>
                  <p>Experience</p>
                </div>
                <div className="info-box">
                  <h3>50</h3>
                  <p>Popular</p>
                  <p>Master Chefs</p>
                </div>
              </div>
              <Button variant="primary">READ MORE</Button>
            </Col>
          </Row>
        </div>
      </Container>
      <div className="container text-center my-5">
        <h2 className="mb-4">Our Master Chefs</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="p-4 border rounded">
              <img
                src={back}
                className="rounded-circle mb-3"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
                alt="Chef 1"
              />
              <h5>Full Name</h5>
              <p>Designation</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 border rounded">
              <img
                src={back}
                className="rounded-circle mb-3"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
                alt="Chef 2"
              />
              <h5>Full Name</h5>
              <p>Designation</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 border rounded">
              <img
                src={back}
                className="rounded-circle mb-3"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
                alt="Chef 3"
              />
              <h5>Full Name</h5>
              <p>Designation</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
