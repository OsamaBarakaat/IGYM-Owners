import React, { useEffect, useState } from "react";
import airGym from "../../assetss/default/airGym.jpg";
import "./Gyms.css";
import { FloatingLabel, Form, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { privateAxiosInstance } from "../../api/axios";
import { useFormik } from "formik";

const Gyms = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const notify = () => toast.success("Invation sent successfully!");
  const navigate = useNavigate();
  const [gyms, setGyms] = useState([]);
  const getAllGyms = async () => {
    try {
      const res = await privateAxiosInstance.get("/gyms");
      console.log(res?.data?.data?.documents);
      setGyms(res?.data?.data?.documents);
    } catch (error) {
      console.log(error);
    }
  };
  function formatReadableDate(isoTimestamp) {
    if (!isoTimestamp) return "Invalid date";

    const date = new Date(isoTimestamp);

    // Check if the date is valid
    if (isNaN(date)) return "Invalid date";

    // Format the date
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  const [plans, setPlans] = useState([]);
  const getAllPlans = async () => {
    try {
      const res = await privateAxiosInstance.get("/owner-plans");
      console.log(res?.data?.data?.documents);
      setPlans(res?.data?.data?.documents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllGyms();
    getAllPlans();
  }, []);
  const handleSendInvite = async (values, actions) => {
    try {
      const { data } = await privateAxiosInstance.post(`gyms`, {
        email: values.email,
        planId: values.planName,
        clientUrl: "https://igym.vercel.app/setpass/",
      });
      setInviteLink(data.data.inviteLink);
      actions.resetForm();
      actions.setSubmitting(false);
      toast.success("Invite sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const sendInvite = useFormik({
    initialValues: {
      email: "",
      planName: "",
    },
    onSubmit: handleSendInvite,
  });
  const [inviteLink, setInviteLink] = useState(null);

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!inviteLink) {
      return;
    }
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setInviteLink(null);
    }, 2000);
  };
  return (
    <div className="gyms" style={{ minHeight: "100vh" }}>
      <div className="searchBar position-relative">
        <div>
          <input
            type="text"
            className="inputSearch w-100 p-4 border-0"
            placeholder="Search ..."
          />
        </div>
        <div className="buttonOnSearch">
          <button className="SecondaryButton" onClick={handleShow}>
            Add new
          </button>
        </div>
      </div>
      <div className="tableContainer">
        <table className="mainTableTwo">
          <thead>
            <tr>
              <th>Gyms(12)</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Expire date</th>
              <th>Join date</th>
            </tr>
          </thead>
          <tbody>
            {gyms.map((gym, index) => (
              <tr key={index}>
                <td data-label="Gym" className="tdOfImg">
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/gyminfo/${gym._id}`);
                    }}
                  >
                    {gym.name}
                  </span>
                  <span>
                    <img
                      src={gym.logo}
                      alt="Gym "
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/gyminfo/${gym._id}`);
                      }}
                    />
                  </span>
                </td>
                <td data-label="Owner">{gym?.owner?.name}</td>
                <td data-label="Email">{gym?.email}</td>
                <td data-label="Phone">{gym?.phones[0]}</td>
                <td data-label="Plan">{gym?.ownerPlan?.name}</td>
                <td data-label="Expire date">
                  {formatReadableDate(gym?.expireAt)}
                </td>
                <td data-label="Join date">
                  {formatReadableDate(gym.joinDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Offcanvas
          show={show}
          onHide={handleClose}
          placement="end"
          id="offCanvas"
        >
          <Offcanvas.Header>
            <div className="d-flex justify-content-between w-100 align-items-center mt-2">
              <Offcanvas.Title>
                <span className="offCanvasHeadTitle">Invite Gym owner</span>
              </Offcanvas.Title>
              <button
                className="btn-close bg-secondary"
                onClick={() => {
                  setShow(false);
                }}
              ></button>
            </div>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <form onSubmit={sendInvite.handleSubmit}>
              <div>
                <div>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Email"
                    id="floatingInput"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      placeholder="email"
                      name="email"
                      onChange={sendInvite.handleChange}
                      onBlur={sendInvite.handleBlur}
                      value={sendInvite.values.email}
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Select plan"
                    id="floatingInput"
                    className="mb-3"
                  >
                    <Form.Select
                      name="planName"
                      onChange={sendInvite.handleChange}
                      onBlur={sendInvite.handleBlur}
                      value={sendInvite.values.role}
                    >
                      <option value="" disabled selected>
                        Select Plan
                      </option>
                      {plans.map((plan, index) => (
                        <option key={index} value={plan?._id}>
                          {plan.name}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </div>
                <div className="my-2">
                  <button className="SecondaryButton w-100" type="submit">
                    Invite
                  </button>
                  <br />
                  <button
                    type="button"
                    className={`PrimaryButtonTwo w-100 transition ${
                      !inviteLink && "cursor-not-allowed"
                    }`}
                    disabled={!inviteLink}
                    onClick={handleCopy}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-link-45deg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                      </svg>
                    </span>
                    <span>{copied ? "Copied" : "Copy link"}</span>
                  </button>
                </div>
              </div>
            </form>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Gyms;
