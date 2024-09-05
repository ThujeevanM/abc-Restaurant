import React, { useEffect, useState,useContext } from "react";
import Navbar from "../components/NavigationBar";
import axios from "axios";
import CategoryMenu from "./CategoryMenu";
import {
  Form,
  Button,
  FormControl,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "../style/categoryMenu.css";
import { UserContext } from "../components/UserContext";
import { useNavigate } from "react-router-dom";

const FoodMenu = () => {
  const [category, setCategory] = useState([]);
  const [catName, setCatName] = useState("");
  const [items, setItems] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const { user } = useContext(UserContext);
  const notify = () => toast.info("You need to sign up first as a registered user");
  const navigate=useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:4000/menu_category/category")
      .then((response) => {
        setCategory(response.data);
      });
  }, []);

  const handleCategoryClick = async (categoryId, name) => {
    setCatName(name);
    try {
      const response = await axios.get(
        `http://localhost:4000/menu_item/items/${categoryId}`
      );
      if (response.data && response.data.length > 0) {
        setItems(response.data);
        toast.success("view your selected category  details");
      } else {
        setItems([]);
        toast.error("No results found!");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const [searchInfo, setSearchInfo] = useState({
    foodName: "",
    category: "",
  });

  const handleSearchInfo = (e) => {
    setSearchInfo({ ...searchInfo, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/menu_item/search",
        searchInfo
      );
      if (response.data && response.data.length > 0) {
        setSearchResult(response.data);
        toast.success("Search successful!");
      } else {
        setSearchResult([]);
        toast.error("No results found!");
        e.target.reset();
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Search failed! Please try again.");
    }
  };
console.log(user)

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
console.log(user)
console.log(searchResult)
  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" />

      <Container className="my-5">
        <Form onSubmit={handleSearch}>
          <Row className="align-items-center">
            <Col md={4} className="mb-2">
              <FormControl
                name="foodName"
                placeholder="Search by food name"
                aria-label="Search by Category"
                onChange={handleSearchInfo}
              />
            </Col>
            <Col md={4} className="mb-2">
              <FormControl
                name="category"
                placeholder="Search by category"
                aria-label="Search by Name"
                onChange={handleSearchInfo}
              />
            </Col>
            <Col md={4} className="d-flex justify-content-end mb-2">
              <Button variant="primary" type="submit" className="w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>

      {searchResult.length > 0 ? (
        <div className="container my-5">
          <h2 className="text-center mb-4">Search Results</h2>
          <div className="row">
            {searchResult.map((item, index) => (
              <div key={index} className="col-md-6 mb-4 d-flex">
                <button
                  className={`card-button d-flex align-items-center ${
                    item.available ? "active" : "disabled"
                  }`}
                  disabled={!item.available}
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
        </div>
      ) : (
        <div className="container my-5">
          <h2 className="text-center mb-4">Categories</h2>
          <div
            className="d-flex flex-row flex-wrap justify-content-center"
            style={{ marginTop: "40px" }}
          >
            {category.map((category) => (
              <button
                key={category.category_id}
                className="btn text-center mx-3 mb-3"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleCategoryClick(category.category_id, category.name)
                }
              >
                <img
                  src={category.img}
                  className="rounded-circle mb-2"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  alt={category.name}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
                <p>{category.name}</p>
              </button>
            ))}
          </div>
          <CategoryMenu items={items} />
        </div>
      )}
    </>
  );
};

export default FoodMenu;
