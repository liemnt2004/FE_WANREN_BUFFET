import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from "./customer/component/AuthContext";

interface PublicRouteProps {
    children: JSX.Element;
}

const EmployeePublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { employeeRoles } = useContext(AuthContext);
    console.log(employeeRoles)
    if(employeeRoles?.includes('STAFF')){
        return <Navigate to="/staff" replace />;
    }

    if(employeeRoles?.includes('CASHIER')){
        return <Navigate to="/cashier" replace />;
    }
    if(employeeRoles?.includes('ADMIN')){
        return <Navigate to="/ADMIN" replace />;
    }




    return children;
};

export default EmployeePublicRoute;
