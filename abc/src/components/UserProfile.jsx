import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { UserContext } from "../components/UserContext";
import Navbar from "./NavigationBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import Footer from '../components/Footer'
const UserProfile = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    gender: "",
    street: "",
    img: "", // Image will be stored as base64 string
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { id } = useParams();

  // Populate formData when user data is available
  useEffect(() => {
    if (user && user.details) {
      setFormData({
        firstName: user.details.first_name || "",
        lastName: user.details.last_name || "",
        city: user.details.city || "",
        gender: user.details.gender || "",
        street: user.details.street || "",
        img: user.details.img || "", // base64 img if available
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

   // Handle input changes
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          img: reader.result, // Base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Password validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }
    if (formData.currentPassword === "") {
      toast.error("Please enter your current password.");
      return;
    }
  
    try {
      // Send the updated data to the server
      const response = await axios.put(`http://localhost:4000/profile/update-user/${id}`, formData);
  
      if (response.status === 200) {
        // If the update is successful, show success toast
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.status === 400) {
        toast.error("Current password is incorrect.");
      } else if (error.response && error.response.status === 404) {
        toast.error("User not found.");
      } else {
        toast.error("An error occurred while updating the profile.");
      }
    }
  };

console.log(formData)
  return (
    <>
      <Navbar />
      <Container>
        <ToastContainer position="top-center" />
        {user && user.details ? (
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="text-center">
                <Card.Header>
                  <h2>User Profile</h2>
                </Card.Header>
                <Card.Body>
                  <div className="profile-img">
                    <img
                      src={formData.img}
                      alt="Profile"
                      className="img-fluid rounded-circle"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group
                      as={Row}
                      controlId="formFirstName"
                      className="mt-3"
                    >
                      <Form.Label column sm={4}>
                        First Name
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group
                      as={Row}
                      controlId="formLastName"
                      className="mt-3"
                    >
                      <Form.Label column sm={4}>
                        Last Name
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formGender" className="mt-3">
                      <Form.Label column sm={4}>
                        Gender
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Check
                          type="radio"
                          id="genderMale"
                          name="gender"
                          label="Male"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleChange}
                        />
                        <Form.Check
                          type="radio"
                          id="genderFemale"
                          name="gender"
                          label="Female"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formCity" className="mt-3">
                      <Form.Label column sm={4}>
                        City
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formStreet" className="mt-3">
                      <Form.Label column sm={4}>
                        Street
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>

                    {/* Image Upload */}
                    <Form.Group as={Row} controlId="formImage" className="mt-3">
                      <Form.Label column sm={4}>
                        Profile Image
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </Col>
                    </Form.Group>

                    {/* Password Fields */}
                    <Form.Group
                      as={Row}
                      controlId="formCurrentPassword"
                      className="mt-3"
                    >
                      <Form.Label column sm={4}>
                        Current Password
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group
                      as={Row}
                      controlId="formNewPassword"
                      className="mt-3"
                    >
                      <Form.Label column sm={4}>
                        New Password
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group
                      as={Row}
                      controlId="formConfirmPassword"
                      className="mt-3"
                    >
                      <Form.Label column sm={4}>
                        Confirm Password
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      style={{ marginTop: "30px" }}
                    >
                      Update
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
      <Footer/>
    </>
  );
};

export default UserProfile;
