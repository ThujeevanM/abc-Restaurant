import React, { useState, useEffect ,useContext} from "react";
import "../style/categoryMenu.css";
import axios from "axios";
import { UserContext } from "../components/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CategoryMenu = ({ items }) => {
  const [foodItem, setFoodItem] = useState([]);
  const { user } = useContext(UserContext);
  const notify = () => toast.info("You need to sign up first as a registered user");
  const navigate=useNavigate();
  useEffect(() => {
    axios.get("http://localhost:4000/menu_item/menu-items").then((response) => {
      setFoodItem(response.data);
    });
  }, []);
  const handleOrder = (id) => {
    if(user==null){
      notify();
    } else{
      const userId=user.id
       if (userId == null || userId == "undefined"||user.role!=="customer"||id==null||user==null) {
        console.log("Notify triggered"); 
        notify();
      } else {
        console.log("Notify triggered"); 
        navigate(`/Order/${userId}/${id}`);
      }
    }
    
  
  };
  return (
    <div className="container mt-5">
       <ToastContainer position="top-center" />
      {items.length>0 ? (
        <>
          <h2 className="text-center mb-4">{`${items[0].category_name} Food Items`}</h2>
          <div className="row">
            {items.map((item, index) => (
              <div key={index} className="col-md-6 mb-4 d-flex">
                <button
                  className={`card-button d-flex align-items-center ${item.available ? 'active' : 'disabled'}`}
                  disabled={!item.available} // Disable button if not available
                  onClick={()=>{handleOrder(item.
                    food_id
                    )}}
                >
                  <img
                    src={item.item_img}
                    className="img-fluid me-3"
                    alt={item.item_name}
                    style={{ width: "100px", height: "auto" }}
                  />
                  <div className="text-container">
                    <h5 className="mb-1">{`Food name: ${item.item_name}`}</h5>
                    <h6>{`Category name: ${item.category_name}`}</h6>
                    <p className="mb-1 description">{item.item_description}</p>
                    <h6 className="mb-1">{`${item.price} $`}</h6>
                  </div>
                  {!item.available && (
                    <div className="not-available-text">Item not available</div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="row">
          <h2 className="text-center mb-4">Last Added Food Items</h2>
          {foodItem.map((item, index) => (
            <div key={index} className="col-md-6 mb-4 d-flex">
              <button
                className={`card-button d-flex align-items-center ${item.available ? 'active' : 'disabled'}`}
                disabled={!item.available} // Disable button if not available
                onClick={()=>{handleOrder(item.
                  food_id
                  )}}
              >
                <img
                  src={item.item_img}
                  className="img-fluid me-3"
                  alt={item.item_name}
                  style={{ width: "100px", height: "auto" }}
                />
                <div className="text-container">
                  <h5 className="mb-1">{`Food name: ${item.item_name}`}</h5>
                  <h6>{`Category name: ${item.category_name}`}</h6>
                  <p className="mb-1 description">{item.item_description}</p>
                  <h6 className="mb-1">{`${item.price} $`}</h6>
                </div>
                {!item.available && (
                  <div className="not-available-text">Item not available</div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
