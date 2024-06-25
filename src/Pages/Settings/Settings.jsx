import React, { useEffect, useState } from "react";
import "./Settings.css";
import Heading from "../../components/Heading/Heading";
import { FloatingLabel, Form, Offcanvas, Modal } from "react-bootstrap";
import avatar from "../../assetss/default/5856.jpg";
import * as Yup from "yup";
import { planValidationSchema } from "../../Validations/PlanValidation";
import { Formik, ErrorMessage, useFormik } from "formik";
import { useDispatch } from "react-redux";
import { setTheme } from "../../Sotre/Action/Theme.action";
import { SendInviteValidation } from "../../Validations/SendInviteValidation";
import axiosInstance from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { convertToCreatedAtFormat } from "../../createdAt";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
const Settings = () => {
  const [toggled, setToggled] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();

  // Load initial toggle state from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setToggled(true);
    }
  }, []);

  const handleClick = () => {
    const newToggledState = !toggled;
    setToggled(newToggledState);
    const theme = newToggledState ? "dark" : "light"; // Toggle theme based on new state
    dispatch(setTheme(theme));
    localStorage.setItem("theme", theme);
  };
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalAddPlan, setModalShowAddPlan] = useState(false);
  const [modalEditPlan, setModalShowEditPlan] = useState(false);
  const dispatch = useDispatch();
  // <=================>  Add Plan <=================>
  const onSubmit = async (values, actions) => {
    console.log("Form submitted:", values);
    try {
      const { data } = await axiosPrivate.post("/owner-plans/", {
        name: values.name,
        maxTrainees: values.maxTrainees,
        cost: values.cost,
        branches: values.branches,
        duration: values.duration,
        description: values.description,
      });
      console.log("res", data);
      toast.success("Plan added successfully");
      setPlans([data?.data, ...plans]);
      setTimeout(() => {
        setModalShowAddPlan(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setTimeout(() => {
      actions.resetForm();
      actions.setSubmitting(false);
    }, 1000);
  };
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    values,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: "",
      maxTrainees: "",
      cost: "",
      branches: "",
      duration: "",
      description: "",
    },
    validationSchema: planValidationSchema,
    onSubmit,
  });

  // get plans
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const fetchPlans = async () => {
      const res = await axiosPrivate.get("/owner-plans");
      setPlans(res?.data?.data?.documents);
      console.log("plans", res?.data?.data?.documents);
      setLoading(false);
    };
    fetchPlans();
  }, []);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Update editPlan form when selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      editPlan.setValues({
        name: selectedPlan.name || "",
        maxTrainees: selectedPlan.maxTrainees || "",
        cost: selectedPlan.cost || "",
        branches: selectedPlan.branches || "",
        duration: selectedPlan.duration || "",
        description: selectedPlan.description || "",
      });
    }
  }, [selectedPlan]);

  const handleShowEditPlan = async (plan) => {
    setSelectedPlan(plan);
    setModalShowEditPlan(true);
  };

  const editPlan = useFormik({
    initialValues: {
      name: "",
      maxTrainees: "",
      cost: "",
      branches: "",
      duration: "",
      description: "",
    },
    validationSchema: planValidationSchema,
    onSubmit: async (values) => {
      try {
        console.log("values", values);
        const { data } = await axiosPrivate.put(
          `/owner-plans/${selectedPlan?._id}`,
          {
            name: values.name,
            maxTrainees: values.maxTrainees,
            cost: values.cost,
            branches: values.branches,
            duration: values.duration,
            description: values.description,
          }
        );
        console.log("res", data);
        toast.success("Plan updated successfullyyy");
        const editedPlans = plans.map((plan) => {
          if (selectedPlan?._id === plan._id) {
            return data?.data;
          }
          return plan;
        });

        setPlans(editedPlans);
      } catch (error) {
        console.log(error);
        toast.error("Something went wronggg");
      }
    },
  });

  //delete plan
  const handleDeletePlan = async (id) => {
    try {
      const res = await axiosPrivate.delete(`/owner-plans/${id}`);
      console.log("res", res);
      toast.success("Plan deleted successfully");
      const newPlans = plans.filter((plan) => {
        return plan._id !== id;
      });
      setPlans(newPlans);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  // =========== Add Plan ===========
  const [inviteLink, setInviteLink] = useState(null);
  const handleSendInvite = async (values, actions) => {
    console.log("Form submitted handleSendInvite:", values);
    console.log("Form submitted handleSendInvite:", actions);
    setTimeout(() => {
      actions.resetForm();
      actions.setSubmitting(false);
    }, 1000);

    const res = await axiosInstance.post("/admins/", {
      email: values.email,
      role: values.role,
      clientUrl: "https://my-gym-panel.vercel.app/setpass/",
    });
    console.log("res", res);
    toast.success("member incited succefully");
    setInviteLink(res?.data?.data?.inviteLink);
  };
  console.log(inviteLink);
  const sendInvite = useFormik({
    initialValues: {
      email: "",
      role: "",
    },
    validationSchema: SendInviteValidation,
    onSubmit: handleSendInvite,
  });

  const [admins, setAdmins] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    const fetchAdmins = async () => {
      const res = await axiosPrivate.get(`/admins?page=${page}&limit=${limit}`);
      setAdmins(res?.data?.data?.documents);
      console.log("admins", res?.data?.data?.documents);
      console.log(res);
      setNumberOfPages(res?.data?.data?.paginationResult?.numberOfPages);
      setLoading(false);
    };
    fetchAdmins();
  }, [page, limit]);
  console.log(numberOfPages);
  const pageArr = [];
  for (let i = 0; i < numberOfPages; i++) {
    pageArr.push(i);
  }
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const handleShowEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowEdit(true);
  };

  // <=======> Edit member <=======> //
  const editMember = useFormik({
    initialValues: {
      role: selectedAdmin?.role || "admin",
    },
    validationSchema: Yup.object({
      role: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log("values", values);
        const res = await axiosPrivate.patch(`/admins/${selectedAdmin?._id}`, {
          role: values.role,
        });
        console.log("res", res);
        toast.success("Member role updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    },
  });
  const suspendUser = async (id) => {
    try {
      const res = await axiosPrivate.patch(`/admins/${id}`, {
        isSuspended: true,
      });
      console.log("res", res);
      toast.success("Member suspended successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const activateUser = async (id) => {
    try {
      const res = await axiosPrivate.patch(`/admins/${id}`, {
        isSuspended: false,
      });
      console.log("res", res);
      toast.success("Member activated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  // <=======> Edit member <=======> //

  // copy

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

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  return (
    <div className="GeneralSettingsOne" style={{ minHeight: "100vh" }}>
      <aside className="GeneralSettingsOneSidebar">
        <p className="cursor-pointer">Settings</p>
        <nav className="GeneralSettingsOneNav">
          <ul>
            <li
              onClick={() => {
                setCurrentPage(1);
              }}
            >
              Members
            </li>
            <li
              onClick={() => {
                setCurrentPage(2);
              }}
            >
              Prefrences
            </li>
            <li
              onClick={() => {
                setCurrentPage(3);
              }}
            >
              Plans
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
              Members
            </div>
            <div
              className="myInfoSecondNav"
              onClick={() => {
                setCurrentPage(2);
              }}
            >
              Prefrences
            </div>
            <div
              className="myInfoSecondNav"
              onClick={() => {
                setCurrentPage(3);
              }}
            >
              Plans
            </div>
          </div>
        </div>
        {currentPage === 1 && (
          <div className="myInfo">
            <div className="myInfoHeading">
              <Heading content={"Staff members"} />
            </div>
            <div className="myInfoContent">
              <div className="tableContainer">
                <div className="addMember px-4">
                  <button className="PrimaryButton" onClick={handleShow}>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                      </svg>
                    </span>
                    <span>Invite new</span>
                  </button>
                </div>
                <table className="mainTable">
                  <thead>
                    <tr>
                      <th>Member name(12)</th>
                      <th>Role</th>
                      <th>Join date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => {
                      return (
                        <tr>
                          <td>
                            <div className="d-flex align-items-center justify-content-start">
                              <div className="profilePic">
                                <img
                                  src={admin?.image || avatar}
                                  alt="profilePic"
                                  className="widthSmall"
                                />
                              </div>
                              <div className="profileName mx-3">
                                {admin?.name}
                              </div>
                            </div>
                          </td>
                          <td>{admin?.role}</td>
                          <td>{convertToCreatedAtFormat(admin?.createdAt)}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <button
                                className="PrimaryButton"
                                onClick={() => handleShowEdit(admin)}
                              >
                                <span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-pencil-square"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path
                                      fill-rule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                    />
                                  </svg>
                                </span>
                                <span>Edit</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="d-flex justify-content-center align-items-center pagination my-2">
                  <div className="w-50 d-flex justify-content-between align-items-center">
                    <button
                      className={`PrimaryButtonTwo ${
                        page === 1 && "cursor-not-allowed"
                      }`}
                      onClick={() => {
                        setPage(page - 1);
                      }}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <div className="pages">
                      {pageArr.map((page) => {
                        return (
                          <span
                            className="mx-3 pag-item"
                            onClick={() => {
                              setPage(page + 1);
                            }}
                          >
                            {page + 1}
                          </span>
                        );
                      })}
                    </div>
                    <button
                      className={`PrimaryButtonTwo ${
                        page === numberOfPages && "cursor-not-allowed"
                      }`}
                      onClick={() => {
                        setPage(page + 1);
                      }}
                      disabled={page === numberOfPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentPage === 2 && (
          <div>
            <div className="myInfo">
              <div className="myInfoHeading">
                <Heading content={"Prefrences"} />
              </div>

              <div className="bigCard m-3">
                <p> change theme</p>
                <div
                  onClick={handleClick}
                  className={`toggle${toggled ? " night" : ""}`}
                >
                  <div className="notch">
                    <div className="crater" />
                    <div className="crater" />
                  </div>
                  <div>
                    <div className="shape sm" />
                    <div className="shape sm" />
                    <div className="shape md" />
                    <div className="shape lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentPage === 3 && (
          <div>
            <div className="myInfo">
              <div className="myInfoHeading">
                <Heading content={"Plans"} />
              </div>
              <div className="plansOfMyGym">
                {plans.map((plan) => {
                  return (
                    <div
                      className={
                        plan?.name === "Golden Plan"
                          ? "plans-details golden-background"
                          : plan?.name === "basic"
                          ? "plans-details silver-background"
                          : "plans-details"
                      }
                    >
                      <div className="main-of-pd">
                        <div className="line1 flexcenterbetween">
                          <span>{plan?.name}</span>
                          <span>
                            {plan?.cost}EGP / {plan?.duration}
                            <small>months</small>
                          </span>
                        </div>
                        <div className="line2 opacity-75">plan details</div>
                        <div className="line3 lineFlex">
                          <div className="d-flex align-items-center">
                            <div className="mx-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-clock-history"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                                <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                                <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                              </svg>
                            </div>
                            <div>{plan?.duration} months</div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="mx-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-shop-window"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5m2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5" />
                              </svg>
                            </div>
                            <div>{plan.branches} Branches</div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="mx-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-people"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                              </svg>
                            </div>
                            <div>{plan?.maxTrainees} max-trainees</div>
                          </div>
                        </div>
                      </div>
                      <div className="flexcenterbetween">
                        <button
                          className="SecondaryButton w-100 m-2"
                          onClick={() => {
                            handleShowEditPlan(plan);
                          }}
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fill-rule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                              />
                            </svg>
                          </span>
                          Edit
                        </button>
                        <button
                          className="DangerButton w-100 m-2"
                          onClick={() => {
                            handleDeletePlan(plan?._id);
                          }}
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fill-rule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                              />
                            </svg>
                          </span>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div
                  className="plans-details add-plan"
                  onClick={() => {
                    setModalShowAddPlan(true);
                  }}
                >
                  <div className="Add">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-plus-lg"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                        />
                      </svg>
                    </span>
                    <p className="main-color"> Add New Plan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="offCanvasAddMember">
          <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            id="offCanvas"
          >
            <Offcanvas.Header>
              <div className="d-flex justify-content-between w-100 align-items-center mt-2">
                <Offcanvas.Title>
                  <span className="offCanvasHeadTitle">Invite member</span>
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
                      id={
                        sendInvite.errors.email && sendInvite.touched.email
                          ? "floatingError"
                          : "floatingInput"
                      }
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
                    {sendInvite.errors.email && sendInvite.touched.email && (
                      <small className="error-message">
                        {sendInvite.errors.email}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Select role"
                      id={
                        sendInvite.errors.role && sendInvite.touched.role
                          ? "floatingError"
                          : "floatingInput"
                      }
                    >
                      <Form.Select
                        name="role"
                        onChange={sendInvite.handleChange}
                        onBlur={sendInvite.handleBlur}
                        value={sendInvite.values.role}
                      >
                        <option value="" disabled>
                          Select role
                        </option>
                        <option value={"admin"}>Admin</option>
                        <option value={"subAdmin"}>Sub admin</option>
                      </Form.Select>
                    </FloatingLabel>
                    {sendInvite.errors.role && sendInvite.touched.role && (
                      <small className="error-message">
                        {sendInvite.errors.role}
                      </small>
                    )}
                  </div>
                  <div className="my-2">
                    <button
                      className="SecondaryButton w-100"
                      disabled={sendInvite.isSubmitting}
                      type="submit"
                    >
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
                      <span>{copied ? "Copied!" : "Copy link"}</span>
                      {/* <span>Copy link</span> */}
                    </button>
                  </div>
                </div>
              </form>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
        <div className="offCanvasEditMember">
          <Offcanvas
            show={showEdit}
            onHide={handleCloseEdit}
            placement="end"
            id="offCanvas"
          >
            <Offcanvas.Header>
              <div className="d-flex justify-content-between w-100 align-items-center mt-2">
                <Offcanvas.Title>
                  <span className="offCanvasHeadTitle">Edit member</span>
                </Offcanvas.Title>
                <button
                  className="btn-close bg-secondary"
                  onClick={() => {
                    setShowEdit(false);
                  }}
                ></button>
              </div>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="editHead">
                <div className="profilePic d-flex justify-content-center align-items-center flex-column">
                  <img
                    src={selectedAdmin?.image || avatar}
                    alt="profilePic"
                    className="widthMedium"
                  />
                  <div className="profileName text-center fontLarge my-2">
                    {selectedAdmin?.name}
                    <p className="text-center text-small-opacity">
                      <p>{selectedAdmin?.role}</p>
                      <p>{selectedAdmin?.email}</p>
                      <p>{selectedAdmin?.phones[0]}</p>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-start opacity-75">Edit role</p>
              </div>
              <form onSubmit={editMember.handleSubmit}>
                <div>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Select role"
                    id="floatingInput"
                    className="mb-3"
                  >
                    <Form.Select
                      value={editMember.values.role}
                      name="role"
                      onChange={editMember.handleChange}
                      onBlur={editMember.handleBlur}
                    >
                      <option value={"subAdmin"}>sub-admin</option>
                      <option value={"admin"}>Admin</option>
                    </Form.Select>
                  </FloatingLabel>
                </div>
                <div>
                  <button
                    className="SecondaryButton w-100"
                    type="submit"
                    disabled={editMember.isSubmitting}
                  >
                    Save
                  </button>
                </div>
              </form>

              <div>
                <p className="text-start opacity-75 my-5">Other actions</p>
              </div>
              <div className="flexcenteraround">
                <button className="PrimaryButtonTwo w-100">
                  {selectedAdmin?.isSuspended ? (
                    <>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="green"
                          class="bi bi-check2-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                          <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                        </svg>
                      </span>
                      <span
                        onClick={() => {
                          activateUser(selectedAdmin?._id);
                        }}
                      >
                        Activate
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-slash-circle-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.646-2.646a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 .708.708z" />
                        </svg>
                      </span>
                      <span
                        onClick={() => {
                          suspendUser(selectedAdmin?._id);
                        }}
                      >
                        Suspend
                      </span>
                    </>
                  )}
                </button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
        <div className="modalAddPlan">
          <Modal
            show={modalAddPlan}
            onHide={() => setModalShowAddPlan(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton id="modal">
              <Modal.Title id="contained-modal-title-vcenter">
                Add Plan
              </Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal">
              <div>
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className="mb-2">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Plan Name"
                        id={
                          errors.name && touched.name
                            ? "floatingError"
                            : "floatingInput"
                        }
                      >
                        <Form.Control
                          type="text"
                          placeholder="Plan Name"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </FloatingLabel>
                      {errors.name && touched.name && (
                        <small className="error-message">{errors.name}</small>
                      )}
                    </div>
                    <div className="RowMid">
                      <div className="mb-2">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Branches"
                          id={
                            errors.branches && touched.branches
                              ? "floatingError"
                              : "floatingInput"
                          }
                          className=" w-100"
                        >
                          <Form.Control
                            type="number"
                            placeholder="Branches"
                            name="branches"
                            value={values.branches}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FloatingLabel>
                        {errors.branches && touched.branches && (
                          <small className="error-message">
                            {errors.branches}
                          </small>
                        )}
                      </div>
                      <div className="mb-2">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Max Trainees"
                          id={
                            errors.maxTrainees && touched.maxTrainees
                              ? "floatingError"
                              : "floatingInput"
                          }
                        >
                          <Form.Control
                            type="number"
                            placeholder="Max Trainees"
                            name="maxTrainees"
                            value={values.maxTrainees}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </FloatingLabel>
                        {errors.maxTrainees && touched.maxTrainees && (
                          <small className="error-message">
                            {errors.maxTrainees}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="costpermonth">
                      <div className="mb-2">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Cost"
                          id={
                            errors.cost && touched.cost
                              ? "floatingError"
                              : "floatingInput"
                          }
                        >
                          <Form.Control
                            type="number"
                            placeholder="Cost"
                            name="cost"
                            value={values.cost}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          ></Form.Control>
                        </FloatingLabel>
                        {errors.cost && touched.cost && (
                          <small className="error-message">{errors.cost}</small>
                        )}
                      </div>
                      <p>Per</p>
                      <div className="mb-2">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Duration(months)"
                          id={
                            errors.duration && touched.duration
                              ? "floatingError"
                              : "floatingInput"
                          }
                        >
                          <Form.Control
                            type="number"
                            placeholder="Duration"
                            value={values.duration}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="duration"
                          ></Form.Control>
                        </FloatingLabel>
                        {errors.duration && touched.duration && (
                          <small className="error-message">
                            {errors.duration}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="mb-2 w-100">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Description"
                        id={
                          errors.description && touched.description
                            ? "floatingError"
                            : "floatingInput"
                        }
                      >
                        <Form.Control
                          type="text"
                          placeholder="description"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></Form.Control>
                      </FloatingLabel>
                      {errors.description && touched.description && (
                        <small className="error-message">
                          {errors.description}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flexcenteraround">
                    <button
                      className="SecondaryButton"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setModalShowAddPlan(false);
                      }}
                      className="DangerButton"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </Modal>
        </div>
        <div className="modalEditPlan">
          <Modal
            show={modalEditPlan}
            onHide={() => setModalShowEditPlan(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton id="modal">
              <Modal.Title id="contained-modal-title-vcenter">
                Edit Plan
              </Modal.Title>
            </Modal.Header>
            <Modal.Body id="modal">
              <div>
                <form onSubmit={editPlan.handleSubmit}>
                  <div>
                    <div className="mb-2">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Plan Name"
                        id={
                          editPlan.errors.name && editPlan.touched.name
                            ? "floatingError"
                            : "floatingInput"
                        }
                      >
                        <Form.Control
                          type="text"
                          placeholder="Plan Name"
                          name="name"
                          value={editPlan.values.name}
                          onChange={editPlan.handleChange}
                          onBlur={editPlan.handleBlur}
                        />
                      </FloatingLabel>
                      {editPlan.errors.name && editPlan.touched.name && (
                        <small className="error-message">
                          {editPlan.errors.name}
                        </small>
                      )}
                    </div>
                    <div className="RowMid">
                      <div className="mb-2">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Branches"
                          id={
                            editPlan.errors.branches &&
                            editPlan.touched.branches
                              ? "floatingError"
                              : "floatingInput"
                          }
                          className=" w-100"
                        >
                          <Form.Control
                            type="number"
                            placeholder="Branches"
                            name="branches"
                            value={editPlan.values.branches}
                            onChange={editPlan.handleChange}
                            onBlur={editPlan.handleBlur}
                          />
                        </FloatingLabel>
                        {editPlan.errors.branches &&
                          editPlan.touched.branches && (
                            <small className="error-message">
                              {editPlan.errors.branches}
                            </small>
                          )}
                      </div>
                      <div className="mb-2">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Max Trainees"
                          id={
                            editPlan.errors.maxTrainees &&
                            editPlan.touched.maxTrainees
                              ? "floatingError"
                              : "floatingInput"
                          }
                        >
                          <Form.Control
                            type="number"
                            placeholder="Max Trainees"
                            name="maxTrainees"
                            value={editPlan.values.maxTrainees}
                            onChange={editPlan.handleChange}
                            onBlur={editPlan.handleBlur}
                          />
                        </FloatingLabel>
                        {editPlan.errors.maxTrainees &&
                          editPlan.touched.maxTrainees && (
                            <small className="error-message">
                              {editPlan.errors.maxTrainees}
                            </small>
                          )}
                      </div>
                    </div>
                    <div className="costpermonth">
                      <div className="mb-2">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Cost"
                          id={
                            editPlan.errors.cost && editPlan.touched.cost
                              ? "floatingError"
                              : "floatingInput"
                          }
                        >
                          <Form.Control
                            type="number"
                            placeholder="Cost"
                            name="cost"
                            value={editPlan.values.cost}
                            onChange={editPlan.handleChange}
                            onBlur={editPlan.handleBlur}
                          ></Form.Control>
                        </FloatingLabel>
                        {editPlan.errors.cost && editPlan.touched.cost && (
                          <small className="error-message">
                            {editPlan.errors.cost}
                          </small>
                        )}
                      </div>
                      <p>Per</p>
                      <div className="mb-2">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Duration"
                          id={
                            editPlan.errors.duration &&
                            editPlan.touched.duration
                              ? "floatingError"
                              : "floatingInput"
                          }
                        >
                          <Form.Control
                            type="number"
                            placeholder="Duration"
                            value={editPlan.values.duration}
                            onChange={editPlan.handleChange}
                            onBlur={editPlan.handleBlur}
                            name="duration"
                          ></Form.Control>
                        </FloatingLabel>
                        {editPlan.errors.duration &&
                          editPlan.touched.duration && (
                            <small className="error-message">
                              {editPlan.errors.duration}
                            </small>
                          )}
                      </div>
                    </div>
                    <div className="mb-2 w-100">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Description"
                        id={
                          editPlan.errors.description &&
                          editPlan.touched.description
                            ? "floatingError"
                            : "floatingInput"
                        }
                      >
                        <Form.Control
                          type="text"
                          placeholder="description"
                          name="description"
                          value={editPlan.values.description}
                          onChange={editPlan.handleChange}
                          onBlur={editPlan.handleBlur}
                        ></Form.Control>
                      </FloatingLabel>
                      {editPlan.errors.description &&
                        editPlan.touched.description && (
                          <small className="error-message">
                            {editPlan.errors.description}
                          </small>
                        )}
                    </div>
                  </div>
                  <div className="flexcenteraround">
                    <button
                      className="SecondaryButton"
                      type="submit"
                      disabled={editPlan.isSubmitting}
                    >
                      Edit
                    </button>
                    <button
                      type="reset"
                      onClick={() => {
                        setModalShowEditPlan(false);
                      }}
                      className="DangerButton"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default Settings;
