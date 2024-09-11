import React, { useState, useEffect } from "react";
import axios from "axios";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";

import Navbar from "../components/NavigationBar";

const ImageGallery = () => {
  // State variables
  const [images, setImages] = useState([]); // For storing the fetched images
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    // Fetch images from API
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:4000/image");
        setImages(response.data); // Assuming the API returns an array of image objects
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // If loading, show a loading message
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <MDBRow>
        {images.map((img, index) => (
          <MDBCol lg={4} md={12} className="mb-4 mb-lg-0" key={index}>
            <img
              src={img.img}
              className="w-100 shadow-1-strong rounded mb-4"
              alt={img.Description || "Image"}
            />
          </MDBCol>
        ))}
      </MDBRow>
    </>
  );
};

export default ImageGallery;
