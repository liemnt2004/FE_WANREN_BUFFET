import React from "react";
import "../../assets/css/checkout_for_staff.css";
import { useNavigate } from "react-router-dom";

const CheckoutSucess: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="congratulation-area text-center mt-5">
            <div className="container">
                <div className="congratulation-wrapper">
                    <div className="congratulation-contents center-text">
                        <div className="congratulation-contents-icon">
                            <i className="fas fa-check"></i>
                        </div>
                        <h4 className="congratulation-contents-title"> Cảm Ơn Quý Khách! </h4>
                        <p className="congratulation-contents-para">
                            Thanh toán thành công!
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


export default CheckoutSucess;
