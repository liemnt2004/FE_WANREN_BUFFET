// src/layouts/customer/SignIn.tsx

import React, { useState, FormEvent, ChangeEvent, useContext } from 'react';
import './assets/css/styles.css';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "./component/AuthContext";
import { notification, Spin, Button } from "antd";
import { GoogleOutlined } from '@ant-design/icons'; // Sử dụng biểu tượng Google từ Ant Design

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
        phoneNumber: '', // Thêm trường số điện thoại
        agree: false,
    });

    const [signInData, setSignInData] = useState({
        username: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errors, setErrors] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        phoneNumber: '',
        agree: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái loading

    const handleRegisterClick = (): void => {
        setIsActive(true);
        navigate('/register');
    };

    const handleLoginClick = (): void => {
        setIsActive(false);
        navigate('/login');
    };

    // Hàm tiện ích để hiển thị thông báo
    const openNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, description: string) => {
        notification[type]({
            message,
            description,
            placement: 'topRight', // Vị trí hiển thị: topLeft, topRight, bottomLeft, bottomRight
            duration: 3, // Thời gian hiển thị (giây)
        });
    };

    // Hàm xử lý khi người dùng nhấp vào nút Google Sign-In
    const handleGoogleSignIn = () => {
        window.location.href = 'https://wanrenbuffet.online/oauth2/authorization/google';
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
        setErrors({
            username: '',
            full_name: '',
            email: '',
            password: '',
            phoneNumber: '',
            agree: '',
        });
        setIsLoading(true);

        // Các regex đã định nghĩa ở trên
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        const vietnamPhoneRegex = /^(03|05|07|08|09|01[2689])+([0-9]{8,9})$/;
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        let valid = true;
        const newErrors = { ...errors };

        // Kiểm tra định dạng số điện thoại
        if (!vietnamPhoneRegex.test(signUpData.phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ.';
            valid = false;
        }

        // Kiểm tra định dạng email (thuộc Gmail)
        if (!gmailRegex.test(signUpData.email)) {
            newErrors.email = 'Email không hợp lệ. Vui lòng sử dụng địa chỉ Gmail.';
            valid = false;
        }

        // Kiểm tra định dạng mật khẩu


        // Kiểm tra đồng ý với điều khoản
        if (!signUpData.agree) {
            newErrors.agree = 'Bạn phải đồng ý với điều khoản & chính sách.';
            valid = false;
        }

        if (!valid) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            // Kiểm tra username
            const checkUsernameResponse = await fetch(`https://wanrenbuffet.online/Customer/search/existsByUsername?username=${encodeURIComponent(signUpData.username)}`);
            if (!checkUsernameResponse.ok) {
                throw new Error('Failed to check username');
            }
            const usernameExists = await checkUsernameResponse.json();
            if (usernameExists) {
                newErrors.username = 'Tên người dùng đã tồn tại. Vui lòng chọn tên khác.';
                valid = false;
            }

            // Kiểm tra email
            const checkEmailResponse = await fetch(`https://wanrenbuffet.online/Customer/search/existsByEmail?email=${encodeURIComponent(signUpData.email)}`);
            if (!checkEmailResponse.ok) {
                throw new Error('Failed to check email');
            }
            const emailExists = await checkEmailResponse.json();
            if (emailExists) {
                newErrors.email = 'Email đã tồn tại. Vui lòng chọn email khác.';
                valid = false;
            }

            // Kiểm tra số điện thoại
            const checkPhoneResponse = await fetch(`http://103.124.92.95/Customer/search/existsByPhoneNumber?phoneNumber=${encodeURIComponent(signUpData.phoneNumber)}`);
            if (!checkPhoneResponse.ok) {
                throw new Error('Failed to check phone number');
            }
            const phoneExists = await checkPhoneResponse.json();
            if (phoneExists) {
                newErrors.phoneNumber = 'Số điện thoại đã được sử dụng. Vui lòng sử dụng số khác.';
                valid = false;
            }

            if (!valid) {
                setErrors(newErrors);
                setIsLoading(false);
                return;
            }

        } catch (err) {
            console.error('Error checking username, email or phone number:', err);
            setErrorMessage('Đã xảy ra lỗi khi kiểm tra username, email hoặc số điện thoại.');
            openNotification('error', 'Lỗi', 'Đã xảy ra lỗi khi kiểm tra username, email hoặc số điện thoại.');
            setIsLoading(false);
            return;
        }

        // Tiếp tục với việc đăng ký...
        const newUser = {
            username: signUpData.username,
            email: signUpData.email,
            password: signUpData.password,
            fullName: signUpData.full_name,
            phoneNumber: signUpData.phoneNumber, // Gán số điện thoại từ form
            address: null,
            loyaltyPoints: 0,
            customerType: "Khách mới",
            accountStatus: true,
            updatedDate: null
        };

        try {
            const response = await fetch('https://wanrenbuffet.online/api/customer/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            const result = await response.json();
            if (response.ok) {
                openNotification('success', 'Thành công', 'Đăng ký thành công!');
                setSignUpData({
                    username: '',
                    full_name: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    agree: false,
                });
                setIsActive(false);
                navigate('/login');
            } else {
                setErrorMessage(result.message || 'Đăng ký thất bại.');
                openNotification('error', 'Lỗi', result.message || 'Đăng ký thất bại.');
            }
        } catch (error) {
            console.error('Sign-up error:', error);
            setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
            openNotification('error', 'Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('https://wanrenbuffet.online/api/customer/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signInData),
            });

            const result = await response.json();
            if (response.ok) {
                if (result.token) {
                    login(result.token); // Sử dụng hàm login từ AuthContext
                    openNotification('success', 'Thành công', 'Đăng nhập thành công!');
                    window.location.href = "https://wanrenbuffet.netlify.app/"
                } else {
                    setErrorMessage('Token không hợp lệ từ server.');
                    openNotification('error', 'Lỗi', 'Token không hợp lệ từ server.');
                }
            } else {
                setErrorMessage(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
                openNotification('error', 'Lỗi', result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            setErrorMessage('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
            openNotification('error', 'Lỗi', 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ps28277 container-fluid">
            <div className={`container ${isActive ? 'active' : ''}`} id="container">
                <div className="form-container sign-up">
                    <form id="signup-form" onSubmit={handleSignUpSubmit}>
                        <h1>Tạo tài khoản</h1>
                        <div className="social-icons">
                            {/* Nút Đăng Ký bằng Google */}
                            <Button
                                type="primary"
                                icon={<GoogleOutlined />}
                                onClick={handleGoogleSignIn}
                                className="google-button"
                            >
                                Đăng ký bằng Google
                            </Button>
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
                        {errors.username && <p className="error-message">{errors.username}</p>}

                        <input
                            type="text"
                            placeholder="Họ Và Tên"
                            name="full_name"
                            value={signUpData.full_name}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.full_name && <p className="error-message">{errors.full_name}</p>}

                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={signUpData.email}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}

                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            name="phoneNumber"
                            value={signUpData.phoneNumber}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}

                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            name="password"
                            value={signUpData.password}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}

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
                        {errors.agree && <p className="error-message">{errors.agree}</p>}

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? <Spin /> : 'Đăng Ký'}
                        </button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form id="signin-form" onSubmit={handleSignInSubmit}>
                        <h1>Đăng nhập</h1>
                        <div className="social-icons">
                            {/* Nút Đăng Nhập bằng Google */}
                            <Button
                                type="primary"
                                icon={<GoogleOutlined />}
                                onClick={handleGoogleSignIn}
                                className="google-button"
                            >
                                Đăng nhập bằng Google
                            </Button>
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

                        <Link to={"/forgot-password"} className="forget-your-password">
                            Quên mật khẩu?
                        </Link>

                        {errorMessage && <p className="error-message cl-danger">{errorMessage}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? <Spin /> : 'Đăng nhập'}
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
