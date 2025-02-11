import React, { useEffect, useState } from "react";
import axiosInstance, { privateAxiosInstance } from "../../../api/axios";

const Trainers = (id) => {
  const [trainers, setTrainers] = useState();
  const [trainersData, setTrainersData] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const pageArr = [];
  for (let i = 0; i < trainersData?.pagination?.numberOfPages; i++) {
    pageArr.push(i);
  }
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await privateAxiosInstance.get(
          `/gyms/${id.id}/coaches?page=${page}&limit=${limit}`
        );

        if (res) {
          console.log(res);
          setTrainers(res?.data?.data?.documents);
          setTrainersData(res?.data?.data);
        }
      } catch (error) {
        console.error("error fetching trainers", error);
      }
    };

    fetchTrainers();
  }, [id]);
  console.log(trainers);
  return (
    <div>
      <div>
        <div className="tableContainer">
          <table className="mainTableTwo">
            <thead>
              <tr>
                <th>Name ({trainersData?.pagination?.total})</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {trainers?.map((trainee, index) => (
                <tr key={index}>
                  <td data-label="Name" className="tdOfImg ">
                    <span>{trainee?.user?.name ?trainee?.user?.name : '' }</span>
                  </td>
                  <td data-label="Gender">{trainee?.user?.gender}</td>
                  <td data-label="Email">{trainee?.user?.email}</td>
                  <td data-label="Phone">{trainee?.user?.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center align-items-center pagination my-2">
            <div className="w-50 d-flex justify-content-between align-items-center">
              <button
                className={`PrimaryButtonTwo`}
                style={{
                  cursor: trainersData?.pagination.prev
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={!trainersData?.pagination.prev}
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
                className={`PrimaryButtonTwo`}
                style={{
                  cursor: trainersData?.pagination?.next
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={!trainersData?.pagination?.next}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;
