import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/SpecialOffer.css";
import Navbar from "../components/NavigationBar";
import axios from "axios"; // Add axios for making API calls
import moment from "moment";
import ResentOrder from "./ReseantOffer";

const SpecialOffer = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [todayOffer, setTodayOffer] = useState([]);
  const cardContainerRef = useRef(null);

  // Fetch special offers from the backend
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/offer/special-offers"
        );
        const today = moment().format("YYYY-MM-DD");
        setOffers(response.data);

        // Filter offers where offer_start_date matches today's date
        const filteredOffers = response.data.filter(
          (offer) => offer.offer_start_date === today
        );
        setTodayOffer(filteredOffers);
      } catch (error) {
        console.error("Error fetching special offers:", error);
      }
    };

    fetchOffers();
  }, []);

  // Auto slide every 30 seconds
  useEffect(() => {
    if (todayOffer.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % todayOffer.length);
      }, 30000); // 30 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [todayOffer]);

  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  const scrollNext = () => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollBy({
        left: 300, // Adjust scroll distance as needed
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Navbar />
      <Container className="special-offer-container" style={{ height: "50%" }}>
        <h2>Today's Special Offers</h2>

        {todayOffer.length === 0 ? (
          <p>No special offers available for today.</p>
        ) : (
          <Row
            className="align-items-center mx-3 p-3"
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Shadow effect
              height: "50%", // Ensure the row takes up full height of the container
            }}
          >
            <Col
              xs={12} // Full-width on smaller screens
              md={6}
              className="offer-details d-flex flex-column justify-content-center text-center"
            >
              <h2>{todayOffer[currentIndex]?.offer_title}</h2>
              <p>{todayOffer[currentIndex]?.offer_description}</p>
              <p className="price">$ {todayOffer[currentIndex]?.food_price}</p>
              <p className="price">
                Offer Closing Date {todayOffer[currentIndex]?.offer_end_date}
              </p>
            </Col>

            <Col
              xs={12} // Full-width on smaller screens
              md={6}
              className="offer-image d-flex justify-content-center align-items-center"
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={todayOffer[currentIndex]?.special_offer_img}
                  alt={todayOffer[currentIndex]?.title}
                  className="img-fluid"
                  style={{
                    width: "100%", // Make the image responsive
                    height: "auto", // Maintain aspect ratio
                    objectFit: "cover", // Cover the area of the container
                    borderRadius: "10px",
                  }}
                />
              </div>
            </Col>
          </Row>
        )}

        {/* Dots Navigation */}
        {todayOffer.length > 0 && (
          <Row className="justify-content-center mt-4">
            <Col xs="auto">
              <div className="dot-navigation d-flex justify-content-center">
                {todayOffer.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${currentIndex === index ? "active" : ""}`}
                    onClick={() => handleSelect(index)}
                  ></span>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </Container>

      {/* Recent Orders */}
      <ResentOrder offers={offers} />
    </>
  );
};

export default SpecialOffer;
