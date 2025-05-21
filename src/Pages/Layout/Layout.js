import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import MobileSideBar from "../../components/MobileSideBar/MobileSideBar";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../Sotre/Action/User.action";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loader from "../../components/Loader/Loader";
import RequireAuth from "../Auth/ProtectdRoutes/RequireAuth";
import { setUnReadNotification } from "../../Sotre/Action/unReadNotification";
import { toast } from "react-toastify";

const Layout = ({ socket }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    try {
      const { data } = await axiosPrivate.get("/admins/me");
      console.log(data.data);
      dispatch(setUser({ data: data.data }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadNotificationsCount = async () => {
    try {
      const { data } = await axiosPrivate.get("notifications/count");
      dispatch(setUnReadNotification(data.data));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!user.data) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchUnreadNotificationsCount();

    socket.on("admin notification", (m) => {
      fetchUnreadNotificationsCount();
      console.log("message", m);
      toast.success(m);
    });

    socket.on("read admin notification", () => {
      console.log("read notification");

      dispatch(setUnReadNotification(0));
    });

    return () => {
      socket.off("admin notification");
      socket.off("read admin notification");
    };
  }, []);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  return (
    <>
      <RequireAuth>
        <div className="app-container">
          {windowWidth > 768 && (
            <div className="sideBarOfAppJs">
              <SideBar />
            </div>
          )}
          <div className="main-content">
            <Outlet />
          </div>
          {windowWidth <= 768 && <MobileSideBar />}
        </div>
      </RequireAuth>
    </>
  );
};

export default Layout;
