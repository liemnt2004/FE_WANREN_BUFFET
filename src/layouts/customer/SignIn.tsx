import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import './assets/css/styles.css';
import { getAllUser } from '../../api/apiCustommer/userApi';
import UserModel from "../../models/UserModel";
import {useLocation, useParams} from "react-router-dom";
import { Link } from "react-router-dom";


const LoginRegisterComponent: React.FC = () => {
    const [listUser, setListUser] = useState<UserModel[]>([]);
    const location = useLocation();

    // Nếu URL là "/login" thì hiện form đăng nhập, ngược lại hiện form đăng ký
    const isLoginRoute = location.pathname === "/login";

    // Trạng thái mặc định dựa trên URL: nếu là "/login" thì hiện đăng nhập
    const [isActive, setIsActive] = useState<boolean>(!isLoginRoute);

    const [signUpData, setSignUpData] = useState({
        username: '',
        full_name:'',
        email: '',
        password: '',
        agree: false,
    });

    const [signInData, setSignInData] = useState({
        username: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleRegisterClick = (): void => {
        setIsActive(true); // Bật form đăng ký
    };

    const handleLoginClick = (): void => {
        setIsActive(false); // Bật form đăng nhập
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
        const { name, value, type, checked } = e.target;
        setSignInData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const checkUsernameResponse = await fetch(`http://localhost:8080/Customer/search/existsByUsername?username=${signUpData.username}`);
            if (!checkUsernameResponse.ok) {
                throw new Error('Failed to check username');
            }
            const usernameExists = await checkUsernameResponse.json();
            if (usernameExists) {
                setErrorMessage('Tên người dùng đã tồn tại. Vui lòng chọn tên khác.');
                return;
            }

            const checkEmailResponse = await fetch(`http://localhost:8080/Customer/search/existsByEmail?email=${signUpData.email}`);
            if (!checkEmailResponse.ok) {
                throw new Error('Failed to check email');
            }
            const emailExists = await checkEmailResponse.json();
            if (emailExists) {
                setErrorMessage('Email đã tồn tại. Vui lòng chọn email khác.');
                return;
            }
        } catch (err) {
            console.error('Error checking username or email:', err);
            setErrorMessage('Đã xảy ra lỗi khi kiểm tra username hoặc email.');
            return;
        }

        // Validate form fields
        if (!signUpData.agree) {
            setErrorMessage('Bạn phải đồng ý với điều khoản & chính sách.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/customer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Đăng ký thành công!');
                setIsActive(true);  // Chuyển về form đăng nhập
                setSignUpData({
                    username: '',
                    full_name: '',
                    email: '',
                    password: '',
                    agree: false,
                });
            } else {
                setErrorMessage(result.message || 'Đăng ký thất bại.');
            }
        } catch (error) {
            console.error('Sign-up error:', error);
            setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };


    const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/customer/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signInData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Đăng nhập thành công!');
                // Handle successful login (e.g., redirect to another page or set authentication state)
            } else {
                setErrorMessage(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            setErrorMessage('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
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

                        <button type="submit">Đăng Ký</button>
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

                        <button type="submit">Đăng nhập</button>
                    </form>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Chào mừng trở lại!</h1>
                            <p>Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                            <Link to={"/login"} className="hidden" id="login" onClick={handleLoginClick}>
                                Đăng nhập
                            </Link>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Chào bạn!</h1>
                            <p>Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                            <Link to={"/register"} className="hidden" id="register" onClick={handleRegisterClick}>
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
