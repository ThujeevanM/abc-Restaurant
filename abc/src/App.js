
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import RegistrationPage from './components/RegistrationPage';
import UserDashboard from './components/userDashboard';
import { UserProvider } from './components/UserContext'; 
import About from './components/About';
import FoodMenu from './components/FoodMenu';
import AddCard from './components/AddCard';
import ViewOrder from './components/ViewOrder';
import DiningTablesPage from './components/DiningTablesPage';
import RestaurantTable from './components/RestaurantTable';
import Reservation from './components/Reservation';
function App() {
  return (
    <UserProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<FoodMenu/>} />
          <Route path="/Order/:userId/:id" element={<AddCard/>} />
          <Route path="/View-order/:userId" element={<ViewOrder/>} />
          <Route path="/tables" element={<DiningTablesPage/>} />
          <Route path="/restaurant-view/:id" element={<RestaurantTable/>} />
          <Route path="/reservation/:id" element={<Reservation/>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
