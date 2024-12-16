// WorkShiftCalendar.tsx
import React, { useEffect, useState } from "react";
import { Button, Select, Table } from "antd";
import WorkShiftModel from "../../models/AdminModels/WorkShiftModel";
import { ListWorkShift } from "../../api/apiAdmin/workshifApi";

const WorkShiftCalendar: React.FC = () => {
  const [data, setData] = useState<WorkShiftModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [currentYear] = useState<number>(new Date().getFullYear());

  const fetchData = async (month: number, year: number) => {
    setLoading(true);
    try {
      const shifts = await ListWorkShift(month, year);
      setData(shifts);
    } catch (error) {
      console.error("Lấy dữ liệu ca làm thất bại:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, currentYear);
  }, [selectedMonth, currentYear]);

  // Cột cho bảng trong tab "Danh sách nhân viên"
  const columnsTab1 = [
    {
      title: "STT",
      key: "index",
      render: (text: any, record: any, index: number) => index + 1,
    },

    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Tổng giờ làm",
      dataIndex: "totalHours",
      key: "totalHours",
    },
  ];

  return (
    <div>
      <div
        style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}
      >
        <label style={{ marginRight: "8px" }}>Chọn tháng:</label>
        <Select
          style={{ width: 120 }}
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
          options={Array.from({ length: 12 }, (_, i) => ({
            label: `Tháng ${i + 1}`,
            value: i + 1,
          }))}
        />
      </div>
      <Table
        columns={columnsTab1}
        dataSource={data}
        loading={loading}
        rowKey="userId"
      />
    </div>
  );
};

export default WorkShiftCalendar;
