import React, { useState } from "react";
import "./assets/css/styles.css";
import "./assets/css/product_detail.css";
import "./assets/css/Tinh_Style.css";

const AccountPanel: React.FC<{ togglePanel: (panelType: string) => void }> = ({ togglePanel }) => (
    <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
        <div
            className="border tinh-height100 tinh-border-shadow tinh-border-right p-3 px-5 tinh-bgcWhite"
            onClick={() => togglePanel("account")}
        >
            <div className="row tinh-height50 m-0 p-0 align-items-end text-center">
                <span className="text-black fw-bold fs-6 m-0 p-0">Tài Khoản Của Bạn</span>
            </div>
            <hr className="m-0 p-0" />
            <div className="row tinh-height50 m-0 p-0 align-items-center text-center">
                <p className="tinh-fs10">Xem và thay đổi thông tin của bạn</p>
            </div>
        </div>
    </div>
);

const OrderPanel: React.FC<{ togglePanel: (panelType: string) => void }> = ({ togglePanel }) => (
    <div className="col-12 col-sm-4 tinh-height25 mb-3 mb-sm-0 px-2 px-md-3">
        <div
            className="border tinh-height100 tinh-border-shadow tinh-border-right p-3 px-5 tinh-bgcWhite"
            onClick={() => togglePanel("orders")}
        >
            <div className="row tinh-height50 m-0 p-0 align-items-end text-center">
                <span className="text-black fw-bold fs-6 m-0 p-0">Đơn Hàng Của Bạn</span>
            </div>
            <hr className="m-0 p-0" />
            <div className="row tinh-height50 m-0 p-0 align-items-center text-center">
                <p className="tinh-fs10">Quản lí và theo dỗi các đơn hàng của bạn</p>
            </div>
        </div>
    </div>
);

const VoucherPanel: React.FC<{ togglePanel: (panelType: string) => void }> = ({ togglePanel }) => (
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
                <p className="tinh-fs10">Bạn có thể xem và sử dụng các Voucher khuyến mãi</p>
            </div>
        </div>
    </div>
);

// Personal, Email, and Password Info
const PersonalInfo = () => {
    const [editing, setEditing] = useState(false);
    return (
        <div className="card p-3 rounded-0 mb-3">
            <h4 className="py-3">Thông tin cá nhân</h4>
            {!editing ? (
                <div id="personalInfo">
                    <span className="tinh-fs12" id="nameDisplay">John Doe</span><br />
                    <span className="tinh-fs12" id="birthdayDisplay">01/01/1990</span><br />
                    <hr />
                    <a href="#" className="text-black none-underline tinh-fs14"
                       onClick={() => setEditing(true)}>Sửa</a>
                </div>
            ) : (
                <div id="editPersonalInfo">
                    <input type="text" id="nameInput" className="form-control tinh-fs14 tinh-no-outline my-2" defaultValue="John Doe" />
                    <input type="date" id="birthdayInput" className="form-control tinh-fs14 tinh-no-outline my-2" defaultValue="1990-01-01" />
                    <hr />
                    <a href="#" className="text-black none-underline tinh-fs14 tinh-mr"
                       onClick={() => setEditing(false)}>Lưu</a>
                    <a href="#" className="text-black none-underline tinh-fs14"
                       onClick={() => setEditing(false)}>Hủy</a>
                </div>
            )}
        </div>
    );
};

const EmailInfo = () => {
    const [editing, setEditing] = useState(false);
    return (
        <div className="card p-3 rounded-0 mb-3">
            <h4 className="py-3">Địa chỉ Email</h4>
            {!editing ? (
                <div id="emailInfo">
                    <span className="tinh-fs12" id="emailDisplay">johndoe@example.com</span><br />
                    <hr />
                    <a href="#" className="text-black none-underline tinh-fs14"
                       onClick={() => setEditing(true)}>Sửa</a>
                </div>
            ) : (
                <div id="editEmailInfo">
                    <input type="email" id="emailInput" className="form-control tinh-fs14 tinh-no-outline my-2" defaultValue="johndoe@example.com" />
                    <hr />
                    <a href="#" className="text-black none-underline tinh-fs14 tinh-mr"
                       onClick={() => setEditing(false)}>Lưu</a>
                    <a href="#" className="text-black none-underline tinh-fs14"
                       onClick={() => setEditing(false)}>Hủy</a>
                </div>
            )}
        </div>
    );
};

const PasswordInfo = () => {
    const [editing, setEditing] = useState(false);
    return (
        <div className="card p-3 rounded-0 mb-3">
            <h4 className="py-3">Password</h4>
            {!editing ? (
                <div id="passwordInfo">
                    <span className="tinh-fs12" id="passwordDisplay">*********</span><br />
                    <hr />
                    <a href="#" className="text-black none-underline tinh-fs14"
                       onClick={() => setEditing(true)}>Sửa</a>
                </div>
            ) : (
                <div id="editPasswordInfo">
                    <input type="password" id="passwordInput" className="form-control tinh-fs14 tinh-no-outline my-2" defaultValue="*********" />
                    <hr />
                    <a href="#" className="text-black none-underline tinh-fs14 tinh-mr"
                       onClick={() => setEditing(false)}>Lưu</a>
                    <a href="#" className="text-black none-underline tinh-fs14"
                       onClick={() => setEditing(false)}>Hủy</a>
                </div>
            )}
        </div>
    );
};

// Main Menu Component
const MenuProfile: React.FC = () => {
    const [panel, setPanel] = useState("account");

    const togglePanel = (panelType: string) => setPanel(panelType);

    return (
        <div className="container-fluid">
            <div className="row" style={{ padding: "20px", paddingBottom: "0" }}>
                <div
                    id="leftPanel"
                    className={`position-relative col-12 ${panel === "account" ? "col-md-4" : "col-md-8"} tinh-rounded tinh-height transition-all`}
                    style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
                >
                    <div className="row tinh-height90 m-0 p-3 align-items-center" id="leftContent1">
                        <AccountPanel togglePanel={togglePanel} />
                        <OrderPanel togglePanel={togglePanel} />
                        <VoucherPanel togglePanel={togglePanel} />
                    </div>
                </div>

                {/* Right Section */}
                <div
                    id="rightPanel"
                    className={`col-12 ${panel === "account" ? "col-md-8" : "col-md-4"} tinh-height transition-all`}
                    style={{ paddingLeft: "40px" }}
                >
                    {panel === "account" && <PersonalInfo />}
                    {panel === "orders" && <EmailInfo />}
                    {panel === "voucher" && <PasswordInfo />}
                </div>
            </div>
        </div>
    );
};

export default MenuProfile;
