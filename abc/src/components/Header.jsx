import React, { useState , } from 'react';
import "../style/style.css";
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios'
import SearchRestaurantDetails from './SearchResturantDetails';

const Header = () => {
  const [search, setSearch] = useState({
    city: "",
    district: ""
  });
  const [restaurant, setRestaurant] = useState([]);

  const handleChange = (evt) => {
    setSearch({ ...search, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/restaurant/search', search);

      if (response.data && response.data.length > 0) {
        setRestaurant(response.data);
        toast.success('Search successful!');
      } else if (response.data && response.data.length === 0) {
        setRestaurant([]); // Clear the previous results if no results are found
        toast.error('No results found!');
      } else {
        toast.error('Search failed! Please try again.');
      }

    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  }

  return (
    <div>
       <ToastContainer position="top-center" />
      <header className="header">
        <div className="container text-center text-white">
          <h1>ABC Restaurant And Food</h1>
          <p className="subtitle">When looking at its layout. The point of using Lorem Ipsum.</p>
          <div className="search-bar">
            <input 
              type="text" 
              className="form-control" 
              name='city' 
              onChange={handleChange} 
              placeholder="City" 
            />
            <input 
              type="text" 
              className="form-control" 
              name='district' 
              onChange={handleChange} 
              placeholder="district" 
            />
            <button className="btn btn-warning" onClick={handleSubmit}>SEARCH</button>
          </div>
        </div>
      </header>
     {restaurant.length !==0 && <SearchRestaurantDetails restaurant={restaurant} />}
    </div>
  );
};

export default Header;
