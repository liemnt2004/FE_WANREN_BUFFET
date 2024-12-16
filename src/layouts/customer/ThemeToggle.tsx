// src/components/ThemeToggle.tsx
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider'; // Đảm bảo đường dẫn đúng

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} className="theme-toggle-btn">
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};

export default ThemeToggle;
