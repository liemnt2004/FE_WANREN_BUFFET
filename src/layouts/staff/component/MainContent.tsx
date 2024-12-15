import React, { useEffect, useState } from 'react';
import TableList from './TableList';
import InfoSetting from './InfoSetting';
import { useNavigate } from 'react-router-dom';

interface MainContentProps {
  content: 'home' | '2nd_floor' | 'gdeli' | 'setting' | 'theme';
}

const MainContent: React.FC<MainContentProps> = ({ content }) => {
  const [theme, setTheme] = useState(localStorage.getItem('selected-theme') || 'light');
  const [icon, setIcon] = useState(theme === 'light' ? 'ri-moon-clear-fill' : 'ri-sun-fill');
  const navigate = useNavigate();
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const newIcon = newTheme === 'light' ? 'ri-moon-clear-fill' : 'ri-sun-fill';

    setTheme(newTheme);
    setIcon(newIcon);

    localStorage.setItem('selected-theme', newTheme);
    navigate(0);
  };

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);
  return (
    <main className="main" id='main'>
      {content === 'home' && <TableList area="home" />}
      {content === '2nd_floor' && <TableList area="2nd_floor" />}
      {content === 'gdeli' && <TableList area="gdeli" />}
      {content === 'setting' && <InfoSetting toggleTheme={toggleTheme} icon={icon} />}
    </main>
  );
};

export default MainContent;
