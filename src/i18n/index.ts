import i18n from 'i18next';
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';
import { Language } from '../enums/language.enum';
import japanese from './locales/ja.json';

const resources = {
  [Language.En]: {
    translation: japanese,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: Cookies.get('locale') || Language.En,
    fallbackLng: Language.En,
    interpolation: {
      escapeValue: false, // react already safes from xss
      alwaysFormat: true,
      format: (value) => {
        if (value === undefined || value === null) {
          return '';
        }
        return value;
      },
    },
  });

export default i18n;
