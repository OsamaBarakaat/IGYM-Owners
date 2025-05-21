import React, { useEffect, useState } from "react";
import "./Notifications.css";
import avatar from "../../assetss/default/5856.jpg";
import PushNotifications from "./PushNotifications/PushNotifications";
import Heading from "../../components/Heading/Heading";
import { privateAxiosInstance } from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Notifications = ({ socket }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const axiosPrivate = useAxiosPrivate();
  const getAllNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.get(`/notifications`);
      console.log(response);
      setNotifications(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllNotifications();
    socket.on("refetch admin notification", () => {
      console.log("refetch notification");
      getAllNotifications();
    });

    return () => {
      socket.off("refetch admin notification");
    };
  }, []);
  return (
    <div className="GeneralSettingsOne" style={{ minHeight: "100vh" }}>
      <aside className="GeneralSettingsOneSidebar">
        <p className="cursor-pointer">Notifications</p>
        <nav className="GeneralSettingsOneNav">
          <ul>
            <li
              onClick={() => {
                setCurrentPage(1);
              }}
            >
              Notifications
            </li>
            <li
              onClick={() => {
                setCurrentPage(2);
              }}
            >
              Push Notifications
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-GS-content">
        <div className="secondNav">
          <div className="head">Settings</div>
          <div className="secondNavItems">
            <div
              className="myInfoSecondNav"
              onClick={() => {
                setCurrentPage(1);
              }}
            >
              Notifications
            </div>
            <div
              className="myInfoSecondNav"
              onClick={() => {
                setCurrentPage(2);
              }}
            >
              Push Notifications
            </div>
          </div>
        </div>
        {currentPage === 1 && (
          <>
            {windowWidth > 1024 && <Heading content={"Notifications"} />}
            <div className="allNotifications bigCard my-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="singleNotif">
                  <div className="notifIcon">
                    <div className="logo-small">
                      <img src={avatar} alt="avatar" />
                    </div>
                  </div>
                  <div className="notifContent flexcenterbetween">
                    <div className="text-start">
                      <p>{notification.title}</p>
                      <p>{notification.message}</p>
                    </div>
                    <div>
                      <small>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {loading && <p>Loading...</p>}
            </div>
          </>
        )}
        {currentPage === 2 && (
          <>
            <div>
              <PushNotifications />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Notifications;
