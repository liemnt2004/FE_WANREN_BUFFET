// src/components/PublicRoute.tsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from "./AuthContext";

interface PublicRouteProps {
    children: JSX.Element;

}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { fullName } = useContext(AuthContext);

    if (fullName) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
