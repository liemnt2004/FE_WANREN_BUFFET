// src/components/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    fullName: null,
    email: null,
    phone: null,
    login: () => {},
    logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export interface DecodedToken {
    sub: string;
    fullName?: string;
    email?: string;
    phone?: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [fullName, setFullName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const navigate = useNavigate();

    const decodeToken = (token: string) => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded: DecodedToken = jwtDecode(token);
            setFullName(decoded.fullName || decoded.sub);
            setEmail(decoded.email || null);
            setPhone(decoded.phone || null);
        } catch (error) {
            console.error("Invalid token:", error);
            logout(); // Gọi logout nếu token không hợp lệ
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        decodeToken(token || "");
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        decodeToken(token);
        navigate("/"); // Chuyển hướng tới trang chủ sau khi đăng nhập thành công
    };

    const logout = () => {
        localStorage.removeItem("token");
        setFullName(null);
        setEmail(null);
        setPhone(null);
        navigate("/login"); // Chuyển hướng tới trang đăng nhập sau khi đăng xuất
    };

    return (
        <AuthContext.Provider value={{ fullName, email, phone, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để dễ dàng sử dụng AuthContext
export const useAuth = () => React.useContext(AuthContext);
