import React,{ useState,useEffect} from 'react'
import { Card, Container, Row, Col,Button } from 'react-bootstrap';
import axios  from 'axios';
import { FaLocationDot, } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaDoorOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const ViewRestaurant = () => {
    const [restaurant, setRestaurant] = useState([]);
    useEffect (()=>{
        axios.get ('http://localhost:4000/restaurant/restaurants').then((response)=>{
          setRestaurant(response.data);
      })},[])
 const navigate=useNavigate()
      const handleClick = (id) => {
        // Navigate to the restaurant view page
        navigate(`/restaurant-view/${id}`); // Adjust the path as necessary
      };
  return (
    <Container style={{ marginTop: "40px" }}>
    <h2 className="text-center mb-4"> Our Branch</h2>
    <Row className="d-flex justify-content-center">
        {restaurant.map((item) => (
          <Col key={item.restaurant_id} sm={12} md={4} className="mb-4" style={{margin:"50px"}}>
            <Card >
              <Card.Img variant="top" src={item.img} style={{ borderBottomLeftRadius:"30%",height:"250px"}}/>
              <Card.Body>
                <Card.Title>ABC Restaurant</Card.Title>
                <Card.Text>
                <FaLocationDot /> {` address : ${item.city} ${item.district}`}
                </Card.Text>
                <Card.Text> <MdOutlineAlternateEmail/>{` email : ${item.email}`}</Card.Text>
                <Card.Text> <FaPhoneAlt/>{` mobile : ${item.phone_number}`}</Card.Text>
                <Card.Text> <FaDoorOpen/>{` open Time  : ${item.opening_hours}`}</Card.Text>
                <Button variant="primary" className="w-100" onClick={()=>{handleClick(item.restaurant_id)}}>
                  View Restaurant menu
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
</Container>
  )
}

export default ViewRestaurant