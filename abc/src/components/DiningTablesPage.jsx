import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import Navbar from "../components/NavigationBar";
const DiningTablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("http://localhost:4000/table"); // Replace with your API endpoint
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
  console.log(tables);
  return (
    <>
     <Navbar />
    <Container>
        
      <h2 className="my-4">Dining Tables</h2>
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
                    Address : <strong> {`${table.district}  ${table.city}`}</strong>
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

export default DiningTablesPage;
