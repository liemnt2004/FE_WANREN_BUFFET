// src/layouts/customer/SignIn.tsx
import React, { useState, FormEvent, ChangeEvent, useContext } from 'react';
import './assets/css/styles.css';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "./component/AuthContext";
import { notification, Spin, Button } from "antd";
import { GoogleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const LoginRegisterComponent: React.FC = () => {
    const { t } = useTranslation(); // Khởi tạo hook i18n
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);
    const isLoginRoute = location.pathname === "/login";

    const [isActive, setIsActive] = useState<boolean>(!isLoginRoute);

    const [signUpData, setSignUpData] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        phoneNumber: '',
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRegisterClick = (): void => {
        setIsActive(true);
        navigate('/register');
    };

    const handleLoginClick = (): void => {
        setIsActive(false);
        navigate('/login');
    };

    const openNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string, description: string) => {
        notification[type]({
            message,
            description,
            placement: 'topRight',
            duration: 3,
        });
    };

    const handleGoogleSignIn = () => {
        window.location.href = 'https://wanrenbuffet.online/oauth2/authorization/google';
    };

    const handleSignUpChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setSignUpData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

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

        const vietnamPhoneRegex = /^(03|05|07|08|09|01[2689])+([0-9]{8,9})$/;
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        let valid = true;
        const newErrors = { ...errors };

        if (!vietnamPhoneRegex.test(signUpData.phoneNumber)) {
            newErrors.phoneNumber = t('signIn.invalidPhone') || 'Invalid phone number';
            valid = false;
        }

        if (!gmailRegex.test(signUpData.email)) {
            newErrors.email = t('signIn.invalidEmail') || 'Invalid email';
            valid = false;
        }

        if (!signUpData.agree) {
            newErrors.agree = t('signIn.agreeRequired') || 'You must agree to the terms';
            valid = false;
        }

        if (!valid) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const checkUsernameResponse = await fetch(`https://wanrenbuffet.online/api-data/Customer/search/existsByUsername?username=${encodeURIComponent(signUpData.username)}`);
            if (!checkUsernameResponse.ok) {
                throw new Error('Failed to check username');
            }
            const usernameExists = await checkUsernameResponse.json();
            if (usernameExists) {
                newErrors.username = t('signIn.usernameExists') || 'Username already exists';
                valid = false;
            }

            const checkEmailResponse = await fetch(`https://wanrenbuffet.online/api-data/Customer/search/existsByEmail?email=${encodeURIComponent(signUpData.email)}`);
            if (!checkEmailResponse.ok) {
                throw new Error('Failed to check email');
            }
            const emailExists = await checkEmailResponse.json();
            if (emailExists) {
                newErrors.email = t('signIn.emailExists') || 'Email already exists';
                valid = false;
            }

            const checkPhoneResponse = await fetch(`https://wanrenbuffet.online/api-data/Customer/search/existsByPhoneNumber?phoneNumber=${encodeURIComponent(signUpData.phoneNumber)}`);
            if (!checkPhoneResponse.ok) {
                throw new Error('Failed to check phone number');
            }
            const phoneExists = await checkPhoneResponse.json();
            if (phoneExists) {
                newErrors.phoneNumber = t('signIn.phoneExists') || 'Phone number already exists';
                valid = false;
            }

            if (!valid) {
                setErrors(newErrors);
                setIsLoading(false);
                return;
            }

        } catch (err) {
            console.error('Error checking username, email or phone number:', err);
            setErrorMessage(t('signIn.checkError') || 'Error checking data');
            openNotification('error', t('signIn.error') || 'Error', t('signIn.checkError') || 'Error checking data');
            setIsLoading(false);
            return;
        }

        const newUser = {
            username: signUpData.username,
            email: signUpData.email,
            password: signUpData.password,
            fullName: signUpData.full_name,
            phoneNumber: signUpData.phoneNumber,
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
                openNotification('success', t('signIn.success') || 'Success', t('signIn.registerSuccess') || 'Register successful!');
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
                setErrorMessage(result.message || t('signIn.registerFail'));
                openNotification('error', t('signIn.error'), result.message || t('signIn.registerFail'));
            }
        } catch (error) {
            console.error('Sign-up error:', error);
            setErrorMessage(t('signIn.tryAgain') || 'An error occurred. Please try again.');
            openNotification('error', t('signIn.error'), t('signIn.tryAgain') || 'An error occurred. Please try again.');
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
                    login(result.token);
                    openNotification('success', t('signIn.success'), t('signIn.loginSuccess'));
                    window.location.href = "https://wanrenbuffet.netlify.app/"
                } else {
                    setErrorMessage(t('signIn.invalidToken'));
                    openNotification('error', t('signIn.error'), t('signIn.invalidToken'));
                }
            } else {
                setErrorMessage(result.message || t('signIn.loginFail'));
                openNotification('error', t('signIn.error'), result.message || t('signIn.loginFail'));
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            setErrorMessage(t('signIn.loginError'));
            openNotification('error', t('signIn.error'), t('signIn.loginError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ps28277 container-fluid">
            <div className={`container ${isActive ? 'active' : ''}`} id="container">
                <div className="form-container sign-up">
                    <form id="signup-form" onSubmit={handleSignUpSubmit}>
                        <h1 className='head-login'>{t('signIn.createAccount')}</h1>
                        <div className="social-icons">
                            <Button
                                type="primary"
                                icon={<GoogleOutlined />}
                                onClick={handleGoogleSignIn}
                                className="google-button"
                            >
                                {t('signIn.signUpWithGoogle')}
                            </Button>
                        </div>
                        <span className='text-login'>{t('signIn.orUseEmail')}</span>
                        <input
                            type="text"
                            placeholder={t('signIn.usernamePlaceholder')}
                            name="username"
                            value={signUpData.username}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.username && <p className="error-message">{errors.username}</p>}

                        <input
                            type="text"
                            placeholder={t('signIn.fullNamePlaceholder')}
                            name="full_name"
                            value={signUpData.full_name}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.full_name && <p className="error-message">{errors.full_name}</p>}

                        <input
                            type="email"
                            placeholder={t('signIn.emailPlaceholder')}
                            name="email"
                            value={signUpData.email}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}

                        <input
                            type="text"
                            placeholder={t('signIn.phonePlaceholder')}
                            name="phoneNumber"
                            value={signUpData.phoneNumber}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}

                        <input
                            type="password"
                            placeholder={t('signIn.passwordPlaceholder')}
                            name="password"
                            value={signUpData.password}
                            onChange={handleSignUpChange}
                            required
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}

                        <label className="terms">
                            <input
                                type="checkbox"
                                id="signup-agree"
                                name="agree"
                                checked={signUpData.agree}
                                onChange={handleSignUpChange}
                                required
                            />
                            <span>{t('signIn.agreeTo')}</span> <a href="#">{t('signIn.termsAndPolicies')}</a>
                        </label>
                        {errors.agree && <p className="error-message">{errors.agree}</p>}

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? <Spin /> : t('signIn.registerBtn')}
                        </button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form id="signin-form" onSubmit={handleSignInSubmit}>
                        <h1>{t('signIn.loginTitle')}</h1>
                        <div className="social-icons">
                            <Button
                                type="primary"
                                icon={<GoogleOutlined />}
                                onClick={handleGoogleSignIn}
                                className="google-button"
                            >
                                {t('signIn.loginWithGoogle')}
                            </Button>
                        </div>
                        <span className='text-login'>{t('signIn.orUseUsername')}</span>
                        <input
                            type="text"
                            placeholder={t('signIn.usernamePlaceholder')}
                            name="username"
                            value={signInData.username}
                            onChange={handleSignInChange}
                            required
                        />
                        <input
                            type="password"
                            placeholder={t('signIn.passwordPlaceholder')}
                            name="password"
                            value={signInData.password}
                            onChange={handleSignInChange}
                            required
                        />

                        <Link to={"/forgot-password"} className="forget-your-password">
                            {t('signIn.forgotPassword')}
                        </Link>

                        {errorMessage && <p className="error-message cl-danger">{errorMessage}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? <Spin /> : t('signIn.loginBtn')}
                        </button>
                    </form>
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>{t('signIn.welcomeBack')}</h1>
                            <p>{t('signIn.enterInfo')}</p>
                            <Link to={"/login"} className=" btn btn btn-primary" id="login" onClick={handleLoginClick}>
                                {t('signIn.loginBtn')}
                            </Link>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>{t('signIn.hello')}</h1>
                            <p>{t('signIn.signUpInfo')}</p>
                            <Link to={"/register"} className=" btn btn btn-primary" id="register" onClick={handleRegisterClick}>
                                {t('signIn.registerBtn')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegisterComponent;
