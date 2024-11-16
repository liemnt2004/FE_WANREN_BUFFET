import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuAdmin from './menuAdmin';

const StaffLayout: React.FC = () => {
    return (
        <>
            <MenuAdmin />
            <main>
                <Outlet /> {/* Placeholder for nested routes */}
            </main>
        </>
    );
};

export default StaffLayout;
