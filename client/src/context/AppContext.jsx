import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
const [loadingMySessions, setLoadingMySessions] = useState(false);

 
  const navigate = useNavigate();

  const fetchSessions = async()=>{
   setLoadingMySessions(true);
   try {

      const {data}=await axios.get('/api/session/');
      if(data.success){
         setSessions(data.sessions);
         
      }else{
         setSessions([]);
      }
      
   } catch (error) {
      console.error("Failed to fetch sessions:", error);
    setSessions([]);
   }finally{
      setLoadingSessions(false);
   }
  }


  useEffect(()=>{
   fetchSessions();
   
  },[sessions]);

 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLogin(true);
      setUserToken(token);
    }
    else {
      setIsLogin(false);
      setUserToken(null);
      setLoadingUser(false);
    }
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }
    try {
      const { data } = await axios.get("/api/user/user", {
        headers: { token: token },
      });
      if (data.success) {
        setUserData(data.user);
       
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("User fetch failed:", error);
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if(userToken){
      fetchUser();
    }
  }, [userToken]);
 



  const value = {
    navigate,
    isLogin,
    setIsLogin,
    userToken,
    setUserToken,
    userData,
    setUserData,
    axios,
    loadingUser,
    setLoadingUser,
    sessions,
    setSessions,
    setLoadingSessions,
    loadingSessions,
    fetchSessions
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
