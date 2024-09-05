import React from 'react'
import { Card, Container, Row, Col,Button } from 'react-bootstrap';

import { FaLocationDot, } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaDoorOpen } from "react-icons/fa";
const SearchRestaurantDetails = ({restaurant}) => {

    console.log(restaurant);
    
  return (
    <Container style={{ marginTop: "40px" }}>
         <h2 className="text-center mb-4">Search Result</h2>
      <Row className="d-flex justify-content-center">
        {restaurant.map((item) => (
          <Col key={item.restaurant_id} sm={12} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={item.img} style={{ borderBottomLeftRadius:"30%",height:"250px"}}/>
              <Card.Body>
                <Card.Title>ABC Restaurant</Card.Title>
                <Card.Text>
                <FaLocationDot /> {` address : ${item.city} ${item.district}`}
                </Card.Text>
                <Card.Text> <MdOutlineAlternateEmail/>{` email : ${item.email}`}</Card.Text>
                <Card.Text> <FaPhoneAlt/>{` mobile : ${item.phone_number}`}</Card.Text>
                <Card.Text> <FaDoorOpen/>{` open Time  : ${item.opening_hours}`}</Card.Text>
                <Button variant="primary" className="w-100">
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

export default SearchRestaurantDetails