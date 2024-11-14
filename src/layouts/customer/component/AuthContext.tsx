import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    username: string | null;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    roles: string[] | null; // Thêm roles
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    username: null,
    fullName: null,
    email: null,
    phone: null,
    roles: null,
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
    roles?: string[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [username, setUsername] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[] | null>(null);
    const navigate = useNavigate();

    const decodeToken = (token: string) => {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            setUsername(decoded.sub || null);
            setFullName(decoded.fullName || null);
            setEmail(decoded.email || null);
            setPhone(decoded.phone || null);
            setRoles(decoded.roles || null);
        } catch (error) {
            console.error("Invalid token:", error);
            logout();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            decodeToken(token);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        decodeToken(token);
        // Bạn có thể điều hướng sau khi đăng nhập nếu cần
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUsername(null);
        setFullName(null);
        setEmail(null);
        setPhone(null);
        setRoles(null);
        navigate('/'); // Chuyển hướng về trang chủ
    };

    return (
        <AuthContext.Provider value={{ username, fullName, email, phone, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
