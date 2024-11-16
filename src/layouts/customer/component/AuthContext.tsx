import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
    // Thông tin khách hàng
    username: string | null;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    roles: string[] | null;

    // Thông tin nhân viên
    employeeUsername: string | null;
    employeeFullName: string | null;
    employeeEmail: string | null;
    employeePhone: string | null;
    employeeRoles: string[] | null;

    // Hàm đăng nhập và đăng xuất
    login: (token: string, isEmployee?: boolean) => void;
    logout: (isEmployee?: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
    // Khách hàng
    username: null,
    fullName: null,
    email: null,
    phone: null,
    roles: null,

    // Nhân viên
    employeeUsername: null,
    employeeFullName: null,
    employeeEmail: null,
    employeePhone: null,
    employeeRoles: null,

    // Hàm đăng nhập và đăng xuất
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
    // State cho khách hàng
    const [username, setUsername] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[] | null>(null);

    // State cho nhân viên
    const [employeeUsername, setEmployeeUsername] = useState<string | null>(null);
    const [employeeFullName, setEmployeeFullName] = useState<string | null>(null);
    const [employeeEmail, setEmployeeEmail] = useState<string | null>(null);
    const [employeePhone, setEmployeePhone] = useState<string | null>(null);
    const [employeeRoles, setEmployeeRoles] = useState<string[] | null>(null);

    const decodeToken = (token: string, isEmployee: boolean = false) => {
        try {
            const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
            if (isEmployee) {
                setEmployeeUsername(decoded.sub || null);
                setEmployeeFullName(decoded.fullName || null);
                setEmployeeEmail(decoded.email || null);
                setEmployeePhone(decoded.phone || null);
                setEmployeeRoles(decoded.roles || null);
            } else {
                setUsername(decoded.sub || null);
                setFullName(decoded.fullName || null);
                setEmail(decoded.email || null);
                setPhone(decoded.phone || null);
                setRoles(decoded.roles || null);

            }

        } catch (error) {
            console.error("Invalid token:", error);
            logout(isEmployee);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            decodeToken(token);
        }
        const employeeToken = localStorage.getItem("employeeToken");
        if (employeeToken) {
            decodeToken(employeeToken, true);
        }
    }, []);

    const login = (token: string, isEmployee: boolean = false) => {
        if (isEmployee) {
            localStorage.setItem("employeeToken", token);
            decodeToken(token, true);
        } else {
            localStorage.setItem("token", token);
            decodeToken(token);
        }
    };

    const logout = (isEmployee: boolean = false) => {
        if (isEmployee) {
            localStorage.removeItem("employeeToken");
            setEmployeeUsername(null);
            setEmployeeFullName(null);
            setEmployeeEmail(null);
            setEmployeePhone(null);
            setEmployeeRoles(null);
        } else {
            localStorage.removeItem("token");
            setUsername(null);
            setFullName(null);
            setEmail(null);
            setPhone(null);
            setRoles(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                // Khách hàng
                username,
                fullName,
                email,
                phone,
                roles,
                // Nhân viên
                employeeUsername,
                employeeFullName,
                employeeEmail,
                employeePhone,
                employeeRoles  ,
                // Hàm đăng nhập và đăng xuất
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
