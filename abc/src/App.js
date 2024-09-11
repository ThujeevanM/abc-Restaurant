
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
import ViewReservation from './components/viewReservation';
import UserProfile from './components/UserProfile';
import SpecialOffer from './components/SpecialOffer';
import ContactUs from './components/ContactUs';
import Gallery from './components/Gallery';
import Inquiry from './components/Inquiry';
import StaffHome from './components/staffComponents/StaffHome';
import StaffInquiry from './components/staffComponents/StaffInquiry';
import InquiryReplay from './components/staffComponents/InquiryReplay';
import ReservationManage from './components/staffComponents/ReservationManage';
import AdminAddMenuItem from './components/AdminAddMenuItem';


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
          <Route path="/reservations/:id" element={<ViewReservation/>} />
          <Route path="/profile/:id" element={<UserProfile/>} />
          <Route path="/specialOffer" element={<SpecialOffer/>} />
          <Route path="/ContactUs" element={<ContactUs/>} />
          <Route path="/gallery" element={<Gallery/>} />
          <Route path='/submit-query' element={<Inquiry/>}/>
          <Route path='/staff' element={<StaffHome/>}/>
          <Route path='/staffInquiry' element={<StaffInquiry/>}/>
          <Route path='/inquiryReplay/:StaffId/:id' element={<InquiryReplay/>}/>
          <Route path='/reservationManage' element={<ReservationManage/>}/>
          <Route path='/AdminDash' element={<AdminAddMenuItem/>}/>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
