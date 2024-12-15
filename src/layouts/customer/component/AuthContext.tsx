import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
    // Thông tin khách hàng
    userId: string | null; // Thêm userId
    username: string | null;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    roles: string[] | null;
    address: string | null; // Thêm address

    // Thông tin nhân viên
    employeeUserId: string | null;
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
    userId: null,
    username: null,
    fullName: null,
    email: null,
    phone: null,
    roles: null,
    address: null,

    // Nhân viên
    employeeUserId: null,
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
    userId?: string; // Thêm userId
    address?: string; // Thêm address
    fullName?: string;
    email?: string;
    phone?: string;
    roles?: string[];
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // State cho khách hàng
    const [userId, setUserId] = useState<string | null>(null); // Thêm userId
    const [username, setUsername] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[] | null>(null);
    const [address, setAddress] = useState<string | null>(null); // Thêm address

    // State cho nhân viên
    const [employeeUserId, setEmployeeUserId] = useState<string | null>(null);
    const [employeeUsername, setEmployeeUsername] = useState<string | null>(null);
    const [employeeFullName, setEmployeeFullName] = useState<string | null>(null);
    const [employeeEmail, setEmployeeEmail] = useState<string | null>(null);
    const [employeePhone, setEmployeePhone] = useState<string | null>(null);
    const [employeeRoles, setEmployeeRoles] = useState<string[] | null>(null);



    const decodeToken = (token: string, isEmployee: boolean = false) => {
        try {
            const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
            
            
            if (isEmployee) {
                setEmployeeUserId(decoded.userId || "");
                setEmployeeUsername(decoded.sub || null);
                setEmployeeFullName(decoded.fullName || null);
                setEmployeeEmail(decoded.email || null);
                setEmployeePhone(decoded.phone || null);
                setEmployeeRoles(decoded.roles || null);

                setUserId(null);
                setAddress(null);
            } else {
                setUserId(decoded.userId || "")// Lưu userId
                setUsername(decoded.sub || null);
                setFullName(decoded.fullName || null);
                setEmail(decoded.email || null);
                setPhone(decoded.phone || null);
                setRoles(decoded.roles || null);
                setAddress(decoded.address || null); // Lưu address
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
            setEmployeeUserId(null)
            setEmployeeUsername(null);
            setEmployeeFullName(null);
            setEmployeeEmail(null);
            setEmployeePhone(null);
            setEmployeeRoles(null);
        } else {
            localStorage.removeItem("token");
            setUserId(null); // Reset userId
            setUsername(null);
            setFullName(null);
            setEmail(null);
            setPhone(null);
            setRoles(null);
            setAddress(null); // Reset address
        }
    };

    return (
        <AuthContext.Provider
            value={{
                // Khách hàng
                userId,
                username,
                fullName,
                email,
                phone,
                roles,
                address,
                // Nhân viên
                employeeUserId,
                employeeUsername,
                employeeFullName,
                employeeEmail,
                employeePhone,
                employeeRoles,
                // Hàm đăng nhập và đăng xuất
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
