import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  MDBInput,
  MDBRow,
  MDBCol,
  MDBTextArea,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
const InquiryReplay = () => {
   
  const { StaffId, id } = useParams();
  const [replay, setReplay] = useState({
    status:'',
    answer:'',
    staffId:StaffId
});
  const [inquiry, setInquiry] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/inquiry//inquiry/${id}`
        );
        setInquiry(response.data); // Assuming the data is an array of orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [id]);
  console.log(inquiry);

  const handleReplay=(e)=>{
setReplay({...replay,[e.target.name]:e.target.value})
  }

  const handleClick = async(e)=>{
    e.preventDefault();
    try {
        const response = await axios.put(
          `http://localhost:4000/inquiry/replay/${id}`,
          replay
        );
        if (response.data && response.data.message) {
          toast.success(response.data.message);
          navigator('/staffInquiry')
        }
      } catch (error) {
        console.error("Error submitting inquiry:", error);
        toast.error("An error occurred while sending your inquiry.");
      }
  }
  return (
    <>
     <ToastContainer position="top-center" />
      <MDBRow
        className="bg-body-tertiary mb-3"
        style={{ paddingTop: "40px", paddingBottom: "40px" }}
      >
        <h2 style={{textAlign:'center'}}>Inquiry Replay </h2>
        <MDBCol md="6" offsetMd="3">
          <Form onSubmit={handleClick}>
            <MDBInputGroup textBefore="Customer Name" className="mb-3">
              <input
                className="form-control"
                type="text"
                placeholder=" username"
                readOnly
                value={inquiry.customer_name}
              />
            </MDBInputGroup>
            <MDBInputGroup textBefore="Mobile Number" className="mb-3">
              <input
                className="form-control"
                type="text"
                placeholder=" Mobile Number"
                readOnly
                value={inquiry.phone_number}
              />
            </MDBInputGroup>
            <label htmlFor="basic-url2" className="form-label">
              Question type
            </label>
            <MDBInputGroup className="mb-3" textBefore="type">
              <input
                className="form-control"
                id="basic-url2"
                type="text"
                readOnly
                value={inquiry.inquiry_type}
              />
            </MDBInputGroup>

            <MDBInputGroup className="mb-3" textAfter="Question">
              <input
                className="form-control"
                type="text"
                placeholder="Question"
                readOnly
                value={inquiry.inquiry_details}
              />
            </MDBInputGroup>

            <MDBInputGroup className="mb-3" textAfter="Answer">
              <input
                className="form-control"
                type="text"
                placeholder="Answer"
                name="answer"
                onChange={handleReplay}
                required
              />
            </MDBInputGroup>
            <label htmlFor="basic-url2" className="form-label">
              Inquiry Status
            </label>
            <Form.Select
              aria-label="Default select example"
              name="status"
              onChange={handleReplay}
            >
              <option>Select Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </Form.Select>
<br/>
<br/>
            <div style={{ paddingLeft: "50px", paddingRight: "50px" }}>
              <Button variant="primary" type="submit" className="w-100">
                Send
              </Button>
            </div>
          </Form>
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default InquiryReplay;
