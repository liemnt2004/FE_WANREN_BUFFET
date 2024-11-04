import React, { useEffect, useState } from "react";
import "./assets/css/styles.css";
import "./assets/css/Tinh_Style.css";
import "./assets/css/order_history.css";
import kichi from "./assets/img/Cream and Black Simple Illustration Catering Logo.png";
import { DecodedToken } from "./component/AuthContext";
import { jwtDecode } from "jwt-decode"; // Corrected import
import { useNavigate } from "react-router-dom";

interface UserInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

interface UserInfoProps {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}

interface HistoryOrderProps {}

interface TogglePanelProps {
  togglePanel: (panelType: string) => void;
}

const AccountPanel: React.FC<TogglePanelProps> = ({ togglePanel }) => (
  <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
    <div
      className="border tinh-height100 tinh-border-shadow tinh-border-right p-3 px-5 tinh-bgcWhite"
      onClick={() => togglePanel("account")}
    >
      <div className="row tinh-height50 m-0 p-0 align-items-end text-center">
        <span className="text-black fw-bold fs-6 m-0 p-0">
          Tài Khoản Của Bạn
        </span>
      </div>
      <hr className="m-0 p-0" />
      <div className="row tinh-height50 m-0 p-0 align-items-center text-center">
        <p className="tinh-fs10">Xem và thay đổi thông tin của bạn</p>
      </div>
    </div>
  </div>
);

const OrderPanel: React.FC<TogglePanelProps> = ({ togglePanel }) => (
  <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
    <div
      className="border tinh-height100 tinh-border-shadow tinh-border-right p-3 px-5 tinh-bgcWhite"
      onClick={() => togglePanel("orders")}
    >
      <div className="row tinh-height50 m-0 p-0 align-items-end text-center">
        <span className="text-black fw-bold fs-6 m-0 p-0">
          Đơn Hàng Của Bạn
        </span>
      </div>
      <hr className="m-0 p-0" />
      <div className="row tinh-height50 m-0 p-0 align-items-center text-center">
        <p className="tinh-fs10">Quản lí và theo dõi các đơn hàng của bạn</p>
      </div>
    </div>
  </div>
);

const VoucherPanel: React.FC<TogglePanelProps> = ({ togglePanel }) => (
  <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
    <div
      className="border tinh-height100 tinh-border-shadow tinh-border-right p-3 px-5 tinh-bgcWhite"
      onClick={() => togglePanel("voucher")}
    >
      <div className="row tinh-height50 m-0 p-0 align-items-end text-center">
        <span className="text-black fw-bold fs-6 m-0 p-0">Voucher</span>
      </div>
      <hr className="m-0 p-0" />
      <div className="row tinh-height50 m-0 p-0 align-items-center text-center">
        <p className="tinh-fs10">
          Bạn có thể xem và sử dụng các Voucher khuyến mãi
        </p>
      </div>
    </div>
  </div>
);

const MenuList: React.FC<TogglePanelProps> = ({ togglePanel }) => (
  <div
    className="row tinh-height90 m-0 p-3 align-items-center"
    id="leftContent2"
  >
    <div className="row tinh-height30 m-0 p-2 px-3 d-flex align-items-center justify-content-center">
      <div className="row m-0 p-0 d-flex justify-content-center">
        <img src={kichi} className="rounded-circle w-50" alt="User Logo" />
      </div>
    </div>
    <div className="d-flex flex-column justify-content-between">
      <div className="tinh-btn-list-group">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            togglePanel("account");
          }}
        >
          <span>Tài khoản của bạn</span>
        </a>
      </div>
      <div className="tinh-btn-list-group my-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            togglePanel("orders");
          }}
        >
          <span>Đơn hàng của bạn</span>
        </a>
      </div>
      <div className="tinh-btn-list-group">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            togglePanel("voucher");
          }}
        >
          <span>Voucher</span>
        </a>
      </div>
    </div>
  </div>
);

const PersonalInfo: React.FC<UserInfoProps> = ({ userInfo, setUserInfo }) => {
  const [editing, setEditing] = useState(false);
  const [tempInfo, setTempInfo] = useState<UserInfo>(userInfo);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode<DecodedToken>(token || "");

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/customer/updateCustomer/${decoded.sub}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tempInfo),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }

      const updatedUser = await response.json();
      console.log(updatedUser);
      setUserInfo(updatedUser);
      localStorage.setItem("token", updatedUser.jwtToken);
      window.location.reload();
      setEditing(false);
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const handleCancel = () => {
    setTempInfo(userInfo);
    setEditing(false);
  };

  return (
    <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
      <h4 className="py-3">Thông tin cá nhân</h4>
      {!editing ? (
        <div id="personalInfo">
          <span className="tinh-fs12" id="nameDisplay">
            {userInfo.fullName}
          </span>
          <br />
          <span className="tinh-fs12" id="phoneDisplay">
            {userInfo.phoneNumber}
          </span>
          <br />
          <span className="tinh-fs12" id="phoneDisplay">
            {userInfo.email}
          </span>
          <br />
          <hr />
          <a
            href="#"
            className="text-black none-underline tinh-fs14"
            onClick={(e) => {
              e.preventDefault();
              setEditing(true);
            }}
          >
            Sửa
          </a>
        </div>
      ) : (
        <div id="editPersonalInfo">
          <input
            type="text"
            id="nameInput"
            className="form-control tinh-fs14 tinh-no-outline my-2"
            value={tempInfo.fullName} // use tempInfo instead of userInfo
            onChange={(e) =>
              setTempInfo({ ...tempInfo, fullName: e.target.value })
            }
          />
          <input
            type="text"
            id="phoneInput"
            className="form-control tinh-fs14 tinh-no-outline my-2"
            value={tempInfo.phoneNumber} // use tempInfo instead of userInfo
            onChange={(e) =>
              setTempInfo({ ...tempInfo, phoneNumber: e.target.value })
            }
          />
          <input
            type="email"
            id="emailInput"
            className="form-control tinh-fs14 tinh-no-outline my-2"
            value={userInfo.email}
            onChange={(e) =>
              setTempInfo({ ...tempInfo, email: e.target.value })
            }
          />
          <hr />
          <a
            href="#"
            className="text-black none-underline tinh-fs14 tinh-mr"
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            Lưu
          </a>
          <a
            href="#"
            className="text-black none-underline tinh-fs14"
            onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}
          >
            Hủy
          </a>
        </div>
      )}
    </div>
  );
};

const PasswordInfo: React.FC<UserInfoProps> = ({ userInfo, setUserInfo }) => {
  const [editing, setEditing] = useState(false);
  const [tempPassword, setTempPassword] = useState<string>("");
  const token = localStorage.getItem("token"); // Retrieve token for authorization

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/user/password", {
        // Updated endpoint
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: tempPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      // Assuming the API returns a success message or updated user info
      setUserInfo({ ...userInfo, password: tempPassword });
      setEditing(false);
    } catch (error) {
      console.error("Error updating password:", error);
      // Optionally, set an error state to display to the user
    }
  };

  const handleCancel = () => {
    setTempPassword("");
    setEditing(false);
  };

  return (
    <div className="card p-3 rounded-0 mb-3">
      <h4 className="py-3">Mật Khẩu</h4>
      {!editing ? (
        <div id="passwordInfo">
          <span className="tinh-fs12" id="passwordDisplay">
            *********
          </span>
          <br />
          <hr />
          <a
            href="#"
            className="text-black none-underline tinh-fs14"
            onClick={(e) => {
              e.preventDefault();
              setEditing(true);
            }}
          >
            Sửa
          </a>
        </div>
      ) : (
        <div id="editPasswordInfo">
          <input
            type="password"
            id="passwordInput"
            className="form-control tinh-fs14 tinh-no-outline my-2"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
          <hr />
          <a
            href="#"
            className="text-black none-underline tinh-fs14 tinh-mr"
            onClick={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            Lưu
          </a>
          <a
            href="#"
            className="text-black none-underline tinh-fs14"
            onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}
          >
            Hủy
          </a>
        </div>
      )}
    </div>
  );
};

const AccountContent: React.FC<UserInfoProps> = ({ userInfo, setUserInfo }) => (
  <div
    className="row tinh-height90 m-0 align-items-center tinh-overflowScroll"
    style={{ padding: "100px 40px 0 40px" }}
  >
    <PersonalInfo userInfo={userInfo} setUserInfo={setUserInfo} />
    <PasswordInfo userInfo={userInfo} setUserInfo={setUserInfo} />
  </div>
);

const OrdersContent: React.FC<HistoryOrderProps> = () => {
  return (
    <div
      className="row tinh-height90 m-0 align-items-center tinh-overflowScroll order_history"
      style={{ padding: "100px 40px 0 40px" }}
    >
      <div className="container mt-5">
        <div className="card mb-3">
          <div className="card-header order-header">
            <span>Order number: WU8819111</span>
            <span className="float-end order-total">$160.00</span>
          </div>
          <div className="card-body">
            <p className="order-info">Date placed: July 6, 2021</p>
            <div className="row g-0">
              <div className="col-md-2">
                <img
                  src="images/micro_backpack.jpg"
                  className="img-fluid rounded-start"
                  alt="Micro Backpack"
                />
              </div>
              <div className="col-md-10">
                <div className="product-info">
                  <h5>Micro Backpack</h5>
                  <p>
                    Are you minimalist looking for a compact carry option? The
                    Micro Backpack is perfect for your essentials everyday carry
                    items. Wear it like a backpack or carry it like a satchel
                    for all day use.
                  </p>
                  <p className="delivered-info">
                    <i className="fas fa-check-circle"></i> Delivered on July
                    12, 2021
                  </p>
                  <a href="#" className="btn btn-outline-primary btn-product">
                    View product
                  </a>
                  <a
                    href="#"
                    className="btn btn-outline-secondary btn-buy-again"
                  >
                    Buy again
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <a
              href="#"
              className="btn btn-outline-primary btn-view-order"
              data-bs-toggle="modal"
              data-bs-target="#orderModal1"
            >
              <i className="fas fa-info-circle"></i> View More Products
            </a>
            <a href="#" className="btn btn-outline-secondary btn-view-invoice">
              <i className="fas fa-file-invoice"></i> View Invoice
            </a>
          </div>
        </div>

        <div
          className="modal fade"
          id="orderModal1"
          tabIndex={-1}
          aria-labelledby="orderModalLabel1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="orderModalLabel1">
                  Order #WU8819111 - More Products
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <img
                      src="images/micro_backpack.jpg"
                      className="img-fluid"
                      alt="Micro Backpack"
                    />
                  </div>
                  <div className="col-md-8">
                    <h5>Micro Backpack</h5>
                    <p>$70.00</p>
                    <p>
                      Are you minimalist looking for a compact carry option? The
                      Micro Backpack is perfect for your essentials everyday
                      carry items. Wear it like a backpack or carry it like a
                      satchel for all day use.
                    </p>
                    <p className="delivered-info">
                      <i className="fas fa-check-circle"></i> Delivered on July
                      12, 2021
                    </p>
                    <a href="#" className="btn btn-primary">
                      <i className="fas fa-redo"></i> Buy Again
                    </a>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <img
                      src="images/nomad_shopping_tote.jpg"
                      className="img-fluid"
                      alt="Nomad Shopping Tote"
                    />
                  </div>
                  <div className="col-md-8">
                    <h5>Nomad Shopping Tote</h5>
                    <p>$90.00</p>
                    <p>
                      This durable shopping tote is perfect for the world
                      traveler. Its yellow canvas construction is water, fray,
                      tear-resistant.
                    </p>
                    <p className="delivered-info">
                      <i className="fas fa-check-circle"></i> Delivered on July
                      12, 2021
                    </p>
                    <a href="#" className="btn btn-primary">
                      <i className="fas fa-redo"></i> Buy Again
                    </a>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <h6>
                      <strong>Shipping Cost:</strong> $10.00
                    </h6>
                    <h6>
                      <strong>Voucher Applied:</strong> -$20.00
                    </h6>
                    <h6>
                      <strong>Final Total:</strong> $150.00
                    </h6>
                  </div>
                </div>
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

        <div className="card mb-3">
          <div className="card-header order-header">
            <span>Order number: AT4841546</span>
            <span className="float-end order-total">$40.00</span>
          </div>
          <div className="card-body">
            <p className="order-info">Date placed: December 22, 2020</p>
            <div className="row g-0">
              <div className="col-md-2">
                <img
                  src="images/double_stack_bag.jpg"
                  className="img-fluid rounded-start"
                  alt="Double Stack Clothing Bag"
                />
              </div>
              <div className="col-md-10">
                <div className="product-info">
                  <h5>Double Stack Clothing Bag</h5>
                  <p>
                    Save space and protect your favorite clothes in this
                    double-layer garment bag.
                  </p>
                  <p className="delivered-info">
                    <i className="fas fa-check-circle"></i> Delivered on January
                    5, 2021
                  </p>
                  <a href="#" className="btn btn-outline-primary btn-product">
                    View product
                  </a>
                  <a
                    href="#"
                    className="btn btn-outline-secondary btn-buy-again"
                  >
                    Buy again
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <a href="#" className="btn btn-outline-primary btn-view-order">
              <i className="fas fa-info-circle"></i> View Order
            </a>
            <a href="#" className="btn btn-outline-secondary btn-view-invoice">
              <i className="fas fa-file-invoice"></i> View Invoice
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const VoucherContent: React.FC = () => (
  <div
    className="row tinh-height90 m-0 p-3 px-5 align-items-center tinh-overflowScroll"
    style={{ padding: "100px 40px 0 40px" }}
  >
    {/* Include your voucher components here */}
    <span>Voucher content goes here.</span>
  </div>
);

const MenuProfile: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let decoded: DecodedToken | null = null;

  try {
    if (token) {
      decoded = jwtDecode<DecodedToken>(token);
    } else {
      throw new Error("No token found");
    }
  } catch (error) {
    console.error("Invalid or missing token:", error);
    navigate("/login");
  }

  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: decoded?.fullName || "",
    email: decoded?.email || "",
    phoneNumber: decoded?.phone || "",
    password: "", // Initialize as empty for security
  });

  const togglePanel = (panelType: string) => {
    setActivePanel(panelType);
  };

  return (
    <>
      {/* Main Content */}
      <div className="container-fluid">
        <div className="row" style={{ padding: "20px", paddingBottom: "0" }}>
          {/* Left Panel */}
          <div
            id="leftPanel"
            className={`position-relative ${
              activePanel ? "col-md-4" : "col-md-8"
            } col-12 tinh-rounded tinh-height transition-all`}
            style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
          >
            {!activePanel ? (
              <div className="row tinh-height90 m-0 p-3 align-items-center">
                <AccountPanel togglePanel={togglePanel} />
                <OrderPanel togglePanel={togglePanel} />
                <VoucherPanel togglePanel={togglePanel} />
              </div>
            ) : (
              <div className="row tinh-height90 m-0 p-3 align-items-center">
                <MenuList togglePanel={togglePanel} />
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div
            id="rightPanel"
            className={`${
              activePanel ? "col-md-8" : "col-md-4"
            } col-12 tinh-height transition-all`}
            style={{ paddingLeft: activePanel ? "40px" : "0" }}
          >
            {!activePanel ? (
              <div className="row tinh-height90 m-0 p-3 align-items-center">
                <div className="row tinh-height30 m-0 p-2 px-3 d-flex align-items-center justify-content-center">
                  <div className="row m-0 p-0 tinh-height50 tinh-width50">
                    <img
                      src={kichi}
                      alt="User Logo"
                      className="img-fluid rounded-circle"
                    />
                  </div>
                </div>
                <div className="row m-0 p-0 d-flex align-items-center justify-content-center tinh-vintage-style">
                  <h2>{userInfo.fullName}</h2>
                  <p>{userInfo.phoneNumber}</p>
                  <p>Email: {userInfo.email}</p>
                </div>
              </div>
            ) : (
              <>
                {activePanel === "account" && (
                  <AccountContent
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                  />
                )}
                {activePanel === "orders" && <OrdersContent />}
                {activePanel === "voucher" && <VoucherContent />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuProfile;
