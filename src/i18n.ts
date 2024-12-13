// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'; // Import initReactI18next

// Import các tệp dịch thuật
import enTranslation from './locales/en/translation.json';
import viTranslation from './locales/vi/translation.json';

export const defaultNS = "translation"; // Đặt đúng namespace
export const resources = {
  en: {
    translation: enTranslation
  },
  vi: {
    translation: viTranslation
  }
} as const;

// Khởi tạo i18next với react-i18next
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: "vi", // Ngôn ngữ mặc định
    fallbackLng: "en", // Ngôn ngữ dự phòng
    defaultNS,
    ns: ["translation"], // Đặt namespace tương ứng với resources
    keySeparator: '.', // Không sử dụng dấu phân cách key (nếu bạn không sử dụng)
    interpolation: {
      escapeValue: false // React đã tự bảo vệ khỏi XSS
    }
  });

export default i18n;
