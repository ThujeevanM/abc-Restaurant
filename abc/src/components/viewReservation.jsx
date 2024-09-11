import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../components/UserContext";
import Navbar from "../components/NavigationBar";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";

const ViewReservation = () => {
  const [reservation, setReservation] = useState([]);
  const { id } = useParams();

  const { user } = useContext(UserContext);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    //

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/reservation/reservations/${id}`
        );
        setReservation(response.data); // Assuming the data is an array of orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [id, refresh]);
  console.log(reservation);
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
        <h2 style={{ marginTop: "30px" }}>Reservation Details</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Location</th>
              <th>Table Image</th>
              <th>Table Seat</th>
              <th> Amount</th>

              <th>reservation date</th>
              <th>reservation status</th>
              <th>No of Members</th>
            </tr>
          </thead>
          <tbody>
            {reservation.length > 0 ? (
              reservation.map((order) => (
                <tr key={order.reservation_id}>
                  <td>{order.reservation_id}</td>
                  <td>{order.location}</td>
                  <td>
                    <img
                      src={order.table_image}
                      alt={order.seats}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td>{order.seats}</td>
                  <td>${order.amount.toFixed(2)}</td>

                  <td>
                    {new Date(order.reservation_date).toLocaleDateString()}
                  </td>
                  <td>{order.reservation_status}</td>
                  <td>{order.no_members}</td>
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

export default ViewReservation;
