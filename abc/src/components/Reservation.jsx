import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/NavigationBar";
import { toast,ToastContainer } from "react-toastify"; // Import for toast notifications
import { UserContext } from "../components/UserContext";
import { useNavigate } from "react-router-dom";
const PaymentPage = () => {
  const notify = () =>
    toast.info("You need to sign up first as a registered user");
  const { id } = useParams();
  const [table, setTable] = useState(null); // Initialize as null to check loading state
  const { userId } = useContext(UserContext);
  // State for payment form
  const navigate =useNavigate()
  const [paymentData, setPaymentData] = useState({
    user_id: "",
    table_id: id,
    reservation_date: "",
    no_members: "", // Use no_members instead of no_members
    status: "pending", // Initial status for reservation
    amount: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/table/tablePayment/${id}`
        );
        setTable(response.data);

        if (response.data.length > 0) {
          setPaymentData((prevData) => ({
            ...prevData,
            amount: response.data[0].price,
          }));
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
        toast.error("Error fetching table data");
      }
    };
    fetchTableData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate number of members
    if (paymentData.no_members > table[0]?.seats) {
      toast.error(
        "Number of members cannot exceed the number of seats available."
      );
      return;
    }
    if (userId == null) {
      notify();
      return;
    }
    const updatedPaymentData = { ...paymentData, user_id: userId };

    console.log(updatedPaymentData)
    try {
      const response = await axios.post(
        "http://localhost:4000/reservation/reservation-payment",
        updatedPaymentData
      );

      if (response.status === 201) {
        toast.success("Payment and reservation successful!");
        navigator("/")
      } else {
        toast.error("Payment failed!");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("An error occurred while processing your payment.");
    }
  };

  console.log(paymentData);
  // Handle loading state
  if (!table) {
    return <p>Loading...</p>;
  }

  const {
    amount,
    paymentMethod,
    cardNumber,
    expiryDate,
    cvv,
    reservation_date,
    no_members,
  } = paymentData;

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
      <Container>
        <Row>
          <Col md={6} className="mb-4">
            <Card className="border-primary h-100" style={{ width: "98%" }}>
              <Card.Img
                variant="top"
                src={table[0]?.table_image || ""}
                alt="Table"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>Table {table[0]?.table_number || ""}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Location: {table[0]?.location || ""}
                </Card.Subtitle>
                <Card.Text>Seats: {table[0]?.seats || ""}</Card.Text>
                <Card.Text>
                  Status: <strong>{table[0]?.status || ""}</strong>
                </Card.Text>
                <Card.Text>
                  Price: $<strong>{table[0]?.price || ""}</strong>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <h2 className="my-4">Payment</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formReservationDate">
                <Form.Label>Reservation Date</Form.Label>
                <Form.Control
                  type="date"
                  name="reservation_date"
                  value={reservation_date}
                  onChange={handleChange}
                  placeholder="Select reservation date"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNoMembers">
                <Form.Label>Number of Members</Form.Label>
                <Form.Control
                  type="number"
                  name="no_members"
                  value={no_members}
                  onChange={handleChange}
                  max={table[0]?.seats || 0} // Set max value based on the table's seats
                  required
                />
              </Form.Group>
              <Form.Group controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={amount || ""} // Use amount from paymentData
                  placeholder="Enter amount"
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formPaymentMethod">
                <Form.Label>Payment Method</Form.Label>
                <Form.Control
                  as="select"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handleChange}
                  required
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
                      required
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
                      required
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
                      required
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
