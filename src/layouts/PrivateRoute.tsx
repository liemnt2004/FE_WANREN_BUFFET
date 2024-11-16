// PrivateRoute.tsx
import React from 'react';
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Sửa cách import
import { DecodedToken } from "./customer/component/AuthContext"; // Đảm bảo đúng import

interface PrivateRouteProps {
    allowedRoles: string[];
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
    const employeeToken = localStorage.getItem("employeeToken");
    const customerToken = localStorage.getItem("token");

    let decoded: DecodedToken | null = null;

    try {
        if (employeeToken) {
            decoded = jwtDecode<DecodedToken>(employeeToken);
        } else if (customerToken) {
            decoded = jwtDecode<DecodedToken>(customerToken);
        }
    } catch (error) {
        console.error("Failed to decode token:", error);
        // Chuyển hướng dựa trên loại token hiện có
        return employeeToken ? <Navigate to="/employee/login" replace /> : <Navigate to="/login" replace />;
    }

    if (!decoded) {
        // Không có token nào
        return <Navigate to="/login" replace />;
    }


    // Normalize roles to an array
    const rolesArray = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];

    // Check access permissions
    const hasAccess = rolesArray.some(role => allowedRoles.includes(role || ""));

    if (!hasAccess) {
        alert("Bạn Không Có Quyền")
        localStorage.removeItem("employeeToken");
        return <Navigate to="/employee/login" replace />;
    }

    return children;
};

export default PrivateRoute;
