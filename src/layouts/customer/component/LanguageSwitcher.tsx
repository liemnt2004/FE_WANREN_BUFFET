// src/components/LanguageSwitcher.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // Danh sách ngôn ngữ hỗ trợ
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'vi', label: 'Tiếng Việt' }
    // Thêm các ngôn ngữ khác nếu cần
  ];

  // Hàm thay đổi ngôn ngữ
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Lưu lựa chọn ngôn ngữ vào localStorage để duy trì qua các phiên làm việc
    localStorage.setItem('language', lng);
  };

  return (
    <div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          disabled={i18n.language === lang.code}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            cursor: i18n.language === lang.code ? 'not-allowed' : 'pointer'
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
