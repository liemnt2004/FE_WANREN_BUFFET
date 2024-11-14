// src/components/ResetPasswordOtp.tsx
import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './assets/css/enter_phone_number.css';
import './assets/css/enter_otp.css';
import './assets/css/reset_password_otp.css';

interface LocationState {
    email: string;
}

const ResetPasswordOtp: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;
    const email = state?.email || '';
    useEffect(() => {
        if (!email) {
            // Nếu không có email trong state, chuyển hướng về trang đăng nhập
            navigate('/login');
        }
    }, [email, navigate]);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        }

        // Kiểm tra điều kiện mật khẩu (ví dụ: độ dài, ký tự đặc biệt, v.v.)
        if (password.length < 8 || password.length > 16) {
            setError('Mật khẩu phải từ 8 đến 16 ký tự.');
            return;
        }

        try {
            // Gửi yêu cầu POST tới backend để cập nhật mật khẩu
            const response = await axios.post('http://localhost:8080/api/reset-password/update', {
                email: email,
                newPassword: password
            });

            if (response.status === 200) {
                setMessage('Mật khẩu đã được cập nhật thành công.');
                // Chuyển hướng đến trang đăng nhập sau khi đặt lại mật khẩu thành công
                navigate('/login');
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

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="ps36231-reset-password-otp d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleSubmit} className="box-reset-password-otp p-4 border rounded">
                <div className="title d-flex align-items-center mb-4">
                    <Link className="back-to-enter-otp me-3" to="/enter-otp" state={{ email }}>
                        <i className="bi bi-caret-left-fill fs-4"></i>
                    </Link>
                    <h3 className="mb-0">Thiết lập mật khẩu</h3>
                </div>
                <div className="input-password d-flex flex-column">
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="note-password mb-3">
                        <p>Tạo mật khẩu mới cho</p>
                        <span>{email}</span>
                    </div>
                    <div className="d-flex mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control me-2"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={toggleShowPassword}
                        >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>
                    <div className="d-flex mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control me-2"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={toggleShowPassword}
                        >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>
                    <span className="text-muted mb-1">Ít nhất một ký tự viết thường</span>
                    <span className="text-muted mb-1">Ít nhất một ký tự viết hoa</span>
                    <span className="text-muted mb-1">8 - 16 ký tự</span>
                    <span className="text-muted mb-3">
                        Chỉ các chữ cái, số và ký tự phổ biến mới có thể được sử dụng
                    </span>
                    <button type="submit" className="next-to-reset-password btn btn-primary w-100">
                        Tiếp theo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordOtp;
