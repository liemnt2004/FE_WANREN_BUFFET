import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Calendar,
  Popover,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import classNames from "classnames";
import FormItem from "antd/es/form/FormItem";
import WorkScheduleModel from "../../models/AdminModels/WorkScheduleModel";
import {
  createWorkSchedule,
  getWorkSchedulesByDate,
} from "../../api/apiAdmin/workschedulesApi";

const shiftOptions = [
  { value: 1, label: "Ca sáng: ( 8:30 - 16:00 )" },
  { value: 2, label: "Ca tối: ( 16:00 - 22:30 )" },
  { value: 3, label: "Gãy: ( 8:30 - 22:30 )" },
  { value: 4, label: "Thẳng sáng: ( 8:30 - 20:30 )" },
  { value: 5, label: "Thẳng tối: ( 11:00 - 16:00 )" },
  { value: 6, label: "Giữa 1: ( 11:00 - 16:00 )" },
  { value: 7, label: "Giữa 2: ( 11:00 - 20:00 )" },
];

const Scheduleworkshifts: React.FC = () => {
  const [visibleDate, setVisibleDate] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [username, setUsername] = useState<string>("");

  const [shiftId, setShiftId] = useState<number | null>(null);
  const [dataForSelectedDate, setDataForSelectedDate] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterUsername, setFilterUsername] = useState<string>("");
  const [filterShiftId, setFilterShiftId] = useState<number | null>(null);
  const [filterUserType, setFilterUserType] = useState<string>("");
  const [editingUsername, setEditingUsername] = useState<string | null>(null);

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

  const openEditModal = async (date: Dayjs) => {
    setSelectedDate(date);
    setIsLoading(true);
    setIsEditModalOpen(true);
    try {
      // Gọi API để lấy danh sách công việc theo ngày
      const schedules = await getWorkSchedulesByDate(date.format("YYYY-MM-DD"));
      setDataForSelectedDate(
        schedules.map((schedule, index) => ({
          key: index,
          username: schedule.username,
          fullName: schedule.fullName,
          userType: schedule.userType,
          shiftId: schedule.shiftId,
          shiftName: schedule.shiftName,
          workDate: schedule.workDate.toLocaleDateString(),
        }))
      );
    } catch (error) {
      console.error("Lỗi khi lấy danh sách công việc:", error);
      alert("Không thể lấy danh sách công việc. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDate(null);
    setDataForSelectedDate([]);
  };

  const dateFullCellRender = (date: Dayjs) => {
    const dateString = date.format("YYYY-MM-DD");
    const todayString = dayjs().format("YYYY-MM-DD");
    const isToday = dateString === todayString;
    const isPast = date.isBefore(dayjs(), "day"); // Kiểm tra ngày trong quá khứ

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
          opacity: isPast ? 0.5 : 1,
        }}
      >
        <div className={cellClass}>{date.date()}</div>
        {visibleDate === dateString && (
          <Popover
            content={
              <div style={{ display: "flex", gap: 10 }}>
                {!isPast && (
                  <Button
                    style={{ width: 105 }}
                    className="bg-blue-600"
                    onClick={() => openAddModal(date)}
                  >
                    Thêm
                  </Button>
                )}
                <Button
                  style={{ width: 105 }}
                  className="bg-green-500"
                  onClick={() => openEditModal(date)}
                >
                  Xem ca làm
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

  const handleAddWorkSchedule = async () => {
    if (!selectedDate || !username || !shiftId) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const workSchedule = new WorkScheduleModel(
      username,
      shiftId,
      selectedDate.toDate()
    );

    try {
      await createWorkSchedule(workSchedule);
      alert("Thêm ca thành công!");
      closeAddModal();
    } catch (error) {
      console.error("Lỗi khi thêm ca:", error);
      alert("người này đã có ca làm đó vui lòng thử với ca làm khác");
    }
  };

  const getFilteredData = () => {
    return dataForSelectedDate.filter((item) => {
      const matchesUsername = filterUsername
        ? item.username.toLowerCase() ||
          "".includes(filterUsername.toLowerCase() || "")
        : true;

      const matchesShiftId = filterShiftId
        ? item.shiftId === filterShiftId
        : true;

      const matchesUserType = filterUserType
        ? item.userType.toLowerCase() ||
          "" === filterUserType.toLowerCase() ||
          ""
        : true;

      return matchesUsername && matchesShiftId && matchesUserType;
    });
  };

  const handleEditShift = (username: string) => {
    setEditingUsername(username);
  };

  return (
    <div
      onClick={() => {
        if (visibleDate) setVisibleDate(null);
      }}
    >
      <h5>Xếp ca nhân viên</h5>

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
          <Button key="submit" type="primary" onClick={handleAddWorkSchedule}>
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
              options={shiftOptions}
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
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
            gap: "10px",
          }}
        >
          {/* Lọc theo ca làm */}
          <Select
            value={filterShiftId}
            onChange={(value) => setFilterShiftId(value)}
            showSearch
            style={{ width: "200px" }}
            placeholder="Lọc theo ca làm"
            optionFilterProp="label"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={shiftOptions}
          />

          {/* Lọc theo vị trí */}
          <Select
            value={filterUserType}
            onChange={(value) => setFilterUserType(value)}
            showSearch
            style={{ width: "200px" }}
            placeholder="Lọc theo vị trí"
            options={[
              { value: "", label: "Tất cả vị trí" },
              { value: "Bếp trưởng", label: "Bếp trưởng" },
              { value: "Bếp phó", label: "Bếp phó" },
              { value: "Thu ngân", label: "Thu ngân" },
              { value: "Phục vụ", label: "Phục vụ" },
            ]}
          />

          {/* Tìm kiếm theo username */}
          <Input
            value={filterUsername}
            onChange={(e) => setFilterUsername(e.target.value)}
            placeholder="Tìm kiếm theo username"
            style={{ width: "200px" }}
          />

          <Button type="primary">Xuất file</Button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : getFilteredData().length === 0 ? (
          <p>Không có dữ liệu cho ngày này.</p>
        ) : (
          <Table
            columns={[
              {
                title: "STT",
                key: "index",
                render: (text: any, record: any, index: number) => index + 1,
              },
              { title: "Username", dataIndex: "username", key: "username" },
              { title: "Full Name", dataIndex: "fullName", key: "fullName" },
              { title: "User Type", dataIndex: "userType", key: "userType" },
              {
                title: "Ca làm việc",
                dataIndex: "shiftName",
                key: "shiftName",
                render: (text, record: any) => (
                  <Select
                    value={record.shiftId} // Giá trị của ca làm hiện tại (ID)
                    style={{ width: "100%" }}
                    disabled={record.username !== editingUsername} // Chỉ cho phép chỉnh sửa nếu là username đang chỉnh sửa
                    onChange={(value) => {
                      // Cập nhật shiftId khi người dùng thay đổi ca làm việc
                      record.shiftId = value;
                    }}
                  >
                    {shiftOptions.map((shift) => (
                      <Select.Option key={shift.value} value={shift.value}>
                        {shift.label}
                      </Select.Option>
                    ))}
                  </Select>
                ),
              },
              { title: "Work Date", dataIndex: "workDate", key: "workDate" },
            ]}
            dataSource={getFilteredData()}
            rowKey="username"
          />
        )}
      </Modal>
    </div>
  );
};

export default Scheduleworkshifts;
