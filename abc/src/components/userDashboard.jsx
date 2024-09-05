import React, { useContext } from "react";
import { UserContext, } from '../components/UserContext';
import Navbar from '../components/NavigationBar'
import Header from '../components/Header'
import { Container  } from "react-bootstrap";
import "../style/home.css";
import ViewRestaurant from "./ViewRestaurant";

const UserDashboard = () => {
  const { user  } = useContext(UserContext);
 
  console.log(user)
  return (
    <Container fluid >
      <Navbar/>
     <Header/>
     <ViewRestaurant/>
  </Container>
  );
};

export default UserDashboard;
