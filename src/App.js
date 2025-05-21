import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Settings from "./Pages/Settings/Settings";
import Gyms from "./Pages/Gyms/Gyms";
import NotFound from "./Pages/NotFound/NotFound";
import GymInfo from "./Pages/Gyms/GymInfo/GymInfo";
import { useSelector } from "react-redux";
import Signin from "./Pages/Auth/Signin/Signin";
import Plans from "./Pages/Plans/Plans";
import Layout from "./Pages/Layout/Layout";
import Forgetpass from "./Pages/Auth/ForgetPass/Forgetpass";
import WeSent from "./Pages/Auth/WeSent/WeSent";
import { ToastContainer } from 'react-toastify';
import LandedForgetpass from "./Pages/Auth/Landed-Forgetpass/LandedForgetpass";
import SetPass from "./Pages/Auth/LandedFromInvit/SetPass/SetPass";
import SetName from "./Pages/Auth/LandedFromInvit/SetName/SetName";
import RequireAuth from "./Pages/Auth/ProtectdRoutes/RequireAuth";
import NoAuth from "./Pages/Auth/ProtectdRoutes/NoAuth";
import Notifications from "./Pages/Notifications/Notifications";
import PushNotifications from "./Pages/Notifications/PushNotifications/PushNotifications";
import io from "socket.io-client";
import { useEffect } from "react";


const ENDPOINT = "https://api.igymsystem.com/";
// const ENDPOINT = "http://localhost:8000";

let socket = io(ENDPOINT, {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500, // Retry every 500ms
});


function App() {
  const theme = useSelector((state) => {
    return state.theme
  });


  useEffect(() => {
      const setupConnection = () => {
        console.log("Socket connected or reconnected");
        socket.emit("setup", "admin");
      };

      // Emit immediately if already connected
      if (socket.connected) {
        setupConnection();
      }

      // Listen for future connections
      socket.on("connect", setupConnection);

      return () => {
        socket.off("connect", setupConnection);
      };
  }, []);


  return (
    <Router>
      <div className="App" data-theme={theme}>
        <Routes>
          <Route path="/" element={<Layout socket={socket} />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/gyms" element={<Gyms />} />
            <Route path="/gyminfo/:id" element={<GymInfo />} />
            <Route path="/notifications" element={<Notifications socket={socket} />} />
            <Route path="/pushnotifications" element={<PushNotifications />} />
          </Route>
          <Route
            path="/signin"
            element={
              <NoAuth>
                <Signin />
              </NoAuth>
            }
          ></Route>
          <Route path="/forgetpass" element={<Forgetpass />} />
          <Route
            path="/resetpassword/:invitToken"
            element={<LandedForgetpass />}
          />
          <Route path="/setpass/:invitToken" element={<SetPass />} />
          <Route path="/setname" element={<SetName />} />
          <Route path="/wesent" element={<WeSent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;