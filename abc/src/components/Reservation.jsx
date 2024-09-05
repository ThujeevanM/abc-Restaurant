import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/NavigationBar";

const PaymentPage = () => {
  const { id } = useParams();
  const [table, setTable] = useState(null); // Initialize as null to check loading state

  // State for payment form
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/table/tablePayment/${id}`); // Replace with your API endpoint
        setTable(response.data);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };
    fetchTableData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add logic to handle payment submission
      console.log("Submitting payment:", paymentData);
      // Example: await axios.post('http://localhost:4000/payment', paymentData);
      // Notify user of success or failure
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  // Handle cases where table data is not yet available
  if (!table) {
    return <p>Loading...</p>;
  }

  const { amount, paymentMethod, cardNumber, expiryDate, cvv } = paymentData;

  return (
    <>
      <Navbar />
      <Container>
        <Row>
          <Col md={6} className="mb-4">
            <Card className="border-primary h-100" style={{ width: "98%" }}>
              <Card.Img
                variant="top"
                src={table[0]?.table_image || ""} // Optional chaining with fallback
                alt="Table"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>Table {table[0]?.table_number || ''}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Location: {table[0]?.location || ''}
                </Card.Subtitle>
                <Card.Text>Seats: {table[0]?.seats || ''}</Card.Text>
                <Card.Text>
                  Status: <strong>{table[0]?.status || ''}</strong>
                </Card.Text>
                <Card.Text>
                  Price: $<strong>{table[0]?.price || ''}</strong>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <h2 className="my-4">Payment</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                />
              </Form.Group>
              <Form.Group controlId="formPaymentMethod">
                <Form.Label>Payment Method</Form.Label>
                <Form.Control
                  as="select"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handleChange}
                >
                  <option value="">Select payment method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </Form.Control>
              </Form.Group>
              {paymentMethod === "Credit Card" && (
                <>
                  <Form.Group controlId="formCardNumber">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      value={cardNumber}
                      onChange={handleChange}
                      placeholder="Enter card number"
                    />
                  </Form.Group>
                  <Form.Group controlId="formExpiryDate">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="expiryDate"
                      value={expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                    />
                  </Form.Group>
                  <Form.Group controlId="formCvv">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                      type="text"
                      name="cvv"
                      value={cvv}
                      onChange={handleChange}
                      placeholder="CVV"
                    />
                  </Form.Group>
                </>
              )}
              <Button variant="primary" type="submit">
                Submit Payment
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PaymentPage;
