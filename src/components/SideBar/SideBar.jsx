import React, { useState } from "react";
import "./SideBar.css";
import { Link, useLocation } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Popover from "react-bootstrap/Popover";
import avatar from "../../assetss/default/5856.jpg";
import { useSelector } from "react-redux";
import { Badge } from "react-bootstrap";
const SideBar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [click, setClick] = useState(false);
  const toggelShow = () => {
    setClick(!click);
  };
  const toggleClose = () => {
    setOpen(!open);
  };

  const unReadNotfication = useSelector((state) => state.unReadNotification);

  console.log("unReadNotfication", unReadNotfication);
  

  const Home = (props) => (
    <Tooltip
      id={open ? `inactive-button-tooltip` : "button-tooltip"}
      {...props}
    >
      Home
    </Tooltip>
  );
  const GYMs = (props) => (
    <Tooltip
      id={open ? `inactive-button-tooltip` : "button-tooltip"}
      {...props}
    >
      GYMs
    </Tooltip>
  );
  const Notifications = (props) => (
    <Tooltip
      id={open || click ? `inactive-button-tooltip` : "button-tooltip "}
      {...props}
    >
      Notifications
    </Tooltip>
  );
  const Settings = (props) => (
    <Tooltip
      id={open ? `inactive-button-tooltip` : "button-tooltip"}
      {...props}
    >
      Settings
    </Tooltip>
  );
  const Profile = (props) => (
    <Tooltip
      id={open ? `inactive-button-tooltip` : "button-tooltip"}
      {...props}
    >
      Profile
    </Tooltip>
  );
  const Help = (props) => (
    <Tooltip
      id={open ? `inactive-button-tooltip` : "button-tooltip"}
      {...props}
    >
      Help
    </Tooltip>
  );

  console.log(location.pathname);
  return (
    <>
      <aside className={open ? "sideBar" : "inactiveSideBar"}>
        <div className="logoOfSideBar">Logo</div>
        <ul className="ulOfSideBar">
          <OverlayTrigger
            placement="right"
            delay={{ show: 25, hide: 150 }}
            overlay={Home}
          >
            <Link to={"/"} className="Link">
              <li>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-house"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                  </svg>
                </span>
                <span className="spanOfTitleOfUl">Home</span>
              </li>
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="right"
            delay={{ show: 25, hide: 150 }}
            overlay={GYMs}
          >
            <Link to={"/gyms"} className="Link">
              <li>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-buildings"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                    <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
                  </svg>
                </span>
                <span className="spanOfTitleOfUl">GYMs</span>
              </li>
            </Link>
          </OverlayTrigger>
          <Link to={"/notifications"} className="Link">
            <OverlayTrigger
              placement="right"
              delay={{ show: 25, hide: 150 }}
              overlay={Notifications}
            >
              <span>
                <li>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-bell-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                    </svg>
                  </span>
                  <span className="spanOfTitleOfUl">
                    Notifications
                    {unReadNotfication > 0 && (
                      <Badge bg="danger">{unReadNotfication}</Badge>
                    )}
                  </span>
                </li>
              </span>
            </OverlayTrigger>
          </Link>
          <Link to={"/settings"} className="Link">
            <OverlayTrigger
              placement="right"
              delay={{ show: 25, hide: 150 }}
              overlay={Settings}
            >
              <li>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-sliders"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"
                    />
                  </svg>
                </span>
                <span className="spanOfTitleOfUl">Settings</span>
              </li>
            </OverlayTrigger>
          </Link>
          <OverlayTrigger
            placement="right"
            delay={{ show: 25, hide: 150 }}
            overlay={Profile}
          >
            <Link to={"/profile"} className="Link">
              <li>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-person-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path
                      fill-rule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.150 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </svg>
                </span>
                <span className="spanOfTitleOfUl">Profile</span>
              </li>
            </Link>
          </OverlayTrigger>
          {/* <OverlayTrigger
            placement="right"
            delay={{ show: 25, hide: 150 }}
            overlay={Help}
          >
            <li>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-info-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
              </span>
              <span className="spanOfTitleOfUl">Help</span>
            </li>
          </OverlayTrigger> */}
        </ul>

        <div className="collapseSideBar">
          <button onClick={toggleClose}>
            <span>
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-bar-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-bar-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"
                  />
                </svg>
              )}
            </span>
            <span className="spanOfTitleOfUl">Collapse menu</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
