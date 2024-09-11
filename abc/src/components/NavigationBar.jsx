import React, { useContext } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/NavigationBar.css";
import logo from "../images/logo.png";
import { UserContext } from "../components/UserContext";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const { userRole, handleLogout, loading, userId ,user} = useContext(UserContext);
  const navigate = useNavigate();
  console.log(user);

  if (loading) return <p>Loading...</p>;
  return (
    <Navbar bg="light" expand="lg" className="navbar-custom">
      <Navbar.Brand href="/" className="navbar-logo">
        <img src={logo} alt="ABC Restaurant Logo" />
        ABC Restaurant
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto mb-2 mb-lg-0">
          {userRole ? (
            <>
            
              {userRole === "admin" && (
                <>
                  <Nav.Link onClick={() => navigate("/AdminDash")}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/content-management")}>
                    Content Management
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/user-management")}>
                    User Management
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/reports")}>
                    Reports
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/queries")}>
                    Customer Queries
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/settings")}>
                    Settings
                  </Nav.Link>
                </>
              )}
              {userRole === "staff" && (
                <>
                  <Nav.Link onClick={() => navigate("/staff")}>Dashboard</Nav.Link>
                  <Nav.Link onClick={() => navigate("/reservationManage")}>
                    Reservations
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/staffInquiry")}>
                    Customer Queries
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/payments")}>
                    Payments
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/reports")}>
                    Reports
                  </Nav.Link>
                </>
              )}
              {userRole === "customer" && (
                <>
                  <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                  <Nav.Link onClick={() => navigate(`/reservations/${userId}`)}>
                    Reservations
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/menu")}>Menu</Nav.Link>
                  <Nav.Link onClick={() => navigate("/gallery")}>
                    Gallery
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/submit-query")}>
                    Submit Query
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/tables")}>
                    Tables
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate(`/View-order/${userId}`)}>
                    
                    View Order
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate("/specialOffer")}>
                Special Offers
              </Nav.Link>
             
                </>
              )}
            </>
          ) : (
            <>
            
              <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate("/menu")}>Menu</Nav.Link>
              <Nav.Link onClick={() => navigate("/about")}>About Us</Nav.Link>
              <Nav.Link onClick={() => navigate("/ContactUs")}>
                Contact Us
              </Nav.Link>
            
              <Nav.Link onClick={() => navigate("/specialOffer")}>
                Special Offers
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/gallery")}>
                    Gallery
                  </Nav.Link>
            </>
          )}
        </Nav>
        <div className="d-flex">
          {userRole ? (
            <>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => navigate(`/profile/${userId}`)}
              >
                Profile
              </Button>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
              <Button
                variant="outline-success"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
