import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import TableModal from './TableModal';
import '../assets/css/styles.css'
import MainContent from './MainContent';

type ContentType = 'home' | '2nd_floor' | 'gdeli' | 'setting';


const StaffIndex: React.FC = () => {
    const [selectedContent, setSelectedContent] = useState<ContentType>('home');
    const handleSidebarClick = (contentType: ContentType) => {
        setSelectedContent(contentType);
    };
    return (
        <>
            <Header toggleId="header-toggle" />
            <Sidebar onClickContent={handleSidebarClick} />
            <MainContent content={selectedContent} />
            <TableModal />
        </>
    );
};

export default StaffIndex;
