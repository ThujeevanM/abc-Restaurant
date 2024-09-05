import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const [cookies, , removeCookie] = useCookies(['token']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:4000/login/user-details', {
          headers: {
            Authorization: `Bearer ${cookies.token}`
          }
        });
        if (response.data.status === 'success') {
          setUserRole(response.data.user.role);
          setUser(response.data.user)
          setUserId(response.data.user.id)
        }
      } catch (error) {
        removeCookie('token');
      } finally {
        setLoading(false);
      }
    };

    if (cookies.token) {
      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, [cookies.token, removeCookie]);

  const handleLogout = () => {
    removeCookie('token');
    setUserRole(null);
  };

  return (
    <UserContext.Provider value={{ userRole, handleLogout,user, loading,userId }}>
      {children}
    </UserContext.Provider>
  );
};