import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";
import "./assets/css/shift.css";
declare global {
  interface Window {
    bootstrap: any;
  }
}
const WorkShift: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarBodyRef = useRef<HTMLTableSectionElement>(null);
  const shiftModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const generateCalendar = (month: number, year: number) => {
    if (!calendarBodyRef.current) return;

    calendarBodyRef.current.innerHTML = "";
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let date = 1;
    const totalRows = Math.ceil(
      (daysInMonth + (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)) / 7
    );

    for (let row = 0; row < totalRows; row++) {
      const tableRow = document.createElement("tr");

      for (let col = 0; col < 7; col++) {
        const cell = document.createElement("td");
        const cellContent = document.createElement("div");
        cellContent.className = "day-cell";

        if (
          row === 0 &&
          col < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)
        ) {
          cellContent.innerHTML = "";
        } else if (date > daysInMonth) {
          cellContent.innerHTML = "";
        } else {
          const dayNumber = document.createElement("div");
          dayNumber.className = "day-number";
          dayNumber.textContent = date.toString();

          const workShiftList = document.createElement("div");
          workShiftList.className = "work-shift-list";

          const addShiftDiv = document.createElement("div");
          addShiftDiv.className = "add-shift";
          const button = document.createElement("button");
          button.className = "btn-add-shift";
          button.innerHTML = `<span>+</span>`;
          button.onclick = () => openModal(date);
          addShiftDiv.appendChild(button);

          cellContent.appendChild(dayNumber);
          cellContent.appendChild(workShiftList);
          cellContent.appendChild(addShiftDiv);

          cell.appendChild(cellContent);
          date++;
        }
        tableRow.appendChild(cell);
      }
      calendarBodyRef.current.appendChild(tableRow);
    }
  };

  const openModal = (day: number) => {
    setSelectedDate(`${day}/${currentMonth + 1}/${currentYear}`);
    if (shiftModalRef.current) {
      const modal = new window.bootstrap.Modal(shiftModalRef.current);
      modal.show();
    }
  };

  const handleShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shiftModalRef.current) {
      const modal = window.bootstrap.Modal.getInstance(shiftModalRef.current);
      modal?.hide();
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = prev - 1;
      if (newMonth < 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      }
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = prev + 1;
      if (newMonth > 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }
      return newMonth;
    });
  };

  return (
    <div className="ps36231">
      <div className="container">
        <div className="row">
          <div className="col-4">
            <div className="employee">
              <h5>Danh sách nhân viên</h5>
              <table className="table table-bordered" id="employee-table">
                <thead>
                  <tr style={{ verticalAlign: "middle" }}>
                    <th>STT</th>
                    <th>Mã nhân viên</th>
                    <th>Họ và tên</th>
                    <th>Vị trí</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>nhandt123</td>
                    <td>Dư Trọng Nhân</td>
                    <td>Bếp chính</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>namnq123</td>
                    <td>Nguyễn Quang Hoài Nam</td>
                    <td>Thu ngân</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>htp123</td>
                    <td>Hồ Tấn Phát</td>
                    <td>Phục vụ</td>
                  </tr>
                </tbody>
              </table>
              <h5 className="mt-3">Tổng số giờ làm trong tháng</h5>
              <table className="table table-bordered">
                <thead>
                  <tr style={{ verticalAlign: "middle" }}>
                    <th>STT</th>
                    <th>Mã nhân viên</th>
                    <th>Tổng số giờ làm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>nhandt123</td>
                    <td>20</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>namnq123</td>
                    <td>100</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>htp123</td>
                    <td>50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-8">
            <div className="shift">
              <h5>Xếp ca nhân viên</h5>
              <div className="d-flex flow-row">
                <select className="filter">
                  <option value="">Lọc theo ca làm</option>
                  {/* Options for different shift times */}
                </select>
                <select className="filter">
                  <option value="">Lọc theo vị trí</option>
                  {/* Options for different employee roles */}
                </select>
                <div className="d-flex align-items-center">
                  <input
                    className="filter-by-name"
                    type="text"
                    placeholder="Tìm kiếm theo tên"
                  />
                  <button className="btn-search-by-name">
                    <i className="bi bi-search"></i> Search
                  </button>
                  <button className="btn-export-excel">
                    <i className="bi bi-file-earmark-excel"></i> Xuất file
                  </button>
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-header text-center">
                  <button
                    className="btn btn-secondary me-3"
                    onClick={handlePrevMonth}
                  >
                    &lt;
                  </button>
                  <span style={{ fontSize: "20px" }}>
                    {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                      new Date(currentYear, currentMonth)
                    )}{" "}
                    {currentYear}
                  </span>
                  <button
                    className="btn btn-secondary ms-3"
                    onClick={handleNextMonth}
                  >
                    &gt;
                  </button>
                </div>
                <div className="card-body">
                  <table
                    className="table table-bordered text-center"
                    style={{ tableLayout: "fixed" }}
                  >
                    <thead>
                      <tr>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                        <th>Sun</th>
                      </tr>
                    </thead>
                    <tbody ref={calendarBodyRef}></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Adding Shifts */}
        <div className="modal fade" ref={shiftModalRef} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm ca cho ngày {selectedDate}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleShiftSubmit}>
                  <div className="mb-3">
                    <label htmlFor="employee-id" className="form-label">
                      Mã nhân viên
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="employee-id"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="shift-time" className="form-label">
                      Ca làm
                    </label>
                    <select className="form-select" id="shift-time">
                      <option value="morning-shift">Sáng (8:30 - 16:00)</option>
                      <option value="night-shift">Tối (16:00 - 22:30)</option>
                      {/* Additional shift options */}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Lưu
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkShift;
