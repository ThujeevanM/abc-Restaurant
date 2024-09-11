import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/RegistrationPage.css";
import back from "../images/reg-back.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [signUpInfo, setSignUpInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [check, setCheck] = useState(false);
  console.log(check)
  const handleChange = (event) => {
    setSignUpInfo({ ...signUpInfo, [event.target.name]: event.target.value });
  };
  const handleSubmit = async(evt) => {
    evt.preventDefault();
    if (
      !signUpInfo.firstName ||
      !signUpInfo.lastName ||
      !signUpInfo.email ||
      !signUpInfo.password ||
      !signUpInfo.confirmPassword
    ) {
      toast.error("Please fill out all fields");
      return;
    }
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!check) {
      toast.error("You must accept the Terms of Use & Privacy Policy");
      return;
    }
    try {
      // Axios POST request
      const response = await axios.post('http://localhost:4000/login/register',signUpInfo);

      // Handle successful response
      toast.success(response.data.msg);
      evt.target.reset();
      navigate("/login")

    } catch (error) {
      // Handle error response
      if (error.response) {
        toast.error(error.response.data.msg || 'Registration failed');
      } else {
        toast.error('Server error');
      }
    }
   
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <Container className="registration-container">
        <Row className="justify-content-md-center">
          <Col xs={6} md={4} className="registration-form">
            <h2 className="text-center">REGISTRATION FORM</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </Form.Group>

              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Enter password"
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Confirm password"
                />
              </Form.Group>

              <Form.Group controlId="formTerms">
                <Form.Check
                  type="checkbox"
                  name="Check"
                  checked={check}
                  onChange={(e) => setCheck(e.target.checked)}
                  label="I accept the Terms of Use & Privacy Policy"
                />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button
                  variant="danger"
                  type="submit"
                  className="register-button"
                >
                  REGISTER NOW
                </Button>
              </div>
              <div className="mt-3 d-flex justify-content-center text-center ">
                <p>
                  {" "}
                  Don't have an account?{" "}
                  <a href="" onClick={() => navigate("/login")}>
                    Sign Up
                  </a>
                </p>
              </div>
            </Form>
          </Col>
          <Col xs={6} md={4} className="image-col">
            <img src={back} alt="Background" />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegistrationPage;
