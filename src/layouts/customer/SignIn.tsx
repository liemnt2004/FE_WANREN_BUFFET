import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import './assets/css/styles.css';
import { getAllUser } from '../../api/apiCustommer/userApi';
import UserModel from "../../models/UserModel";


const LoginRegisterComponent: React.FC = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [listUser, setListUser] = useState<UserModel[]>([]);
    const [signUpData, setSignUpData] = useState({
        username: '',
        email: '',
        password: '',
        agree: false,
    });
    const [signInData, setSignInData] = useState({
        username: '',
        password: '',
        agree: false,
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleRegisterClick = (): void => {
        setIsActive(true);
    };

    const handleLoginClick = (): void => {
        setIsActive(false);
    };

    // Handle input changes for sign-up form
    const handleSignUpChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle input changes for sign-in form
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

        // Validate form data
        if (!signUpData.agree) {
            setErrorMessage('Bạn phải đồng ý với điều khoản & chính sách.');
            return;
        }

        // Send sign-up data to backend API
        try {
            const response = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: signUpData.username,
                    email: signUpData.email,
                    password: signUpData.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Đăng ký thành công!');
                // Optionally, switch to login form
                setIsActive(false);
                // Reset sign-up form
                setSignUpData({
                    username: '',
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

        // Validate form data
        if (!signInData.agree) {
            setErrorMessage('Bạn phải đồng ý với điều khoản & chính sách.');
            return;
        }

        // Authenticate user
        const user = listUser.find(
            (u) => u.username === signInData.username && u.password === signInData.password
        );

        console.log(user);

        if (user) {

            alert('Đăng nhập thành công!');
            // You can redirect the user or update the UI accordingly
        } else {
            setErrorMessage('Username hoặc mật khẩu không đúng.');
        }
    };

    useEffect(() => {
        getAllUser()
            .then((users) => {
                setListUser(users);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

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
                            placeholder="Username"
                            name="username"
                            value={signUpData.username}
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
                            placeholder="Username"
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
                        <label className="terms">
                            <input
                                type="checkbox"
                                id="signin-agree"
                                name="agree"
                                checked={signInData.agree}
                                onChange={handleSignInChange}
                                required
                            />
                            <span>Tôi đồng ý với</span> <a href="#">điều khoản &amp; chính sách</a>
                        </label>
                        <a className="forget-your-password" href="#">
                            Quên mật khẩu?
                        </a>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <button type="submit">Đăng nhập</button>
                    </form>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Chào mừng trở lại!</h1>
                            <p>Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                            <button className="hidden" id="login" onClick={handleLoginClick}>
                                Đăng nhập
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Chào bạn!</h1>
                            <p>Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                            <button className="hidden" id="register" onClick={handleRegisterClick}>
                                Đăng Ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegisterComponent;
