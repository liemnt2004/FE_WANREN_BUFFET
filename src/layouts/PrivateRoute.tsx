import React, { useContext } from 'react';
import { AuthContext } from "./customer/component/AuthContext";
import { Navigate } from "react-router-dom"; // Import đúng

interface PrivateRouteProps {
    allowedRoles: string[];
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
    const { roles } = useContext(AuthContext);

    if (!roles) {
        return <Navigate to="/login" replace />;
    }

    const hasAccess = roles.some(role => allowedRoles.includes(role));

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;
