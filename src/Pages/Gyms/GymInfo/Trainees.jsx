import React, { useEffect, useState } from "react";
import axiosInstance, { privateAxiosInstance } from "../../../api/axios";

const Trainees = (id) => {
  const [trainees, setTrainees] = useState();
  const [traineesData, setTraineesData] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const pageArr = [];
  for (let i = 0; i < traineesData?.pagination?.numberOfPages; i++) {
    pageArr.push(i);
  }
  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const res = await privateAxiosInstance.get(
          `/gyms/${id.id}/trainees/gym-trainees?page=${page}&limit=${limit}`
        );

        if (res) {
          console.log(res);
          setTrainees(res?.data?.data?.documents);
          setTraineesData(res?.data?.data);
        }
      } catch (error) {
        console.error("error fetching trainees", error);
      }
    };

    fetchTrainees();
  }, [id]);
  console.log(trainees);
  return (
    <div>
      <div>
        <div className="tableContainer">
          <table className="mainTableTwo">
            <thead>
              <tr>
                <th>Name ({traineesData?.pagination?.total})</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {trainees?.map((trainee, index) => (
                <tr key={index}>
                  <td data-label="Name" className="tdOfImg ">
                    <span>{trainee?.user?.name}</span>
                  </td>
                  <td data-label="Gender">{trainee?.user?.gender}</td>
                  <td data-label="Email">{trainee?.user?.email}</td>
                  <td data-label="Phone">{trainee?.user?.phone}</td>
                  <td data-label="Plan">{trainee?.plan?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center align-items-center pagination my-2">
            <div className="w-50 d-flex justify-content-between align-items-center">
              <button
                className={`PrimaryButtonTwo`}
                style={{
                  cursor: traineesData?.pagination.prev
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={!traineesData?.pagination.prev}
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
                  cursor: traineesData?.pagination?.next
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={!traineesData?.pagination?.next}
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

export default Trainees;
