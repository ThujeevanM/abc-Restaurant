import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
 
} from "mdb-react-ui-kit";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Navbar from "../NavigationBar";
import Footer from "../Footer";
const StaffInquiry = () => {
    const { userRole, user, userId } = useContext(UserContext);
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState([]);
  
    const HandleClick=(staffId,id)=>{
        if(staffId&&id){
            navigate(`/inquiryReplay/${staffId}/${id}`)
        }
    }

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await axios.get(
              `http://localhost:4000/inquiry/staffGet`
            );
            setInquiry(response.data); // Assuming the data is an array of orders
          } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
          }
        };
    
        fetchOrders();
      }, []);



  return (
     <>
      <Navbar />
      <ToastContainer position="top-center" />
 
<h2 style={{textAlign:"center"}}>Customer Inquiry Details</h2>
      <MDBRow className="bg-body-tertiary mb-2">
        <MDBCol md="10" offsetMd="1" >
          {inquiry ? (
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Type</th>
                  <th scope="col">Question</th>
                  <th scope="col">Inquiry Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                 
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
                          
                        </div>
                      </div>
                    </td>
                    <td>
                    <p className="text-muted mb-0">
                            phone No {item.phone_number}
                          </p>
                    </td>
                    <td>
                      <p className="fw-normal mb-1">{item.inquiry_type}</p>
                      
                    </td>
                    <td>
                    <p className="text-muted mb-0">
                       {item.inquiry_details}
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
                   <Button className="primary" onClick={()=>{HandleClick(userId,item.inquiry_id)}}>Replay</Button>
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
  )
}

export default StaffInquiry