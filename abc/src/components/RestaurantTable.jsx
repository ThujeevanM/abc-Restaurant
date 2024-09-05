import React, { useState, useEffect } from "react";
import axios from "axios";
// import TableCard from './TableCard'; // Import the TableCard component
import { Container, Row, Col, Card } from "react-bootstrap";
import Navbar from "../components/NavigationBar";
import { useParams } from "react-router-dom";
import { FaLocationDot, } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaDoorOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const RestaurantTable = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate= useNavigate();
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/table/table/${id}`
        ); // Replace with your API endpoint
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  console.log(tables[0]);

  const HandleReservation = (id) => { 
        navigate(`/reservation/${id}`);
      
    }

  return (
    <>
      <Navbar />
      <Container>
        <div style={{marginTop:"30px"}}>
            <h3 style={{textAlign:"center",marginBottom:"20px"}}> Restaurant Details</h3>
          <Card>
            <Card.Img
              variant="top"
              src={tables[0].restaurant_image}
              style={{ borderBottomLeftRadius: "30%", height: "250px" }}
            />
            <Card.Body>
              <Card.Title>ABC Restaurant</Card.Title>
              <Card.Text>
                <FaLocationDot /> {` address : ${tables[0].city} ${tables[0].district}`}
              </Card.Text>
              <Card.Text>
                {" "}
                <MdOutlineAlternateEmail />
                {` email : ${tables[0].email}`}
              </Card.Text>
              <Card.Text>
                {" "}
                <FaPhoneAlt />
                {` mobile : ${tables[0].phone_number}`}
              </Card.Text>
              <Card.Text>
                {" "}
                <FaDoorOpen />
                {` open Time  : ${tables[0].opening_hours}`}
              </Card.Text>
             
            </Card.Body>
          </Card>
        </div>
        <h2 className="my-4">{`ABC Restaurant ${tables[0].district} Dining Tables`}</h2>
        <Row className="gy-4 gx-4">
          {" "}
          {/* Add gutter spacing for both vertical (gy) and horizontal (gx) */}
          {tables.length > 0 ? (
            tables.map((table) => (
              <Col key={table.table_id} md={4} className="mb-4">
                {" "}
                {/* Add margin-bottom */}
                <button
                  key={table.table_id}
                  className="col-md-4 mb-3"
                  disabled={table.status !== "available"}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor:
                      table.status === "available" ? "pointer" : "not-allowed",
                    width: "100%",
                  }}
                  onClick={()=>{HandleReservation(table.table_id)}}
                >
                  <Card
                    className={`border-primary h-100 ${
                      table.status === "available" ? "shadow-sm" : ""
                    }`}
                    style={{
                      width: "98%", // Slightly increased width for larger cards
                      opacity: table.status === "available" ? 1 : 0.6, // Dim unavailable cards
                      transform:
                        table.status === "available" ? "scale(1)" : "none", // Default scale
                      transition: "transform 0.2s ease-in-out", // Smooth scaling effect
                    }}
                    onMouseEnter={(e) => {
                      if (table.status === "available") {
                        e.currentTarget.style.transform = "scale(1.05)"; // Increase size on hover
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (table.status === "available") {
                        e.currentTarget.style.transform = "scale(1)"; // Return to normal size
                      }
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={table.table_image}
                      alt={`Table ${table.table_number}`}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>Table {table.table_number}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Location: {table.location}
                      </Card.Subtitle>
                      <Card.Text>Seats: {table.seats}</Card.Text>
                      <Card.Text>
                        Address :{" "}
                        <strong> {`${table.district}  ${table.city}`}</strong>
                      </Card.Text>
                      <Card.Text>
                        Status: <strong>{table.status}</strong>
                      </Card.Text>
                      <Card.Text>
                      Price: $<strong>{table.price}</strong>
                    </Card.Text>
                    </Card.Body>
                  </Card>
                </button>
              </Col>
            ))
          ) : (
            <p>No dining tables available</p>
          )}
        </Row>
      </Container>
    </>
  );
};

export default RestaurantTable;
