import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import "../style/RegistrationPage.css";
import 'bootstrap/dist/css/bootstrap.min.css';
const ResentOrder = ({offers}) => {
    
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Number of items per page
  const currentOffers = offers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleNext = () => {
    if ((currentPage + 1) * itemsPerPage < offers.length) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <Container>
      <h2 className="text-center mb-4">Current Offer Details</h2>
      <Row>
        {currentOffers.map((offer, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card style={{width:'350px'}}>
              <Card.Img variant="top" src={offer.special_offer_img} alt={offer.offer_title}style={{objectFit:'fill',height:'150px',}} />
              <Card.Body>
                <Card.Title>{offer.offer_title}</Card.Title>
                <Card.Text>{offer.offer_description}</Card.Text>
                <Card.Text>
                  <strong>Price:</strong> ${offer.food_price}
                </Card.Text>
                <Card.Text>
                  <strong>Discount:</strong> {offer.discount_percentage}%
                </Card.Text>
                <Card.Text>
                  <strong>Offer End Date:</strong> {offer.offer_end_date}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="d-flex justify-content-between">
        <Button
          variant="primary"
          onClick={handlePrevious}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={(currentPage + 1) * itemsPerPage >= offers.length}
          style={{marginLeft:'40px'}}
        >
          Next
        </Button>
      </div>
    </Container>
  )
}

export default ResentOrder