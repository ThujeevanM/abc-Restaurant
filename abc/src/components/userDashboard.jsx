import React, { useContext } from "react";
import { UserContext, } from '../components/UserContext';
import Navbar from '../components/NavigationBar'
import Header from '../components/Header'
import { Container  } from "react-bootstrap";
import "../style/home.css";
import ViewRestaurant from "./ViewRestaurant";
import Footer from '../components/Footer'
import SpecialOffer from "./SpecialOffer";
const UserDashboard = () => {
  const { user  } = useContext(UserContext);
 
 
  return (
    <Container fluid >
      <Navbar/>
     <Header/>
     <ViewRestaurant/>
    
     <Footer/>
  </Container>
  );
};

export default UserDashboard;
