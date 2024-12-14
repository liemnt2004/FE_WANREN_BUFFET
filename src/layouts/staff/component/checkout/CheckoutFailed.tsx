import React from "react";
import "../../assets/css/checkout_for_staff.css";
import { useNavigate } from "react-router-dom";

const CheckoutFailed: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="congratulation-area text-center mt-5">
            <div className="container">
                <div className="congratulation-wrapper">
                    <div className="congratulation-contents center-text" style={{color: 'var(--text-color)'}}>
                        <div className="congratulation-contents-icon bg-danger">
                            <i className="fas fa-times"></i>
                        </div>
                        <h4 className="congratulation-contents-title"> Thanh toán không thành công! </h4>
                        <p className="congratulation-contents-para">
                            Liên hệ nhân viên để xử lý!
                        </p>
                        <div className="btn-wrapper mt-4">
                            <p onClick={() => navigate("/staff")} className="cmn-btn btn-bg-1">
                                Về trang chủ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CheckoutFailed;
