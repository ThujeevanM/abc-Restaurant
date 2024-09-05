import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../components/UserContext";
import Navbar from "../components/NavigationBar";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
const ViewOrder = () => {
  // Assuming user context provides user details
  const [orders, setOrders] = useState([]);
  const { userId } = useParams();
  const [userDate, setUserData] = useState("");
  const { user } = useContext(UserContext);
  const [refresh, setRefresh] = useState(false);
  // Fetch the user's orders
  useEffect(() => {
    //

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/order/orders/${userId}`
        );
        setOrders(response.data); // Assuming the data is an array of orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [userId,refresh]);
  console.log(user);
  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/order/delete/${orderId}`);
      toast.success(response.data.message);
      setRefresh(prev => !prev);
      // Optionally, you might want to refresh the order list or redirect
    } catch (error) {
      toast.error(error.response ? error.response.data.error : 'Failed to cancel the order');
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
      <div className="container mt-4">
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-8 offset-md-4">
              {" "}
              {/* Align to the right side */}
              <Card className="border-primary">
                <Card.Body>
                  <Card.Title>User Details</Card.Title>
                  <div>
                    {user && user.details ? (
                      <>
                        <h4>{`First Name: ${user.details.first_name}`}</h4>
                        <h4>{`Last Name: ${user.details.last_name}`}</h4>
                        {/* Other user details */}
                      </>
                    ) : (
                      <p>Loading user details...</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        <h2 style={{marginTop:"30px"}}>Order Details</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Menu Item Name</th>
              <th>Item Image</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Order Type</th>
              <th>Order Date</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderid}>
                  <td>{order.orderid}</td>
                  <td>{order.item_name}</td>
                  <td>
                    <img
                      src={order.item_image}
                      alt={order.item_name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td>{order.quantity}</td>
                  <td>${order.total_amount.toFixed(2)}</td>
                  <td>{order.order_type}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{order.order_status}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleCancelOrder(order.orderid)}
                      disabled={order.order_status !== "pending "}
                    >
                      Cancel Order
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ViewOrder;
