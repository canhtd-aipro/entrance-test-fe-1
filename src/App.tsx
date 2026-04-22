import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import Cookies from 'js-cookie';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './assets/styles/index.scss';
import { ModalProvider } from './components/modal-provider/ModalProvider';
import { NotifyProvider } from './components/notify-provider/NotifyProvider';
import { SlotProvider } from './components/slot-provider/SlotProvider';
import { datetimeLocaleMap } from './constants/datetime-locale-map.constant';
import { themeConfig } from './constants/theme-config.constant';
import { Language } from './enums/language.enum';
import { StorageKey } from './enums/storage-key.enum';
import { AppRoutes } from './pages';
import { globalActions } from './redux/slices/global.slice';
import { dispatch, store } from './redux/store';
import { datetime } from './utils/datetime.util';

const px2rem = px2remTransformer({
  rootValue: 16,
});

let locale = (Cookies.get('locale') as Language) || Language.En;
if (!(locale in Language)) locale = Language.En;
Cookies.set('locale', locale, {
  expires: datetime().add(100, 'year').toDate(),
});
datetime.locale(datetimeLocaleMap[locale]);

export const App: React.FC<{}> = () => {
  const { i18n } = useTranslation();

  const locale = useMemo(() => {
    switch (i18n.language) {
      case Language.En:
        return enUS;
    }
  }, [i18n.language]);

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === StorageKey.AuthChanged) {
        window.location.reload();
      }
    };

    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, []);

  useEffect(() => {
    const calcZoom = () => {
      const body = document.querySelector('body') as HTMLElement;
      if (window.innerWidth < 1440 && window.innerWidth > 640) {
        const scale = window.innerWidth / 1440;
        body.style.scale = String(scale);
        body.style.transformOrigin = '0 0';
        body.style.width = `${100 / scale}%`;
        body.style.height = `${100 / scale}%`;
        dispatch(globalActions.setScale(scale));
      } else {
        body.style.scale = '';
        body.style.transformOrigin = '';
        body.style.width = '';
        body.style.height = '';
        dispatch(globalActions.setScale(1));
      }
    };
    calcZoom();
    window.addEventListener('resize', calcZoom);

    return () => {
      window.removeEventListener('resize', calcZoom);
    };
  }, []);

  const router = createBrowserRouter([{ path: '*', element: <AppRoutes /> }]);

  return (
    <Provider store={store}>
      <ConfigProvider theme={themeConfig} locale={locale} wave={{ disabled: true }} button={{ autoInsertSpace: false }}>
        <StyleProvider transformers={[px2rem]}>
          <ModalProvider>
            <NotifyProvider>
              <SlotProvider>
                <RouterProvider router={router} />
              </SlotProvider>
            </NotifyProvider>
          </ModalProvider>
        </StyleProvider>
      </ConfigProvider>
    </Provider>
  );
};
