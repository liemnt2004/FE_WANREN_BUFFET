import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Tabs, TabsProps, theme, Modal } from "antd";
import StickyBox from "react-sticky-box";
import { Calendar } from "antd";
import { Dayjs } from "dayjs";

const WorkShiftCalendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date.format("YYYY-MM-DD"));
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h5>Xếp ca nhân viên</h5>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <select className="form-select" style={{ width: "200px" }}>
          <option>Lọc theo ca làm</option>
          <option>Sáng</option>
          <option>Tối</option>
          <option>Giữa ca</option>
        </select>
        <select className="form-select" style={{ width: "200px" }}>
          <option>Lọc theo vị trí</option>
          <option>Quản lý</option>
          <option>Nhân viên</option>
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo tên"
          style={{ width: "200px" }}
        />
        <button className="btn btn-success">Xuất file</button>
      </div>
      <Calendar
        fullscreen={false}
        onSelect={handleDateSelect}
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          padding: "16px",
        }}
      />
      <Modal
        title="Thông báo"
        open={isModalOpen}
        onCancel={handleModalClose}
        onOk={handleModalClose}
      >
        <p>Ngày bạn chọn là: {selectedDate}</p>
        <p>Hello!</p>
      </Modal>
    </div>
  );
};

const items = [
  {
    label: "Tab 1",
    key: "1",
    children: (
      <div>
        <h5>Danh sách nhân viên</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã nhân viên</th>
              <th>Họ và tên</th>
              <th>Vị trí</th>
              <th>Tổng số giờ làm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>NV001</td>
              <td>Nguyễn Văn A</td>
              <td>Quản lý</td>
              <td>160</td>
            </tr>
            <tr>
              <td>2</td>
              <td>NV002</td>
              <td>Trần Thị B</td>
              <td>Nhân viên</td>
              <td>150</td>
            </tr>
            <tr>
              <td>3</td>
              <td>NV003</td>
              <td>Lê Văn C</td>
              <td>Kế toán</td>
              <td>140</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
  {
    label: "Tab 2",
    key: "2",
    children: <WorkShiftCalendar />,
  },
];

const WorkShift: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderTabBar: TabsProps["renderTabBar"] = (props, DefaultTabBar) => (
    <StickyBox offsetTop={64} offsetBottom={20} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: colorBgContainer }} />
    </StickyBox>
  );

  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="main-content">
          <Tabs
            defaultActiveKey="1"
            renderTabBar={renderTabBar}
            items={items}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default WorkShift;
