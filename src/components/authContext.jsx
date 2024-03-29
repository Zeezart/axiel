import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import your Firebase configuration

// Create the context
export const AuthContext = createContext("");

// Create a provider component
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("")
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    displayName:"",
    email:"",
    password:""
  })
  const [room, setRoom] = useState([])
  const [inChat, setInChat] = useState(false)
  const [communities, setCommunities] = useState([])
  const [userdata, setUserdata] = useState()

  useEffect(() => {
    // Set up an observer to watch for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      
      if (user) {
        // Redirect to the account route if the user is signed in
        // navigate('/account');
        navigate('/welcome');
      } else {
        // Redirect to the home route if the user is not signed in
        navigate('/');
      }
    });

    // Clean up the observer on component unmount
    return () => unsubscribe();
  }, []);

return <AuthContext.Provider value={{currentUser,userDetails,setUserDetails,room,setRoom, inChat, setInChat, communities, setCommunities, userdata,setUserdata}}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the context
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };