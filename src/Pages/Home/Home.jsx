import React, { useEffect, useState } from "react";
import "./Home.css";
import { Chart as ChartJs } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import sourceData from "../../data/data.json";
import revenue from "../../data/revenue.json";
import Heading from "../../components/Heading/Heading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const [gymStats, setGymStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGymStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.get(
        `/gyms/66076924de3d68c1cd117087/stats`
      );
      setGymStats(response.data.data);

      console.log("Gym Statistics:", response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch gym statistics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGymStats();
  }, []);
  return (
    <div className="Home">
      <Heading content="Home " />
      <div className="main-cards">
        <div className="defaultCard ">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-piggy-bank"
              viewBox="0 0 16 16"
            >
              <path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.138-1.496A6.6 6.6 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.6 7.6 0 0 0 7.964 3.5c-.734 0-1.441.103-2.102.292a.5.5 0 1 0 .276.962" />
              <path
                fill-rule="evenodd"
                d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069q0-.218-.02-.431c.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a1 1 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.74.74 0 0 0-.375.562c-.024.243.082.48.32.654a2 2 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595M2.516 6.26c.455-2.066 2.667-3.733 5.448-3.733 3.146 0 5.536 2.114 5.536 4.542 0 1.254-.624 2.41-1.67 3.248a.5.5 0 0 0-.165.535l.66 2.175h-.985l-.59-1.487a.5.5 0 0 0-.629-.288c-.661.23-1.39.359-2.157.359a6.6 6.6 0 0 1-2.157-.359.5.5 0 0 0-.635.304l-.525 1.471h-.979l.633-2.15a.5.5 0 0 0-.17-.534 4.65 4.65 0 0 1-1.284-1.541.5.5 0 0 0-.446-.275h-.56a.5.5 0 0 1-.492-.414l-.254-1.46h.933a.5.5 0 0 0 .488-.393m12.621-.857a.6.6 0 0 1-.098.21l-.044-.025c-.146-.09-.157-.175-.152-.223a.24.24 0 0 1 .117-.173c.049-.027.08-.021.113.012a.2.2 0 0 1 .064.199"
              />
            </svg>
          </div>
          <div>
            <p>Earnings</p>
            <h3>$1000</h3>
          </div>
        </div>
        <div className="defaultCard ">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-clipboard2-data-fill"
              viewBox="0 0 16 16"
            >
              <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5" />
              <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5M10 7a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm4-3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1" />
            </svg>
          </div>
          <div>
            <p>Spend this month</p>
            <h3>$1000</h3>
          </div>
        </div>
        <div className="defaultCard ">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-graph-up-arrow"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </div>
          <div>
            <p>Sales</p>
            <h3>$1000</h3>
          </div>
        </div>
        <div className="defaultCard ">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-bar-chart-line"
              viewBox="0 0 16 16"
            >
              <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z" />
            </svg>
          </div>
          <div>
            <p>New Gyms</p>
            <h3>120</h3>
          </div>
        </div>
      </div>
      <div className="main-charts">
        <div className="bigChart">
          <Line
            data={{
              labels: revenue.map((item) => item.label),
              datasets: [
                {
                  label: "Revenue",
                  data: revenue.map((item) => item.revenue),
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                  hoverBackgroundColor: "rgb(159, 235, 7)",
                  hoverBorderColor: "rgb(159, 235, 7)",
                  borderWidth: 2,
                  borderRadius: 2,
                },
                {
                  label: "Cost",
                  data: revenue.map((item) => item.cost),
                  backgroundColor: "#FF0000",
                  borderColor: "#FF0000",
                  hoverBackgroundColor: "rgb(159, 235, 7)",
                  hoverBorderColor: "rgb(159, 235, 7)",
                  borderWidth: 2,
                  borderRadius: 2,
                },
              ],
            }}
          />
        </div>
        <div className="twoSmallChart">
          <div className="smallChartOne">
            <Bar
              data={{
                labels: sourceData.map((item) => item.label),
                datasets: [
                  {
                    label: "Sales",
                    data: sourceData.map((item) => item.sales),
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    hoverBackgroundColor: "rgb(159, 235, 7)",
                    hoverBorderColor: "rgb(159, 235, 7)",
                    borderWidth: 2,
                    borderRadius: 2,
                  },
                  {
                    label: "Earnings",
                    data: sourceData.map((item) => item.earning),
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    hoverBackgroundColor: "rgb(159, 235, 7)",
                    hoverBorderColor: "rgb(159, 235, 7)",
                    borderWidth: 2,
                    borderRadius: 2,
                  },
                ],
              }}
            />
          </div>
          <div className="smallChartTwo">
            <div>
              <Doughnut
                data={{
                  labels: ["new members", "old members", "active members"],
                  datasets: [
                    {
                      label: "count",
                      data: [100, 200, 300],
                      backgroundColor: [
                        "rgb(33, 150, 83)",
                        "rgb(211, 64, 83)",
                        "rgb(255, 167, 11)",
                      ],
                      hoverBackgroundColor: "rgb(159, 235, 7)",
                      // hoverBorderColor: "rbg(200,200,200",
                      borderWidth: 0,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
