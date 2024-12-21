import React, { useEffect, useState } from "react";
import axiosInstance, { privateAxiosInstance } from "../../../api/axios";

const Classes = (id) => {
  const [classes, setClasses] = useState();
  const [classesData, setClassesData] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const pageArr = [];
  for (let i = 0; i < classesData?.pagination?.numberOfPages; i++) {
    pageArr.push(i);
  }
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await privateAxiosInstance.get(
          `/gyms/${id.id}/classes?page=${page}&limit=${limit}`
        );

        if (res) {
          console.log(res);
          setClasses(res?.data?.data?.documents);
          setClassesData(res?.data?.data);
        }
      } catch (error) {
        console.error("error fetching classes", error);
      }
    };

    fetchClasses();
  }, [id]);
  console.log(classes);
  return (
    <div>
      <div>
        <div className="tableContainer">
          <table className="mainTableTwo">
            <thead>
              <tr>
                <th>Class name ({classesData?.pagination?.total})</th>
                <th>Class Cost</th>
                <th>Class Duration</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {classes?.map((Class, index) => (
                <tr key={index}>
                  <td data-label="Class name" className="tdOfImg ">
                    <span>{Class?.name}</span>
                  </td>
                  <td data-label="Class cost">{Class?.cost}</td>
                  <td data-label="Class duration">{Class?.duration} days</td>
                  <td data-label="Capacity">{Class?.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center align-items-center pagination my-2">
            <div className="w-50 d-flex justify-content-between align-items-center">
              <button
                className={`PrimaryButtonTwo`}
                style={{
                  cursor: classesData?.pagination.prev
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={!classesData?.pagination.prev}
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
                  cursor: classesData?.pagination?.next
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={!classesData?.pagination?.next}
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

export default Classes;
