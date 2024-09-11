import React, { useState, useEffect } from "react";
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
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
const ReservationManage = () => {
  const [tableDetails, setTableDetails] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/table`);
        setTableDetails(response.data); // Assuming the data is an array of orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);
  console.log(tableDetails);
  return (
    <>
      <Navbar />
      <h2 style={{textAlign:'center',marginTop:'20px'}}>Restaurant Table Details</h2>
      <MDBRow className="bg-body-tertiary mb-2">
        <MDBCol md="10" offsetMd="1">
          {tableDetails ? (
            <MDBTable align="middle">
              <MDBTableHead>
                <tr>
                  <th scope="col">Restaurant Name</th>
                  <th scope="col">Table Details</th>                 
                  <th scope="col">price</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {tableDetails.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.restaurant_image}
                          alt=""
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                        />
                        <div className="ms-3">
                          <p className="fw-bold mb-1">{`${item.district}.${item.city}`}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.table_image}
                          alt=""
                          style={{ width: "45px", height: "45px" }}
                          className="rounded-circle"
                        />
                        <div className="ms-3">
                          <p className="fw-normal mb-1"><strong> Location </strong>{item.location}</p>
                          <p className="text-muted mb-0">
                            <strong> seats</strong><EditText
                      name="seats"
                      defaultValue={item.seats}
                      style={{ fontSize: "16px" }}
                      type="number"
                      // onSave={(event) => {
                      //   handleDeparture(schedule_ID, event);
                      // }}
                      placeholder="This is a uncontrolled component"
                      
                      showEditButton
                    />
                          </p>
                        </div>
                      </div>
                    </td>                    
                    <td>
                      <p className="fw-normal mb-1">{item.price}<strong> $</strong></p>
                    </td>
                    <td>
                      {item.status === "available" ? (
                        <MDBBadge color="primary" pill>
                          {item.status}
                        </MDBBadge>
                      ) : item.status === "occupied" ? (
                        <MDBBadge color="warning" pill>
                          {item.status}
                        </MDBBadge>
                      ) : item.status === "reserved" ? (
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
                      <Button variant="info">change Status</Button>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          ) : (
            <p>Restaurant haven't Table Details </p>
          )}
        </MDBCol>
      </MDBRow>
    </>
  );
};

export default ReservationManage;
