import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast,ToastContainer } from 'react-toastify';
import Navbar from "../components/NavigationBar";
const AddCard = () => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    orderType: "", // Added order type
    paymentType: "" // Added payment type
  });

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    city: "",
    street_address: "",
    postal_code: "",
    payment_type: "" // Added payment type
  });

  const [item, setItem] = useState({});
  const { id,userId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/menu_item/item/${id}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      });
  }, [id]);

  const addToCart = (product) => {
    const existingItem = cart.items.find((cartItem) => cartItem.id === product.id);
    let updatedItems;

    if (existingItem) {
      updatedItems = cart.items.map((cartItem) =>
        cartItem.id === product.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedItems = [...cart.items, { ...product, quantity: 1 }];
    }

    const updatedTotalAmount = updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCart({ items: updatedItems, totalAmount: updatedTotalAmount });
  };

  const removeFromCart = (product) => {
    const existingItem = cart.items.find((cartItem) => cartItem.id === product.id);
    let updatedItems;

    if (existingItem.quantity === 1) {
      updatedItems = cart.items.filter((cartItem) => cartItem.id !== product.id);
    } else {
      updatedItems = cart.items.map((cartItem) =>
        cartItem.id === product.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    }

    const updatedTotalAmount = updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCart({ items: updatedItems, totalAmount: updatedTotalAmount });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleOrderTypeChange = (e) => {
    setCart({ ...cart, orderType: e.target.value });
    if (e.target.value !== 'delivery') {
      setCustomer({ ...customer, payment_type: "" }); // Clear payment type for non-delivery orders
    }
  };
console.log(id,userId)
  const handleSubmit = async(e) => {
    if(cart.orderType==""||cart.orderType==null){
        toast.error('please select your Order type'); 
        return 
    }
    e.preventDefault();
    const orderData = {
        menu_item_id: id,
        quantity:cart.items[0].quantity        ,
      user_id: userId, // Change this as needed
      total_amount: cart.totalAmount,
      order_type: cart.orderType,
     customer
    };
console.log(orderData)
try {
    const response = await axios.post('http://localhost:4000/order/orders',orderData);
    toast.success('Order created successfully!');
    setCart({
        items: [],
        totalAmount: 0,
        orderType: "",
        paymentType: ""
    });

    setCustomer({
        name: "",
        email: "",
        address: "",
        phone: "",
        city: "",
        street_address: "",
        postal_code: "",
        payment_type: ""
    });
    console.log('Order response:', response.data);
 
} catch (error) {
    toast.error('Failed to create order');
    console.error('Error:', error);
}
  };
  console.log(cart)
  return (
    <>
    <Navbar />
    <ToastContainer position="top-center" />
    <Container className="my-5">
      <Row>
        <Col md={8}>
          <h2 style={{ marginBottom: "20px" }}>Products</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={item.item_img}
                  style={{
                    height: "200px",
                    borderBottomLeftRadius: "40px",
                    objectFit: "cover",
                  }}
                />
                <Card.Body style={{ textAlign: "left" }}>
                  <Card.Title>{`Food Name :- ${item.item_name}`}</Card.Title>
                  <Card.Text>{`Category :- ${item.category_name}`}</Card.Text>
                  <Card.Text>{`Food Description :- ${item.item_description}`}</Card.Text>
                  <Card.Text>
                    Price:- ${item.price ? item.price.toFixed(2) : "N/A"}
                  </Card.Text>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => addToCart(item)}
                      disabled={!item.price}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <h2 style={{ marginBottom: "20px" }}>Order Summary</h2>
          <Card>
            <Card.Body style={{ textAlign: "center" }}>
              <h4>Cart</h4>
              <ListGroup variant="flush">
                {cart.items.length > 0 ? (
                  cart.items.map((item, index) => (
                    <ListGroup.Item key={index}>
                      {item.item_name} - ${item.price.toFixed(2)} x {item.quantity}
                      <div style={{ marginTop: "10px" }}>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item)}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => addToCart(item)}
                          style={{ marginLeft: "10px" }}
                        >
                          Add More
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>Your cart is empty</ListGroup.Item>
                )}
              </ListGroup>
              <h4 className="mt-4">
                Total: ${cart.totalAmount.toFixed(2)}
              </h4>
              <div className="text-center">
                <Form.Group controlId="formOrderType">
                  <Form.Label>Order Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={cart.orderType}
                    onChange={handleOrderTypeChange}
                    required
                  >
                    <option value="">Select Order Type</option>
                    <option value="dine-in">Dine-in</option>
                    <option value="takeaway">Takeaway</option>
                    <option value="delivery">Delivery</option>
                  </Form.Control>
                </Form.Group>
                {cart.orderType === 'delivery' && (
                  <>
                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={customer.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={customer.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formCity">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={customer.city}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formStreetAddress">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="street_address"
                        value={customer.street_address}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formPostalCode">
                      <Form.Label>Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="postal_code"
                        value={customer.postal_code}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formPaymentType">
                      <Form.Label>Payment Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="payment_type"
                        value={customer.payment_type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Payment Type</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="cash">Cash</option>
                      </Form.Control>
                    </Form.Group>
                  </>
                )}
                <Button
                  variant="success"
                  className="mt-3"
                  type="submit"
                  disabled={cart.items.length === 0}
                  onClick={handleSubmit}
                >
                  Place Order
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default AddCard;
