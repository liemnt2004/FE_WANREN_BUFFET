// src/layouts/customer/Forgotpassword.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios


const Forgotpassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // Gửi yêu cầu POST tới backend để yêu cầu gửi OTP
            const response = await axios.post('https://wanrenbuffet.online/api/forgot-password/request', {
                email: email
            });


            if (response.status === 200) {
                setMessage('Đã gửi mã OTP tới email của bạn.');
                // Chuyển hướng đến trang nhập OTP với thông tin email
                navigate('/enter-otp', { state: { email } });
            }
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className="ps36231-enter-phone-number d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleSubmit} className="box-enter-phone p-4 border rounded">
                <div className="title d-flex align-items-center mb-4">
                    <Link className="back-to-login me-3" to="/login">
                        <i className="bi bi-caret-left-fill fs-4"></i>
                    </Link>
                    <h3 className="mb-0">Đặt lại mật khẩu</h3>
                </div>
                <div className="input-phone d-flex flex-column">
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <span className="text-muted mb-3">Chúng tôi sẽ gửi mã OTP qua email</span>
                    <button type="submit" className="btn btn-primary w-100">GỬI OTP</button>
                </div>
            </form>
        </div>
    );
};

export default Forgotpassword;
