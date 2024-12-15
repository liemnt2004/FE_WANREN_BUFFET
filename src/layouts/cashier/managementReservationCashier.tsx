import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4_4 } from "uuid";
import {
  createReservation,
  fetchReservations,
  Reservation,
  updateReservationStatus,
} from "../../api/apiCashier/reservationApi";
import AlertSuccess from "./component/alertSuccess";
import CardReservationCashier, {
  getStatus,
} from "./component/cardReservationCashier";

const ManagementReservationCashier: React.FC = () => {
  const defaultReservation: Reservation = {
    reservationId: 0, // Có thể là một giá trị mặc định hoặc từ backend.
    createdDate: "",
    updatedDate: null,
    numberPeople: 1,
    dateToCome: "",
    timeToCome: "",
    phoneNumber: "",
    email: "",
    fullName: "",
    note: null,
    status: null,
  };

  // State v

  // Đưa `useState` vào trong component
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);

  const [formData, setFormData] = useState<Reservation>({
    reservationId: 0, // Có thể là một giá trị mặc định hoặc từ backend.
    createdDate: new Date().toISOString(),
    updatedDate: null,
    numberPeople: 1,
    dateToCome: "",
    timeToCome: "",
    phoneNumber: "",
    email: "",
    fullName: "",
    note: null,
    status: null,
  });

  const [bookReservation, setBookReservation] = useState<boolean>(false);

  const [detailReservation, setDetailReservation] =
    useState<Reservation | null>(null);

  const [detailReservation2, setDetailReservation2] =
    useState<Reservation | null>(null);

  const [detailReservation3, setDetailReservation3] =
    useState<Reservation | null>(null);

  const [detailReservation4, setDetailReservation4] =
    useState<Reservation | null>(null);

  // State ^

  // lấy api v

  const loadReservations = async () => {
    const data = await fetchReservations();
    setReservations(data.reverse()); // Đảm bảo đúng đường dẫn `_embedded.tables`
  };
  useEffect(() => {
    loadReservations();
  }, []);

  // lấy api ^

  // function v

  // filter

  // Step 1: Declare a state for the selected filter value
  const [filter, setFilter] = useState("all"); // Default to 'Tất cả'

  // Step 2: Filter tables based on selected radio button
  const filteredReservations = reservations.filter((reservation) => {
    if (filter === "all") return reservation.status === "PENDING"; // Show all tables
    if (filter === "approved") return reservation.status === "APPROVED"; // Only empty tables
    if (filter === "seated") return reservation.status === "SEATED"; // Only GDeli tables
    if (filter === "canceled") return reservation.status === "CANCELED"; // Only GDeli tables
    if (filter === "all2") return true; // Show all tables
    return true; // Default case (shouldn't happen)
  });

  // Step 3: Handle radio button change
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value); // Update filter based on the selected radio button
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberPeople" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const saveBookReservation = (reservation: Reservation) => {
    console.log("Dữ liệu gửi đi:", reservation);
    // Thực hiện gửi dữ liệu lên backend

    createReservation(reservation);

    closeBookReservation();

    loadReservations();

    // alert v
    const newAlert = {
      id: uuidv4_4(), // Tạo ID duy nhất cho mỗi alert
      message: "Đặt bàn thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    // alert ^
  };

  const isDateTimeValid = () => {
    const now = new Date();
    const reservationDateTime = new Date(
      `${formData.dateToCome}T${formData.timeToCome}`
    );

    // Kiểm tra xem ngày giờ đến có trước hiện tại không
    return reservationDateTime > now;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDateTimeValid()) {
      alert("Ngày đến và giờ đến không được trước thời gian hiện tại!");
      return;
    }

    // Gửi dữ liệu nếu hợp lệ
    saveBookReservation(formData);
  };

  const identifyReservation = async (reservation: Reservation) => {
    await updateReservationStatus(reservation.reservationId, "APPROVED");
    loadReservations();
    // alert v
    const newAlert = {
      id: uuidv4_4(), // Tạo ID duy nhất cho mỗi alert
      message: "Xác nhận đặt bàn thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    // alert ^
  };

  const cancelReservation = async (reservation: Reservation) => {
    await updateReservationStatus(reservation.reservationId, "CANCELED");
    loadReservations();
    // alert v
    const newAlert = {
      id: uuidv4_4(), // Tạo ID duy nhất cho mỗi alert
      message: "Hủy đặt bàn thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    // alert ^
  };

  const completeReservation = async (reservation: Reservation) => {
    await updateReservationStatus(reservation.reservationId, "SEATED");
    loadReservations();
    // alert v
    const newAlert = {
      id: uuidv4_4(), // Tạo ID duy nhất cho mỗi alert
      message: "Hoàn thành đặt bàn thành công",
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      setAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== newAlert.id)
      );
    }, 3000);
    // alert ^
  };

  // function ^

  // popup v

  const openBookReservation = () => {
    setBookReservation(true);
  };

  const closeBookReservation = () => {
    setBookReservation(false);
    setFormData(defaultReservation);
  };

  const openDetailReservation = (reservation: Reservation) => {
    setDetailReservation(reservation);
  };

  const closeDetailReservation = () => {
    setDetailReservation(null);
  };

  const openDetailReservation2 = (reservation: Reservation) => {
    setDetailReservation2(reservation);
  };

  const closeDetailReservation2 = () => {
    setDetailReservation2(null);
  };

  const openDetailReservation3 = (reservation: Reservation) => {
    setDetailReservation3(reservation);
  };

  const closeDetailReservation3 = () => {
    setDetailReservation3(null);
  };

  const openDetailReservation4 = (reservation: Reservation) => {
    setDetailReservation4(reservation);
  };

  const closeDetailReservation4 = () => {
    setDetailReservation4(null);
  };

  // popup ^

  return (
    <div>
      <StyledWrapperTab
        style={{ marginBottom: "25px", marginTop: "-25px" }}
        className="d-flex justify-content-between"
      >
        <div className="radio-inputs">
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="all"
              checked={filter === "all"}
              onChange={handleRadioChange}
            />
            <span className="name">Chờ xác nhận</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="approved"
              checked={filter === "approved"}
              onChange={handleRadioChange}
            />
            <span className="name">Đã xác nhận</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="seated"
              checked={filter === "seated"}
              onChange={handleRadioChange}
            />
            <span className="name">Đã đến</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="canceled"
              checked={filter === "canceled"}
              onChange={handleRadioChange}
            />
            <span className="name">Hủy</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radio"
              value="all2"
              checked={filter === "all2"}
              onChange={handleRadioChange}
            />
            <span className="name">Tất cả</span>
          </label>
        </div>
        <button onClick={openBookReservation}>Đặt bàn</button>
      </StyledWrapperTab>
      <StyledWrapper>
        {filteredReservations.map((reservation) => (
          <div
            className="d-flex justify-content-center"
            key={reservation.reservationId}
            onClick={
              reservation.status === "PENDING"
                ? () => openDetailReservation(reservation)
                : reservation.status === "APPROVED"
                ? () => openDetailReservation2(reservation)
                : reservation.status === "SEATED"
                ? () => openDetailReservation3(reservation)
                : reservation.status === "CANCELED"
                ? () => openDetailReservation4(reservation)
                : undefined
            }
          >
            <CardReservationCashier
              key={reservation.reservationId}
              reservationId={reservation.reservationId}
              status={reservation.status || ""}
              time={reservation.timeToCome}
              date={reservation.dateToCome}
              name={reservation.fullName}
            />
          </div>
        ))}
      </StyledWrapper>

      {bookReservation && (
        <PopupOverlay onClick={closeBookReservation}>
          <FormReservation onClick={(e) => e.stopPropagation()}>
            <section className="container">
              <header>Đặt Bàn</header>
              <form className="form" onSubmit={handleSubmit}>
                <div className="input-box">
                  <label>Họ và tên</label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="column">
                  <div className="input-box">
                    <label>Số điện thoại</label>
                    <input
                      required
                      name="phoneNumber"
                      type="tel"
                      placeholder="Số điện thoại"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-box">
                    <label>Ngày đến</label>
                    <input
                      required
                      name="dateToCome"
                      type="date"
                      value={formData.dateToCome}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="column">
                  <div className="input-box">
                    <label>Số người</label>
                    <input
                      required
                      name="numberPeople"
                      type="number"
                      min={1}
                      value={formData.numberPeople}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-box">
                    <label>Giờ đến</label>
                    <input
                      required
                      name="timeToCome"
                      type="time"
                      value={formData.timeToCome}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="input-box">
                  <label>Ghi chú</label>
                  <input
                    name="note"
                    placeholder="Nhập ghi chú"
                    type="text"
                    value={formData.note || ""}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit">Xác nhận</button>
              </form>
            </section>
          </FormReservation>
        </PopupOverlay>
      )}

      {detailReservation && (
        <PopupOverlay onClick={closeDetailReservation}>
          <div style={{ width: "80%" }}>
            <FormReservation onClick={(e) => e.stopPropagation()}>
              <section className="container">
                <header>Đặt Bàn</header>
                <form className="form">
                  <div className="input-box">
                    <label>Ngày giờ đặt</label>
                    <p>
                      {new Date(
                        detailReservation.createdDate
                      ).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                        " - " +
                        new Date(
                          detailReservation.createdDate
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                    </p>
                  </div>
                  <div className="input-box">
                    <label>Họ và tên</label>
                    <p>{detailReservation.fullName}</p>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Số điện thoại</label>
                      <p>{detailReservation.phoneNumber}</p>
                    </div>
                    <div className="input-box">
                      <label>Ngày đến</label>
                      <p>
                        {new Date(
                          detailReservation.dateToCome
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Số người</label>
                      <p>{detailReservation.numberPeople}</p>
                    </div>
                    <div className="input-box">
                      <label>Giờ đến</label>
                      <p>{detailReservation.timeToCome}</p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Email</label>
                      <p>{detailReservation.email || "Không có email"}</p>
                    </div>
                    <div className="input-box">
                      <label>Trạng thái</label>
                      <p>{getStatus(detailReservation.status || "")}</p>
                    </div>
                  </div>
                  <div className="input-box">
                    <label>Ghi chú</label>
                    <p className="clamped-text">
                      {detailReservation.note || "Không có ghi chú"}
                    </p>
                  </div>
                  <div className="buttonGroup d-flex justify-content-between">
                    <button
                      onClick={() => {
                        identifyReservation(detailReservation);
                        closeDetailReservation();
                        loadReservations();
                      }}
                      type="button"
                      className="mx-1"
                    >
                      Xác nhận đặt
                    </button>
                    <button
                      onClick={() => {
                        cancelReservation(detailReservation);
                        closeDetailReservation();
                        loadReservations();
                      }}
                      type="button"
                      className="mx-1"
                    >
                      Hủy đặt bàn
                    </button>
                    <button
                      type="button"
                      className="mx-1"
                      onClick={closeDetailReservation}
                    >
                      Đóng
                    </button>
                  </div>
                </form>
              </section>
            </FormReservation>
          </div>
        </PopupOverlay>
      )}

      {detailReservation2 && (
        <PopupOverlay onClick={closeDetailReservation2}>
          <div style={{ width: "80%" }}>
            <FormReservation onClick={(e) => e.stopPropagation()}>
              <section className="container">
                <header>Đặt Bàn</header>
                <form className="form">
                  <div className="input-box">
                    <label>Ngày giờ đặt</label>
                    <p>
                      {new Date(
                        detailReservation2.createdDate
                      ).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                        " - " +
                        new Date(
                          detailReservation2.createdDate
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                    </p>
                  </div>
                  <div className="input-box">
                    <label>Họ và tên</label>
                    <p>{detailReservation2.fullName}</p>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Số điện thoại</label>
                      <p>{detailReservation2.phoneNumber}</p>
                    </div>
                    <div className="input-box">
                      <label>Ngày đến</label>
                      <p>
                        {new Date(
                          detailReservation2.dateToCome
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Số người</label>
                      <p>{detailReservation2.numberPeople}</p>
                    </div>
                    <div className="input-box">
                      <label>Giờ đến</label>
                      <p>{detailReservation2.timeToCome}</p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Email</label>
                      <p>{detailReservation2.email || "Không có email"}</p>
                    </div>
                    <div className="input-box">
                      <label>Trạng thái</label>
                      <p>{getStatus(detailReservation2.status || "")}</p>
                    </div>
                  </div>
                  <div className="input-box">
                    <label>Ghi chú</label>
                    <p className="clamped-text">
                      {detailReservation2.note || "Không có ghi chú"}
                    </p>
                  </div>
                  <div className="buttonGroup d-flex justify-content-between">
                    <button
                      onClick={() => {
                        cancelReservation(detailReservation2);
                        closeDetailReservation2();
                        loadReservations();
                      }}
                      type="button"
                      className="mx-1"
                    >
                      Hủy đặt bàn
                    </button>
                    <button
                      type="button"
                      className="mx-1"
                      onClick={closeDetailReservation2}
                    >
                      Đóng
                    </button>
                  </div>
                </form>
              </section>
            </FormReservation>
          </div>
        </PopupOverlay>
      )}

      {detailReservation3 && (
        <PopupOverlay onClick={closeDetailReservation3}>
          <div style={{ width: "80%" }}>
            <FormReservation onClick={(e) => e.stopPropagation()}>
              <section className="container">
                <header>Đặt Bàn</header>
                <form className="form">
                  <div className="input-box">
                    <label>Ngày giờ đặt</label>
                    <p>
                      {new Date(
                        detailReservation3.createdDate
                      ).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                        " - " +
                        new Date(
                          detailReservation3.createdDate
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                    </p>
                  </div>
                  <div className="input-box">
                    <label>Họ và tên</label>
                    <p>{detailReservation3.fullName}</p>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Số điện thoại</label>
                      <p>{detailReservation3.phoneNumber}</p>
                    </div>
                    <div className="input-box">
                      <label>Ngày đến</label>
                      <p>
                        {new Date(
                          detailReservation3.dateToCome
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Số người</label>
                      <p>{detailReservation3.numberPeople}</p>
                    </div>
                    <div className="input-box">
                      <label>Giờ đến</label>
                      <p>{detailReservation3.timeToCome}</p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Email</label>
                      <p>{detailReservation3.email || "Không có email"}</p>
                    </div>
                    <div className="input-box">
                      <label>Trạng thái</label>
                      <p>{getStatus(detailReservation3.status || "")}</p>
                    </div>
                  </div>
                  <div className="input-box">
                    <label>Ghi chú</label>
                    <p className="clamped-text">
                      {detailReservation3.note || "Không có ghi chú"}
                    </p>
                  </div>
                  <div className="buttonGroup d-flex justify-content-between">
                    <button
                      onClick={() => {
                        cancelReservation(detailReservation3);
                        closeDetailReservation3();
                        loadReservations();
                      }}
                      type="button"
                      className="mx-1"
                    >
                      Hủy đặt bàn
                    </button>
                    <button
                      type="button"
                      className="mx-1"
                      onClick={closeDetailReservation3}
                    >
                      Đóng
                    </button>
                  </div>
                </form>
              </section>
            </FormReservation>
          </div>
        </PopupOverlay>
      )}

      {detailReservation4 && (
        <PopupOverlay onClick={closeDetailReservation4}>
          <div style={{ width: "80%" }}>
            <FormReservation onClick={(e) => e.stopPropagation()}>
              <section className="container">
                <header>Đặt Bàn</header>
                <form className="form">
                  <div className="input-box">
                    <label>Ngày giờ đặt</label>
                    <p>
                      {new Date(
                        detailReservation4.createdDate
                      ).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                        " - " +
                        new Date(
                          detailReservation4.createdDate
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                    </p>
                  </div>
                  <div className="input-box">
                    <label>Họ và tên</label>
                    <p>{detailReservation4.fullName}</p>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Số điện thoại</label>
                      <p>{detailReservation4.phoneNumber}</p>
                    </div>
                    <div className="input-box">
                      <label>Ngày đến</label>
                      <p>
                        {new Date(
                          detailReservation4.dateToCome
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Số người</label>
                      <p>{detailReservation4.numberPeople}</p>
                    </div>
                    <div className="input-box">
                      <label>Giờ đến</label>
                      <p>{detailReservation4.timeToCome}</p>
                    </div>
                  </div>
                  <div className="column">
                    <div className="input-box">
                      <label>Email</label>
                      <p>{detailReservation4.email || "Không có email"}</p>
                    </div>
                    <div className="input-box">
                      <label>Trạng thái</label>
                      <p>{getStatus(detailReservation4.status || "")}</p>
                    </div>
                  </div>
                  <div className="input-box">
                    <label>Ghi chú</label>
                    <p className="clamped-text">
                      {detailReservation4.note || "Không có ghi chú"}
                    </p>
                  </div>
                  <div className="buttonGroup d-flex justify-content-between">
                    <button
                      onClick={() => {
                        identifyReservation(detailReservation4);
                        closeDetailReservation4();
                        loadReservations();
                      }}
                      type="button"
                      className="mx-1"
                    >
                      Xác nhận lại
                    </button>
                    <button
                      type="button"
                      className="mx-1"
                      onClick={closeDetailReservation4}
                    >
                      Đóng
                    </button>
                  </div>
                </form>
              </section>
            </FormReservation>
          </div>
        </PopupOverlay>
      )}

      {/* Container hiển thị thông báo */}
      <div className="fixed top-4 right-4 flex flex-col items-end space-y-2">
        {alerts.map((alert) => (
          <AlertSuccess key={alert.id} message={alert.message} />
        ))}
      </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const StyledWrapperTab = styled.div`
  .radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #eee;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 35%;
    font-size: 14px;
  }

  .radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
  }

  .radio-inputs .radio input {
    display: none;
  }

  .radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 0;
    color: rgba(51, 65, 85, 1);
    transition: all 0.15s ease-in-out;
    height: 30px;
  }

  .radio-inputs .radio input:checked + .name {
    background-color: #fff;
    font-weight: 600;
  }

  button {
    background-color: #f3f7fe;
    color: black;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    width: 100px;
    height: 35px;
    transition: 0.3s;
    text-align: center;
  }

  button:hover {
    background-color: #aaaaaa;
    box-shadow: 0 0 0 5px #cccccc;
    color: #fff;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const PopupCard = styled.div`
  background-color: #f7f7f1;
  padding: 20px;
  border-radius: 8px;
  width: 75%;
  height: 85vh;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const FormReservation = styled.div`
  .container {
    position: relative;
    max-width: 550px;
    width: 100%;
    background: #fcedda;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .container header {
    position: relative;
    font-size: 1.2rem;
    color: #000;
    font-weight: 600;
    text-align: center;
    width: auto;
  }

  .container .form {
    margin-top: 15px;
  }

  .form .input-box {
    width: 100%;
    margin-top: 10px;
  }

  .input-box label {
    color: #000;
  }

  .form :where(.input-box input, .select-box) {
    position: relative;
    height: 35px;
    width: 100%;
    outline: none;
    font-size: 1rem;
    color: #808080;
    margin-top: 5px;
    border: 1px solid #ee4e34;
    border-radius: 6px;
    padding: 0 15px;
    background: #fcedda;
  }

  .input-box input:focus {
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  }

  .form .column {
    display: flex;
    column-gap: 15px;
    width: 100%;
  }

  .form .gender-box {
    margin-top: 10px;
  }

  .form :where(.gender-option, .gender) {
    display: flex;
    align-items: center;
    column-gap: 50px;
    flex-wrap: wrap;
  }

  .form .gender {
    column-gap: 5px;
  }

  .gender input {
    accent-color: #ee4e34;
  }

  .form :where(.gender input, .gender label) {
    cursor: pointer;
  }

  .gender label {
    color: #000;
  }

  .address :where(input, .select-box) {
    margin-top: 10px;
  }

  .select-box select {
    height: 100%;
    width: 100%;
    outline: none;
    border: none;
    color: #808080;
    font-size: 1rem;
    background: #fcedda;
  }

  .form button {
    height: 40px;
    width: 100%;
    color: #000;
    font-size: 1rem;
    font-weight: 400;
    margin-top: 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #ee4e34;
    text-align: center;
  }

  .form button:hover {
    background: #ee3e34;
  }

  form p {
    color: #808080;
  }

  .clamped-text {
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Giới hạn số dòng */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis; /* Thêm dấu "..." */
  }

  .buttonGroup {
    width: 100%;
  }
`;

export default ManagementReservationCashier;
