import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBTextArea,
} from "mdb-react-ui-kit";
import Navbar from "../components/NavigationBar";
import Footer from "../components/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const ContactUs = () => {
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleContactInfo = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();
try{

}catch(e){
  
}
    
    try {
      const response = await axios.post(
        "http://localhost:4000/contact",
        contactInfo
      );

      // Check if response contains message
      if (response.data && response.data.message) {
        toast.success("Contact information sent successfully!");
        e.target.reset();
        setContactInfo("");
      } else {
        e.target.reset();
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);

      // Display error toast
      toast.error("An error occurred while sending your message.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
      <MDBRow>
        <h2 style={{ textAlign: "center", marginTop: "30px" }}>Contact Us</h2>
        <MDBCol md="6" style={{ padding: "50px" }}>
          <div className="d-flex justify-content-center">
            <Card className="p-4 contact-card">
              <Card.Title>Contact Information</Card.Title>
              <Card.Text>
                <strong>ABC Restaurant</strong>
                <br />
                1234 Gourmet St,
                <br />
                Foodie City, FC 56789
                <br />
                Phone: (123) 456-7890
                <br />
                Email: contact@abcrestaurant.com
              </Card.Text>
              <Card.Text>
                <strong>Opening Hours:</strong>
                <br />
                Mon - Fri: 9:00 AM - 9:00 PM
                <br />
                Sat - Sun: 10:00 AM - 10:00 PM
              </Card.Text>
            </Card>
          </div>
        </MDBCol>

        <MDBCol md="6" style={{ padding: "50px" }}>
          <form method="post" onSubmit={handleClick}>
            <MDBInput
              id="form4Example1"
              wrapperClass="mb-4"
              label="Name"
              name="name"
              onChange={handleContactInfo}
            />
            <MDBInput
              type="email"
              id="form4Example2"
              wrapperClass="mb-4"
              label="Email address"
              name="email"
              onChange={handleContactInfo}
            />
            <MDBTextArea
              wrapperClass="mb-4"
              id="form4Example3"
              rows={4}
              label="Message"
              name="message"
              onChange={handleContactInfo}
            />
            <MDBCheckbox
              wrapperClass="d-flex justify-content-center mb-4"
              id="form4Example4"
              label="Send me a copy of this message"
              defaultChecked
            />
            <div style={{ paddingLeft: "50px", paddingRight: "50px" }}>
              <Button variant="primary" type="submit" className=" w-100">
                Send
              </Button>
            </div>
          </form>
        </MDBCol>
        <MDBRow className="bg-body-tertiary mb-3">
          <MDBCol md="6" offsetMd="3">
            <h4 className="text-center">Find Us</h4>
            <div className="map-container" style={{ marginTop: "20px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.010173456126!2d-122.40438128468182!3d37.78512797975976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e11e003e9%3A0x64a2a7c7694c4528!2sABC%20Restaurant!5e0!3m2!1sen!2sus!4v1634676579528!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{
                  border: 0,
                  width: "100%",
                  height: "400px",
                }}
                allowFullScreen=""
                loading="lazy"
                title="Map"
              ></iframe>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBRow>
      <Footer />
    </>
  );
};

export default ContactUs;
