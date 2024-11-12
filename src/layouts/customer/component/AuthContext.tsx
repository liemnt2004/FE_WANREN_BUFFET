// src/components/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
    username: string | null;
    fullName:string | null;
    email: string | null;
    phone: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    username: null,
    fullName:null,
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
    username?:string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [fullName,setFullName] = useState<string | null>(null)
    const navigate = useNavigate();

    const decodeToken = (token: string) => {


        try {
            const decoded: DecodedToken = jwtDecode(token);
            setFullName(decoded.fullName || null)
            setUsername(decoded.sub || decoded.sub);
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
        setUsername(null);
        setEmail(null);
        setPhone(null);
        setFullName(null);
    };

    return (
        <AuthContext.Provider value={{ username, fullName, email, phone, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để dễ dàng sử dụng AuthContext
export const useAuth = () => React.useContext(AuthContext);
