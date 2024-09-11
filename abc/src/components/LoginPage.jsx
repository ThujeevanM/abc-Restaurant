import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "../style/LoginPage.css"; // Import custom CSS for styling
import back from "../images/background3.jpg";
import Navbar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [cookies, setCookie] = useCookies(["token"]);
  const handleChange = (evt) => {
    setLoginInfo({ ...loginInfo, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/login/login",
        loginInfo
      );
      console.log(response.data.role)
      if (response.data.status === "success") {
        // Save the token in cookies
        setCookie("token", response.data.token, { path: "/" });
        toast.success("Login successful!");
       if(response.data.role=='customer'){
        navigate('/')
       }else if(response.data.role=='staff'){
        navigate('/staff')
       }else if(response.data.role=='admin'){
        navigate('/AdminDash')
       }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
      <Container className="login-container">
        <Row className="justify-content-md-center login-page">
          <Col xs={6} md={4} className="login-form">
            <h2 className="text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                />
              </Form.Group>
              <div className="mt-3 forgot_pass">
                <a href="#">Forgot password?</a>
              </div>

              <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" className="mt-3 w-50">
                  Login
                </Button>
              </div>

              <div className="social-login mt-3">
                <Button variant="danger" className="mr-2">
                  <FaGoogle /> Login with Google
                </Button>
                <Button variant="primary ">
                  <FaFacebook /> Login with Facebook
                </Button>
              </div>

              <div className="mt-3 d-flex justify-content-center text-center ">
                <p>
                  {" "}
                  Don't have an account?{" "}
                  <a href="" onClick={() => navigate("/register")}>
                    Sign Up
                  </a>
                </p>
              </div>
            </Form>
          </Col>
          <Col xs={6} md={4} className="login-image">
            <img src={back} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
