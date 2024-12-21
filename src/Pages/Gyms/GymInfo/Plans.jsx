import React, { useEffect, useState } from "react";
import axiosInstance, { privateAxiosInstance } from "../../../api/axios";

const Plans = (id) => {
  const [plans, setPlans] = useState();
  const [plansData, setPlansData] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const pageArr = [];
  for (let i = 0; i < plansData?.pagination?.numberOfPages; i++) {
    pageArr.push(i);
  }
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await privateAxiosInstance.get(
          `/gyms/${id.id}/plans?page=${page}&limit=${limit}`
        );

        if (res) {
          console.log(res);
          setPlans(res?.data?.data?.documents);
          setPlansData(res?.data?.data);
        }
      } catch (error) {
        console.error("error fetching plans", error);
      }
    };

    fetchPlans();
  }, [id]);
  console.log(plans);
  return (
    <div>
      <div>
        <div className="tableContainer">
          <table className="mainTableTwo">
            <thead>
              <tr>
                <th>Plan name ({plansData?.pagination?.total})</th>
                <th>Plan Cost</th>
                <th>Plan Duration</th>
                <th>Freez Days</th>
              </tr>
            </thead>
            <tbody>
              {plans?.map((plan, index) => (
                <tr key={index}>
                  <td data-label="Plan name" className="tdOfImg ">
                    <span>{plan?.name}</span>
                  </td>
                  <td data-label="Plan cost">{plan?.cost}</td>
                  <td data-label="Plan duration">{plan?.duration} months</td>
                  <td data-label="Freez Days">{plan?.freezeDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center align-items-center pagination my-2">
            <div className="w-50 d-flex justify-content-between align-items-center">
              <button
                className={`PrimaryButtonTwo`}
                style={{
                  cursor: plansData?.pagination.prev
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={!plansData?.pagination.prev}
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
                  cursor: plansData?.pagination?.next
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={!plansData?.pagination?.next}
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

export default Plans;
