import React, { useState, Component, useEffect } from "react";
import "./GymInfo.css";
import airGym from "../../../assetss/default/airGym.jpg";
import equipment from "../../../assetss/default/equipment (6).jpg";
import Slider from "react-slick";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Controller } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { privateAxiosInstance } from "../../../api/axios";
import Trainees from "./Trainees";
import Trainers from "./Trainers";
import Plans from "./Plans";
import Classes from "./Classes";

const GymInfo = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState("info");
  const showInfo = () => setCurrentPage("info");
  const showTrainees = () => setCurrentPage("trainees");
  const showTrainers = () => setCurrentPage("trainers");
  const showPlans = () => setCurrentPage("plans");
  const showClasses = () => setCurrentPage("classes");
  const [showImage, setShowImage] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const images = [
    airGym,
    equipment,
    airGym,
    equipment,
    airGym,
    equipment,
    airGym,
    equipment,
    airGym,
  ]; // Add your image URLs here
  const [theGym, setTheGym] = useState(null);
  const getTheGym = async () => {
    try {
      const res = await privateAxiosInstance.get(`/gyms/${id}`);
      console.log(res?.data?.data);
      setTheGym(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTheGym();
  }, [id]);
  const workingTimes = theGym?.branchInfo?.workingTimes;

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const formatTime = (time) => {
    if (!time) return "Closed";
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleImageClick = (image) => {
    setExpandedImage(image);
    setShowImage(true);
  };
  const valueOfText =
    "Our gym, named 'Elite Fitness Haven,' is not just a place to work out; it's a community where health and well-being are prioritized. Nestled in the heart of the city, we boast state-of-the-art equipment, expert trainers, and a diverse range of classes catering to all fitness levels. What sets us apart is our personalized approach; every member is treated with individual attention, ensuring that their unique fitness goals are met. Our commitment to excellence, combined with a supportive environment, makes us the best choice for anyone serious about their fitness journey.";
  return (
    <div className="gymProfile">
      <header>
        <div className="backAndDots">
          <div
            className="back"
            onClick={() => {
              window.history.back();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
              />
            </svg>
          </div>
          <div className="dots">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-three-dots-vertical"
              viewBox="0 0 16 16"
            >
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            </svg>
          </div>
        </div>
        <div className="logoAndInfo">
          <div className="logo">
            <img src={theGym?.logo || airGym} alt="gym" />
          </div>
          <div className="info text-center mt-1">
            <h2>{theGym?.name}</h2>
            <p>
              Owner :{" "}
              <span className="warning cursor-pointer">
                {theGym?.owner?.name}
              </span>
            </p>
            <p>
              Current plan :{" "}
              <span className="main-color cursor-pointer">
                {theGym?.ownerPlan?.name}
              </span>
            </p>
          </div>
        </div>
        <div className="navOfGymProfile">
          <div className="navItems">
            <div
              className="navItem"
              onClick={() => {
                showInfo();
              }}
            >
              <p
                className={
                  currentPage === "info"
                    ? "main-color border-bottom-main-color"
                    : ""
                }
              >
                GYM Info
              </p>
            </div>
            <div
              className="navItem"
              onClick={() => {
                showTrainees();
              }}
            >
              <p
                className={
                  currentPage === "trainees"
                    ? "main-color border-bottom-main-color"
                    : ""
                }
              >
                Trainees
              </p>
            </div>
            <div
              className="navItem"
              onClick={() => {
                showTrainers();
              }}
            >
              <p
                className={
                  currentPage === "trainers"
                    ? "main-color border-bottom-main-color"
                    : ""
                }
              >
                Trainers
              </p>
            </div>
            <div
              className="navItem"
              onClick={() => {
                showPlans();
              }}
            >
              <p
                className={
                  currentPage === "plans"
                    ? "main-color border-bottom-main-color"
                    : ""
                }
              >
                Plans
              </p>
            </div>
            <div
              className="navItem"
              onClick={() => {
                showClasses();
              }}
            >
              <p
                className={
                  currentPage === "classes"
                    ? "main-color border-bottom-main-color"
                    : ""
                }
              >
                Classes
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="m-2 p-2">
        {currentPage === "info" && (
          <div>
            <div className="infoCard">
              <h3>Gym Info</h3>

              <p name="info" className=" m-auto pOfGymInfo rounded-2">
                {theGym?.description}
              </p>
            </div>
            <div className="locationAndPlans">
              <div className="location">
                <h3>Location</h3>
                <div>
                  <p>lat: {theGym?.branchInfo?.location?.lat}</p>
                  <p>lng: {theGym?.branchInfo?.location?.lng}</p>
                </div>
              </div>
              <div className="plans">
                <h3>Plans</h3>
                <div>
                  <div>
                    <span className="price">{theGym?.ownerPlan?.cost}</span> /
                    month
                  </div>
                  <div className="planDesc">
                    {theGym?.ownerPlan?.description}
                  </div>
                </div>
              </div>
            </div>
            <div className="workingTimes bigCard">
              <h3>Working times</h3>
              <div>
                <table className="mainTableTwo">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Opening</th>
                      <th>Closing</th>
                      <th>Peak hours</th>
                      <th>Female hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => {
                      const dayInfo = workingTimes?.[day];
                      return (
                        <tr key={day}>
                          <td data-label="Day">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </td>
                          <td data-label="Opening">
                            {dayInfo ? formatTime(dayInfo.opening) : "Closed"}
                          </td>
                          <td data-label="Closing">
                            {dayInfo ? formatTime(dayInfo.closing) : "Closed"}
                          </td>
                          <td data-label="Peak hours">
                            {dayInfo && dayInfo.peakFrom
                              ? formatTime(dayInfo.peakFrom)
                              : "-"}{" "}
                            -{" "}
                            {dayInfo && dayInfo.peakTo
                              ? formatTime(dayInfo.peakTo)
                              : "-"}
                          </td>
                          <td data-label="Female hours">
                            {dayInfo && dayInfo.femaleFrom
                              ? formatTime(dayInfo.femaleFrom)
                              : "-"}{" "}
                            -{" "}
                            {dayInfo && dayInfo.femaleTo
                              ? formatTime(dayInfo.femaleTo)
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bigCard gymGallery">
              <h3>Gallery</h3>
              <div className="slider-container">
                <Swiper
                  // install Swiper modules
                  modules={[
                    Navigation,
                    // Pagination,
                    // Scrollbar,
                    // A11y,
                    Controller,
                  ]}
                  slidesPerView={4}
                  spaceBetween={40}
                  navigation
                  grabCursor
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  onSwiper={(swiper) => console.log(swiper)}
                  onSlideChange={() => console.log("slide change")}
                  breakpoints={{
                    "@0.00": {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    "@0.75": {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    "@1.00": {
                      slidesPerView: 3,
                      spaceBetween: 40,
                    },
                  }}
                >
                  {theGym?.branchInfo?.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="bigImageContainer"
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={image}
                          alt={`imagee-${index}`}
                          className="logo rounded-2"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div>
              <Modal
                show={showImage}
                onHide={() => setShowImage(false)}
                centered
              >
                <Modal.Body className="modalOfLogout d-flex flex-column align-items-center justify-content-center">
                  <img
                    src={expandedImage}
                    alt="Expanded"
                    className="logoLarge rounded-2 w-75 h-75"
                  />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        )}
        {currentPage === "trainees" && (
          <div>
            <Trainees id={id} />
          </div>
        )}
        {currentPage === "trainers" && (
          <div>
            <Trainers id={id} />
          </div>
        )}
        {currentPage === "plans" && (
          <div>
            <Plans id={id} />
          </div>
        )}
        {currentPage === "classes" && (
          <div>
            <Classes id={id} />
          </div>
        )}
      </main>
    </div>
  );
};

export default GymInfo;
