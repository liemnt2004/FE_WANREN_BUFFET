// src/layouts/customer/SignIn.tsx

import React, { useState, FormEvent, ChangeEvent, useContext } from 'react';
import './assets/css/styles.css';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "./component/AuthContext";
import jwtDecode from "jwt-decode"; // Sửa lại cách import

const LoginRegisterComponent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext); // Sử dụng hàm login từ AuthContext
    const isLoginRoute = location.pathname === "/login";

    // Trạng thái mặc định dựa trên URL: nếu là "/login" thì hiện đăng nhập
    const [isActive, setIsActive] = useState<boolean>(!isLoginRoute);

    const [signUpData, setSignUpData] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        agree: false,
    });

    const [signInData, setSignInData] = useState({
        username: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading

    const handleRegisterClick = (): void => {
        setIsActive(true);
        navigate('/register');
    };

    const handleLoginClick = (): void => {
        setIsActive(false);
        navigate('/login');
    };

    // Xử lý sự thay đổi input cho form đăng ký
    const handleSignUpChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Xử lý sự thay đổi input cho form đăng nhập
    const handleSignInChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setSignInData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            // Kiểm tra username
            const checkUsernameResponse = await fetch(`http://localhost:8080/Customer/search/existsByUsername?username=${encodeURIComponent(signUpData.username)}`);
            if (!checkUsernameResponse.ok) {
                throw new Error('Failed to check username');
            }
            const usernameExists = await checkUsernameResponse.json();
            if (usernameExists) {
                setErrorMessage('Tên người dùng đã tồn tại. Vui lòng chọn tên khác.');
                setIsLoading(false);
                return;
            }

            // Kiểm tra email
            const checkEmailResponse = await fetch(`http://localhost:8080/Customer/search/existsByEmail?email=${encodeURIComponent(signUpData.email)}`);
            if (!checkEmailResponse.ok) {
                throw new Error('Failed to check email');
            }
            const emailExists = await checkEmailResponse.json();
            if (emailExists) {
                setErrorMessage('Email đã tồn tại. Vui lòng chọn email khác.');
                setIsLoading(false);
                return;
            }
        } catch (err) {
            console.error('Error checking username or email:', err);
            setErrorMessage('Đã xảy ra lỗi khi kiểm tra username hoặc email.');
            setIsLoading(false);
            return;
        }

        // Validate form fields
        if (!signUpData.agree) {
            setErrorMessage('Bạn phải đồng ý với điều khoản & chính sách.');
            setIsLoading(false);
            return;
        }

        // Tạo đối tượng người dùng mới
        const newUser = {
            username: signUpData.username,
            email: signUpData.email,
            password: signUpData.password,
            fullname: signUpData.full_name,
            phoneNumber: null,
            address: null,
            loyaltyPoints: 0,
            customerType: "Khách mới",
            accountStatus: true,
            updatedDate: null
        };

        try {
            const response = await fetch('http://localhost:8080/api/customer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Đăng ký thành công!');
                setSignUpData({
                    username: '',
                    full_name: '',
                    email: '',
                    password: '',
                    agree: false,
                });
                setIsActive(false);
                navigate('/login');
            } else {
                setErrorMessage(result.message || 'Đăng ký thất bại.');
            }
        } catch (error) {
            console.error('Sign-up error:', error);
            setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/customer/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signInData),
            });

            const result = await response.json();
            if (response.ok) {
                if (result.token) {
                    login(result.token); // Sử dụng hàm login từ AuthContext
                    alert('Đăng nhập thành công!');
                    // window.location.href("http://localhost:3000/")
                    window.location.href = "http://localhost:3000/";
                } else {
                    setErrorMessage('Token không hợp lệ từ server.');
                }
            } else {
                setErrorMessage(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            setErrorMessage('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ps28277">
            <div className={`container ${isActive ? 'active' : ''}`} id="container">
                <div className="form-container sign-up">
                    <form id="signup-form" onSubmit={handleSignUpSubmit}>
                        <h1>Tạo tài khoản</h1>
                        <div className="social-icons">
                            {/* Social icons (optional) */}
                        </div>
                        <span>hoặc sử dụng email của bạn để đăng ký</span>
                        <input
                            type="text"
                            placeholder="Tên Đăng Nhập"
                            name="username"
                            value={signUpData.username}
                            onChange={handleSignUpChange}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Họ Và Tên"
                            name="full_name"
                            value={signUpData.full_name}
                            onChange={handleSignUpChange}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={signUpData.email}
                            onChange={handleSignUpChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            name="password"
                            value={signUpData.password}
                            onChange={handleSignUpChange}
                            required
                        />
                        {/* Terms & Policies checkbox */}
                        <label className="terms">
                            <input
                                type="checkbox"
                                id="signup-agree"
                                name="agree"
                                checked={signUpData.agree}
                                onChange={handleSignUpChange}
                                required
                            />
                            <span>Tôi đồng ý với</span> <a href="#">điều khoản &amp; chính sách</a>
                        </label>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
                        </button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form id="signin-form" onSubmit={handleSignInSubmit}>
                        <h1>Đăng nhập</h1>
                        <div className="social-icons">
                            {/* Social icons (optional) */}
                        </div>
                        <span>hoặc sử dụng username của bạn để đăng nhập</span>
                        <input
                            type="text"
                            placeholder="Tên Đăng Nhập"
                            name="username"
                            value={signInData.username}
                            onChange={handleSignInChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            name="password"
                            value={signInData.password}
                            onChange={handleSignInChange}
                            required
                        />
                        {/* Terms & Policies checkbox */}

                        <a className="forget-your-password" href="#">
                            Quên mật khẩu?
                        </a>

                        {errorMessage && <p className="error-message cl-danger">{errorMessage}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Chào mừng trở lại!</h1>
                            <p>Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                            <Link to={"/login"} className="hidden btn btn btn-primary" id="login" onClick={handleLoginClick}>
                                Đăng nhập
                            </Link>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Chào bạn!</h1>
                            <p>Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                            <Link to={"/register"} className="hidden btn btn btn-primary" id="register" onClick={handleRegisterClick}>
                                Đăng Ký
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegisterComponent;
