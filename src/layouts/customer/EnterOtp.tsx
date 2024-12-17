// src/components/EnterOtp.tsx
import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './assets/css/enter_phone_number.css';
import './assets/css/enter_otp.css';
import './assets/css/reset_password_otp.css';

interface LocationState {
    email: string;
}

const EnterOtp: React.FC = () => {
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
    const [otp, setOtp] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Kiểm tra độ dài OTP
        if (otp.length !== 6) {
            setError('OTP phải gồm 6 chữ số.');
            return;
        }

        try {
            // Gửi yêu cầu POST tới backend để xác thực OTP
            const response = await axios.post('https://wanrenbuffet.online/api/otp/validate', {
                email: email,
                otp: otp
            });

            if (response.status === 200) {
                // OTP hợp lệ, chuyển hướng đến trang đặt lại mật khẩu
                navigate('/reset-password', { state: { email } });
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
        <div className="ps36231-enter-otp  container-flush">
            <form onSubmit={handleSubmit} className="box-enter-otp p-4 border rounded" style={{color:'var(--text-color)'}}>
                <div className="title d-flex align-items-center mb-4">
                    <Link className="back-to-enter-phone me-3" to="/forgot-password" state={{ email }}>
                        <i className="bi bi-caret-left-fill fs-4"></i>
                    </Link>
                    <h3 className="mb-0" style={{color:'var(--text-color)'}}>Nhập mã xác nhận</h3>
                </div>
                <div className="input-otp d-flex flex-column">
                    <div className="note-otp mb-3">
                        <p >Mã xác thực đã được gửi qua email:</p>
                        <span style={{color:'var(--text-color)'}}>{email}</span>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <input
                            id="otp-input"
                            type="tel"
                            maxLength={6}
                            className="form-control"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            
                        />
                    </div>
                    <div className="when-dont-done mb-3">
                        <span>Bạn vẫn chưa nhận được?</span>{' '}
                    
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Tiếp theo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EnterOtp;
