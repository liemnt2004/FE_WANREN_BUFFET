import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from "./customer/component/AuthContext";

interface PublicRouteProps {
    children: JSX.Element;
}

const EmployeePublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { roles } = useContext(AuthContext);

    if (roles && (roles.includes('EMPLOYEE') || roles.includes('MANAGER'))) {
        return <Navigate to="/employee" replace />;
    }

    return children;
};

export default EmployeePublicRoute;
