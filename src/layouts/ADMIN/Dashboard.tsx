// src/components/MainDash.tsx
import React, { useEffect, useState  } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import "./assets/css/CustomerManagement.css";
import "./assets/css/Dashboard.css";
import axios from "axios";

import { AuthContext } from "../customer/component/AuthContext";
const MainDash: React.FC = () => {
  // Trạng thái để lưu trữ dữ liệu doanh thu hàng tháng
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>([]);
  const [weekRevenue, setWeekRevenue] = useState<number[]>([]);
  const [hourlyRevenue, setHourlyRevenue] = useState<number[]>([]);

  // Trạng thái tải dữ liệu và lỗi cho từng loại dữ liệu
  const [isLoadingMonthly, setIsLoadingMonthly] = useState<boolean>(true);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState<boolean>(true);
  const [isLoadingHourly, setIsLoadingHourly] = useState<boolean>(true);

  const [errorMonthly, setErrorMonthly] = useState<string | null>(null);
  const [errorWeekly, setErrorWeekly] = useState<string | null>(null);
  const [errorHourly, setErrorHourly] = useState<string | null>(null);

  // Fetch dữ liệu doanh thu hàng tháng từ API khi component được mount
  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const employeeToken = localStorage.getItem("employeeToken");
        const currentYear = new Date().getFullYear(); // Lấy năm hiện tại, bạn có thể thay đổi nếu cần
        const response = await axios.get(`https://wanrenbuffet.online/api/statistical/monthly-revenue?year=${currentYear}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employeeToken}`,
          },
        });
        setMonthlyRevenue(response.data);
        setIsLoadingMonthly(false);
      } catch (err) {
        console.error("Error fetching monthly revenue:", err);
        setErrorMonthly("Không thể tải dữ liệu doanh thu hàng tháng.");
        setIsLoadingMonthly(false);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  // Fetch dữ liệu doanh thu hàng tuần từ API khi component được mount
  useEffect(() => {
    const fetchWeeklyRevenue = async () => {
      const employeeToken = localStorage.getItem("employeeToken");
      try {
        const response = await axios.get(`https://wanrenbuffet.online/api/statistical/weekly`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employeeToken}`,
          },
        });
        setWeekRevenue(response.data);
        setIsLoadingWeekly(false);
      } catch (err) {
        console.error("Error fetching weekly revenue:", err);
        setErrorWeekly("Không thể tải dữ liệu doanh thu hàng tuần.");
        setIsLoadingWeekly(false);
      }
    };

    fetchWeeklyRevenue();
  }, []);

  // Fetch dữ liệu doanh thu hàng giờ từ API khi component được mount
  useEffect(() => {
    const fetchHourlyRevenue = async () => {
      const employeeToken = localStorage.getItem("employeeToken");
      try {
        const response = await axios.get(`https://wanrenbuffet.online/api/statistical/hourly`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employeeToken}`,
          },
        });
        console.log("Hourly Revenue Data:", response.data);
        setHourlyRevenue(response.data);
        setIsLoadingHourly(false);
      } catch (err) {
        console.error("Error fetching hourly revenue:", err);
        setErrorHourly("Không thể tải dữ liệu doanh thu hàng giờ.");
        setIsLoadingHourly(false);
      }
    };

    fetchHourlyRevenue();
  }, []);

  // Cấu hình biểu đồ
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
            "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
            "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
            "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
            "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
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
          text: "Hourly Revenue",
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
          name: "Revenue",
          data: hourlyRevenue,
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
          text: "Weekly Revenue",
          align: "center",
          style: {
            fontSize: "24px",
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
          data: weekRevenue,
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
        colors: ["#FF4560"],
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Monthly Activity",
          align: "center",
          style: {
            fontSize: "24px",
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
          name: "Activity",
          data: monthlyRevenue,
        },
      ],
      type: "area",
      height: 350,
    },
  };

  return (
      <div className="MainDash">
        <div className="row">
          {/* Col-8 */}
          <div className="">
            {/* Cards Section */}
            <div className="row">
              <div className="cards">
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
                          {isLoadingHourly ? (
                              <p>Loading...</p>
                          ) : errorHourly ? (
                              <p>{errorHourly}</p>
                          ) : (
                              <ReactApexChart
                                  options={chartConfigs.chart1.options}
                                  series={chartConfigs.chart1.series}

                                  height={chartConfigs.chart1.height}
                              />
                          )}
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
                          {isLoadingWeekly ? (
                              <p>Loading...</p>
                          ) : errorWeekly ? (
                              <p>{errorWeekly}</p>
                          ) : (
                              <ReactApexChart
                                  options={chartConfigs.chart2.options}
                                  series={chartConfigs.chart2.series}

                                  height={chartConfigs.chart2.height}
                              />
                          )}
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
                          {/* Biểu đồ Expenses không liên quan đến dữ liệu từ API */}
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
                {/* Activity Chart */}


                {/* Payment Chart */}
                <div className="chart-card">
                  <h3>Payment</h3>
                  {isLoadingMonthly ? (
                      <p>Loading...</p>
                  ) : errorMonthly ? (
                      <p>{errorMonthly}</p>
                  ) : (
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
                                "January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December",
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
                              data: monthlyRevenue,
                            },
                          ]}
                          type="bar"
                          height={350}
                      />
                  )}
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
