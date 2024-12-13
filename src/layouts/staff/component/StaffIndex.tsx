import React, { useEffect, useState } from 'react';
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
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const [theme, setTheme] = useState(localStorage.getItem('selected-theme') || 'light');
    const [icon, setIcon] = useState(theme === 'light' ? 'ri-moon-clear-fill' : 'ri-sun-fill');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        const newIcon = newTheme === 'light' ? 'ri-moon-clear-fill' : 'ri-sun-fill';
      
        setTheme(newTheme);
        setIcon(newIcon);
      
        localStorage.setItem('selected-theme', newTheme);
      };

    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
    }, [theme]);

    return (
        <>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar onClickContent={handleSidebarClick} isVisible={isSidebarVisible} toggleTheme={toggleTheme} icon={icon} />
            <MainContent content={selectedContent} />
            <TableModal />
        </>
    );
};

export default StaffIndex;
