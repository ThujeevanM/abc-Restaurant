import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBTextArea,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Navbar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Inquiry = () => {
  const { userRole, user, userId } = useContext(UserContext);
  const navigate = useNavigate();

  // Define the inquiryInfo state outside of any conditions
  const [inquiryInfo, setInquiryInfo] = useState({
    id: "",
    user_name: "",
    phone_no: "",
    type: "",
    details: "",
  });
  const [inquiry, setInquiry] = useState([]);

  // This useEffect ensures that inquiryInfo.id is updated only when user.details is available
  useEffect(() => {
    if (user && userId) {
      setInquiryInfo((prevInfo) => ({
        ...prevInfo,
        id: userId,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/inquiry/get/${userId}`
        );
        setInquiry(response.data); // Assuming the data is an array of orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [inquiryInfo]);
  const handleInfo = (e) => {
    setInquiryInfo({ ...inquiryInfo, [e.target.name]: e.target.value });
  };
  console.log(inquiry);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inquiryInfo);
    if (userRole !== "customer" || user === null) {
      navigate("/");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/inquiry",
        inquiryInfo
      );
      if (response.data && response.data.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("An error occurred while sending your inquiry.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ textAlign: "center" }}>Send your Inquiry</h2>
      </div>
      <MDBRow
        className="bg-body-tertiary mb-3"
        style={{ paddingTop: "40px", paddingBottom: "40px" }}
      >
        <MDBCol md="6" offsetMd="3">
          <form onSubmit={handleSubmit}>
            <MDBInput
              id="form4Example1"
              wrapperClass="mb-4"
              label="User Name"
              name="user_name"
              onChange={handleInfo}
            />
            <MDBInput
              id="form4Example2"
              wrapperClass="mb-4"
              label="Mobile Number"
              name="phone_no"
              onChange={handleInfo}
            />
            <Form.Select
              aria-label="Default select example"
              name="type"
              onChange={handleInfo}
            >
              <option>Select your Inquiry Type</option>
              <option value="Reservation">Reservation</option>
              <option value="Menu Information">Menu Information</option>
              <option value="Order Status">Order Status</option>
              <option value="Feedback">Feedback</option>
              <option value="Catering">Catering</option>
              <option value="Special Request">Special Request</option>
              <option value="Delivery">Delivery</option>
            </Form.Select>
            <br />
            <MDBTextArea
              wrapperClass="mb-4"
              id="form4Example3"
              rows={2}
              label="Inquiry Details"
              name="details"
              onChange={handleInfo}
            />
            <div style={{ paddingLeft: "50px", paddingRight: "50px" }}>
              <Button variant="primary" type="submit" className="w-100">
                Send
              </Button>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
<br/>
<br/>
<h2 style={{textAlign:"center"}}>Your Inquiry Details</h2>
      <MDBRow className="bg-body-tertiary mb-2">
        <MDBCol md="10" offsetMd="1" >
          {inquiry ? (
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>

                  <th scope="col">Inquiry Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Response</th>
                  <th scope="col">Resolved Date</th>
                  <th scope="col">Staff Name</th>
                 
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {inquiry.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.customer_image}
                          alt=""
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                        />
                        <div className="ms-3">
                          <p className="fw-bold mb-1">{item.customer_name}</p>
                          <p className="text-muted mb-0">
                            phone No {item.phone_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{item.inquiry_type}</p>
                      <p className="text-muted mb-0">
                        <strong> Question</strong> {item.inquiry_details}
                      </p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{item.inquiry_date}</p>
                    </td>
                    <td>
                      {item.status === "Pending" ? (
                        <MDBBadge color="info" pill>
                          {item.status}
                        </MDBBadge>
                      ) : item.status === "In Progress" ? (
                        <MDBBadge color="warning" pill>
                          {item.status}
                        </MDBBadge>
                      ) : item.status === "Resolved" ? (
                        <MDBBadge color="success" pill>
                          {item.status}
                        </MDBBadge>
                      ) : (
                        <MDBBadge color="danger" pill>
                          {item.status}
                        </MDBBadge>
                      )}
                    </td>
                    <td>
                    <p className="fw-normal mb-1">{item.response}</p>
                    </td>
                    <td>
                    <p className="fw-normal mb-1">{item.resolved_date}</p>
                    </td>
                    <td>
                    <p className="fw-normal mb-1">{item.staff_name}</p>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          ) : (
            <p>your have No inquiry</p>
          )}
        </MDBCol>
      </MDBRow>
      <Footer />
    </>
  );
};

export default Inquiry;
{
  /* <MDBBadge color="success" pill>
                    Active
                  </MDBBadge> */
}
