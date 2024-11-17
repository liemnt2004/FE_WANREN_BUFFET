// src/components/MainDash.tsx
import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import "./assets/css/CustomerManagement.css";
import "./assets/css/Dashboard.css";

const MainDash: React.FC = () => {
  const chartConfigs: {
    [key: string]: {
      options: ApexOptions;
      series: any[];
      type: string;
      height: number;
    };
  } = {
    chart1: {
      options: {
        chart: {
          type: "line",
          height: 350,
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          categories: [
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
          ],
        },
        stroke: {
          curve: "smooth",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },
        colors: ["#ffffff"],
        grid: {
          borderColor: "#f0f2f5",
        },
        tooltip: {
          theme: "dark",
        },
        title: {
          text: "Sales",
          align: "center",
          style: {
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: "bold",
          },
        },
      },
      series: [
        {
          name: "Sales",
          data: [30, 40, 35, 50, 49, 60, 70],
        },
      ],
      type: "line",
      height: 350,
    },
    chart2: {
      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        colors: ["rgb(253, 192, 199)"],
        title: {
          text: "Revenue",
          align: "center",
          style: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#ffffff",
          },
        },
        grid: {
          borderColor: "#f0f2f5",
        },
        tooltip: {
          theme: "dark",
        },
      },
      series: [
        {
          name: "Revenue",
          data: [50, 70, 90, 100, 80, 110, 150],
        },
      ],
      type: "bar",
      height: 350,
    },
    chart3: {
      options: {
        chart: {
          type: "line",
          height: 350,
          toolbar: {
            show: true,
          },
        },
        xaxis: {
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        colors: ["#000"],
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Expenses",
          align: "center",
          style: {
            fontSize: "16px",
            fontWeight: "bold",
            color: "#ffffff",
          },
        },
        grid: {
          borderColor: "#f0f2f5",
        },
        tooltip: {
          theme: "dark",
        },
      },
      series: [
        {
          name: "Expenses",
          data: [30, 40, 50, 60, 70, 80, 90],
        },
      ],
      type: "line",
      height: 350,
    },
  };

  return (
    <div className="MainDash">
      <div className="row">
        {/* Col-8 */}
        <div className="col-8">
          {/* Cards Section */}
          <div className="row">
            <div className="cards ">
              <div className="parentContainer">
                {/* Compact Sales Card */}
                <div
                  className="CompactCard"
                  data-bs-toggle="modal"
                  data-bs-target="#modalSales"
                  style={{ cursor: "pointer" }} // Thêm con trỏ chuột
                >
                  <div className="radialBar">
                    <svg className="CircularProgressbar" viewBox="0 0 100 100">
                      <circle
                        className="CircularProgressbar-trail"
                        cx="50"
                        cy="50"
                        r="46"
                      ></circle>
                      <circle
                        className="CircularProgressbar-path"
                        cx="50"
                        cy="50"
                        r="46"
                        style={{
                          strokeDasharray: "289.027px, 289.027px",
                          strokeDashoffset: "86.708px",
                        }}
                      ></circle>
                      <text className="CircularProgressbar-text" x="50" y="50">
                        70%
                      </text>
                    </svg>
                    <span>Sales</span>
                  </div>
                  <div className="detail">
                    <span>$25,970</span>
                    <span>Last 24 hours</span>
                  </div>
                </div>

                {/* Modal Sales */}
                <div
                  className="modal fade"
                  id="modalSales"
                  tabIndex={-1}
                  aria-labelledby="modalSalesLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-white">
                      <div className="modal-header">
                        <h5 className="modal-title" id="modalSalesLabel">
                          Sales Details
                        </h5>
                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <ReactApexChart
                          options={chartConfigs.chart1.options}
                          series={chartConfigs.chart1.series}
                          height={chartConfigs.chart1.height}
                        />
                        <span>Last 24 hours</span>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Revenue Card */}
                <div
                  className="CompactCard"
                  data-bs-toggle="modal"
                  data-bs-target="#modalRevenue"
                  style={{
                    background:
                      "linear-gradient(rgb(255, 145, 157) 0%, rgb(252, 146, 157) 100%)",
                    boxShadow: "rgb(253, 192, 199) 0px 10px 20px 0px",
                    cursor: "pointer",
                  }}
                >
                  <div className="radialBar">
                    <span>80%</span>
                    <span>Revenue</span>
                  </div>
                  <div className="detail">
                    <span>$14,270</span>
                    <span>Last 24 hours</span>
                  </div>
                </div>

                {/* Modal Revenue */}
                <div
                  className="modal fade"
                  id="modalRevenue"
                  tabIndex={-1}
                  aria-labelledby="modalRevenueLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-white">
                      <div className="modal-header">
                        <h5 className="modal-title" id="modalRevenueLabel">
                          Revenue Details
                        </h5>
                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <ReactApexChart
                          options={chartConfigs.chart2.options}
                          series={chartConfigs.chart2.series}
                          type={"bar"}
                          height={chartConfigs.chart2.height}
                        />
                        <span>Last 24 hours</span>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Expenses Card */}
                <div
                  className="CompactCard"
                  data-bs-toggle="modal"
                  data-bs-target="#modalExpenses"
                  style={{
                    background:
                      "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255, 202, 113) -46.42%)",
                    boxShadow: "rgb(249, 213, 155) 0px 10px 20px 0px",
                    cursor: "pointer",
                  }}
                >
                  <div className="radialBar">
                    <span>60%</span>
                    <span>Expenses</span>
                  </div>
                  <div className="detail">
                    <span>$4,270</span>
                    <span>Last 24 hours</span>
                  </div>
                </div>

                {/* Modal Expenses */}
                <div
                  className="modal fade"
                  id="modalExpenses"
                  tabIndex={-1}
                  aria-labelledby="modalExpensesLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-white">
                      <div className="modal-header">
                        <h5 className="modal-title" id="modalExpensesLabel">
                          Expenses Details
                        </h5>
                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <ReactApexChart
                          options={chartConfigs.chart3.options}
                          series={chartConfigs.chart3.series}
                          height={chartConfigs.chart3.height}
                        />
                        <span>Last 24 hours</span>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts for Activity and Payment */}
          <div className="row">
            <div className="chart-row">
              <div className="chart-card">
                <h3>Activity</h3>
                <ReactApexChart
                  options={{
                    chart: {
                      type: "area",
                      height: 350,
                      toolbar: {
                        show: true,
                      },
                    },
                    xaxis: {
                      categories: [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun",
                      ],
                    },
                    stroke: {
                      curve: "smooth",
                    },
                    fill: {
                      type: "gradient",
                      gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 90, 100],
                      },
                    },
                    colors: ["#00E396"],
                    grid: {
                      borderColor: "#f0f2f5",
                    },
                    tooltip: {
                      theme: "dark",
                    },
                    title: {
                      text: "Activity",
                      align: "center",
                      style: {
                        color: "#ffffff",
                        fontSize: "24px",
                        fontWeight: "bold",
                      },
                    },
                  }}
                  series={[
                    {
                      name: "Activity",
                      data: [10, 20, 15, 30, 25, 40, 35],
                    },
                  ]}
                  type="area"
                  height={350}
                />
              </div>
              <div className="chart-card">
                <h3>Payment</h3>
                <ReactApexChart
                  options={{
                    chart: {
                      type: "bar",
                      height: 350,
                      toolbar: {
                        show: true,
                      },
                    },
                    xaxis: {
                      categories: [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun",
                      ],
                    },
                    colors: ["rgb(253, 192, 199)"],
                    title: {
                      text: "Payment",
                      align: "center",
                      style: {
                        color: "#ffffff",
                        fontSize: "24px",
                        fontWeight: "bold",
                      },
                    },
                    grid: {
                      borderColor: "#f0f2f5",
                    },
                    tooltip: {
                      theme: "dark",
                    },
                  }}
                  series={[
                    {
                      name: "Payment",
                      data: [40, 60, 50, 70, 65, 80, 90],
                    },
                  ]}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="col-4">
          <div className="card financial-overview">
            <div className="progress-circle">
              <ReactApexChart
                options={{
                  chart: {
                    type: "radialBar",
                    height: 200,
                  },
                  plotOptions: {
                    radialBar: {
                      hollow: {
                        size: "70%",
                      },
                      dataLabels: {
                        name: {
                          show: true,
                          fontSize: "16px",
                          color: "#fff",
                        },
                        value: {
                          show: true,
                          fontSize: "14px",
                          color: "#fff",
                          formatter: function (val: number) {
                            return `${val}%`;
                          },
                        },
                      },
                    },
                  },
                  labels: ["Spent balance"],
                  colors: ["#FF6384"],
                }}
                series={[68]}
                type="radialBar"
                height={200}
              />
              <span className="label">Spent balance</span>
              <span className="balance-text">$6832/$1284</span>
            </div>

            <div className="available-balance">
              <h2>$1248.40</h2>
              <p>Available balance</p>
            </div>

            <div className="categories">
              <div className="category-item">
                <span className="icon grocery-icon"></span>
                <span>Grocery</span>
                <span className="amount">-324,30$</span>
              </div>
              <div className="category-item">
                <span className="icon shopping-icon"></span>
                <span>Shopping</span>
                <span className="amount">-324,30$</span>
              </div>
              <div className="category-item">
                <span className="icon education-icon"></span>
                <span>Education</span>
                <span className="amount">-324,30$</span>
              </div>
              <div className="category-item">
                <span className="icon transport-icon"></span>
                <span>Transport</span>
                <span className="amount">-324,30$</span>
              </div>
              <div className="category-item">
                <span className="icon entertainment-icon"></span>
                <span>Entertainment</span>
                <span className="amount">-324,30$</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Các Modal khác nếu có thể thêm ở đây */}
    </div>
  );
};

export default MainDash;
