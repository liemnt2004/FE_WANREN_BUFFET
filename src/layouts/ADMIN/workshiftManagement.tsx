import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Tabs,
  TabsProps,
  theme,
  Calendar,
  Popover,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
  message,
} from "antd";
import StickyBox from "react-sticky-box";
import dayjs, { Dayjs } from "dayjs";
import classNames from "classnames";
import FormItem from "antd/es/form/FormItem";
import WorkShiftModel from "../../models/AdminModels/WorkShiftModel";
import { ListWorkShift, updateWorkShift } from "../../api/apiAdmin/workshif";

const Scheduleworkshifts: React.FC = () => {
  const [visibleDate, setVisibleDate] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [username, setUsername] = useState<string>("");
  const [shiftId, setShiftId] = useState<number | null>(null);

  const openAddModal = (date: Dayjs) => {
    setSelectedDate(date);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedDate(null);
    setUsername("");
    setShiftId(null);
  };

  const openEditModal = (date: Dayjs) => {
    setSelectedDate(date);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDate(null);
  };

  // Hàm xử lý khi nhấn nút "Xác nhận" trong modal "Thêm"
  const handleAddShift = async () => {
    if (!username || !shiftId || !selectedDate) {
      message.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await updateWorkShift(username, shiftId, selectedDate.toDate());
      message.success("Đã cập nhật ca làm việc thành công");
      closeAddModal();
    } catch (error: any) {
      message.error(error.message || "Đã xảy ra lỗi khi cập nhật ca làm việc");
    }
  };

  const dateFullCellRender = (date: Dayjs) => {
    const dateString = date.format("YYYY-MM-DD");
    const todayString = dayjs().format("YYYY-MM-DD");
    const isToday = dateString === todayString;

    const cellClass = classNames("ant-picker-cell-inner", {
      "ant-picker-cell-today": isToday,
    });

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setVisibleDate(visibleDate === dateString ? null : dateString);
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <div className={cellClass}>{date.date()}</div>
        {visibleDate === dateString && (
          <Popover
            content={
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  style={{ width: 105 }}
                  className="bg-blue-600"
                  onClick={() => openAddModal(date)}
                >
                  Thêm
                </Button>
                <Button
                  style={{ width: 105 }}
                  className="bg-green-500"
                  onClick={() => openEditModal(date)}
                >
                  Chỉnh sửa
                </Button>
              </div>
            }
            open={true}
            getPopupContainer={(triggerNode) =>
              triggerNode.parentNode as HTMLElement
            }
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </Popover>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={() => {
        if (visibleDate) setVisibleDate(null);
      }}
    >
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
        dateFullCellRender={dateFullCellRender}
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "8px",
          padding: "16px",
        }}
      />

      {/* Modal Thêm */}
      <Modal
        title={`Thêm ca cho ngày ${
          selectedDate ? selectedDate.format("DD-MM-YYYY") : ""
        }`}
        open={isAddModalOpen}
        onCancel={closeAddModal}
        footer={[
          <Button key="cancel" onClick={closeAddModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddShift}>
            Xác nhận
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Username" required>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <FormItem label="Ca làm" required>
            <Select
              value={shiftId}
              onChange={(value) => setShiftId(value)}
              showSearch
              style={{ width: "100%" }}
              placeholder="Chọn ca làm"
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: 1,
                  label: "Ca sáng: ( 8:30 - 16:00 )",
                },
                {
                  value: 2,
                  label: "Ca tối: ( 16:00 - 22:30 )",
                },
                {
                  value: 3,
                  label: "Gãy: ( 8:30 - 22:30 )",
                },
                {
                  value: 4,
                  label: "Thẳng sáng: ( 8:30 - 20:30 )",
                },
                {
                  value: 5,
                  label: "Thẳng tối: ( 11:00 - 16:00 )",
                },
                {
                  value: 6,
                  label: "Giữa 1: ( 11:00 - 16:00 )",
                },
                {
                  value: 7,
                  label: "Giữa 2: ( 11:00 - 20:00 )",
                },
              ]}
            />
          </FormItem>
        </Form>
      </Modal>

      {/* Modal Chỉnh sửa */}
      <Modal
        title={`Chỉnh sửa ca cho ngày ${
          selectedDate ? selectedDate.format("DD-MM-YYYY") : ""
        }`}
        open={isEditModalOpen}
        width={1250}
        onCancel={closeEditModal}
        footer={null}
        style={{ width: "10000px" }}
      >
        <Table columns={columns}></Table>
      </Modal>
    </div>
  );
};

const columns = [
  {
    title: "STT",
    key: "index",
    render: (text: any, record: any, index: number) => index + 1,
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "Ca làm",
    dataIndex: "shift",
    key: "shift",
  },
  {
    title: "Chức năng",
    key: "actions",
    render: () => <Button type="link">Sửa</Button>,
  },
];

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
      console.error("Failed to fetch work shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, currentYear);
  }, [selectedMonth, currentYear]);

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

const columnsTab1 = [
  {
    title: "STT",
    dataIndex: "userId",
    key: "userId",
    sorter: (a: WorkShiftModel, b: WorkShiftModel) =>
      Number(a.userId) - Number(b.userId),
    defaultSortOrder: "ascend" as "ascend",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Position",
    dataIndex: "position",
    key: "position",
  },
  {
    title: "Total Hours",
    dataIndex: "totalHours",
    key: "totalHours",
  },
  {
    title: "Thao tác",
    key: "actions",
    render: () => <Button type="link">Chi tiết</Button>,
  },
];

const items = [
  {
    label: "Danh sách nhân viên",
    key: "1",
    children: <WorkShiftCalendar />,
  },
  {
    label: "Lịch làm việc",
    key: "2",
    children: <Scheduleworkshifts />,
  },
];

const WorkShift: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderTabBar: TabsProps["renderTabBar"] = (
    props,
    DefaultTabBar: React.ComponentType<any>
  ) => (
    <StickyBox offsetTop={5} offsetBottom={0} style={{ zIndex: 1 }}>
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
