import useModal, { HookAPI } from 'antd/es/modal/useModal';
import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppModal, AppModalProps } from '../common/app-modal/AppModal';

type ModalContextProps = HookAPI & {
  show: (newModal: AppModalProps) => number;
  close: (id: number) => void;
  confirmDiscard: (callback: AppModalProps['onCancel']) => void;
  confirmDelete: (callback: AppModalProps['onOk']) => void;
  confirmBulkDelete: (callback: AppModalProps['onOk']) => void;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useAppModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useAppModal must be used within a ModalProvider');
  }

  return context;
};

type ModalItemProps = AppModalProps & { id: number; icon?: ReactNode };

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  const [modal, contextHolder] = useModal();

  const [modals, setModals] = useState<ModalItemProps[]>([]);

  const show = useCallback((newModal: AppModalProps) => {
    const id = idRef.current++;

    const closeModal = () => {
      setModals((prev) => prev.map((e) => (e.id === id ? { ...e, open: false } : e)));
      setTimeout(() => setModals((prev) => prev.filter((e) => e.id !== id)), 2000);
    };

    const handleClose: AppModalProps['onClose'] = (e) => {
      closeModal();
      newModal.onClose?.(e);
    };

    const handleOk: AppModalProps['onOk'] = async (e) => {
      try {
        const res = newModal.onOk?.(e);
        if ((res as any) instanceof Promise) {
          setModals((prev) =>
            prev.map((e) => (e.id === id ? { ...e, okButtonProps: { ...e.okButtonProps, loading: true } } : e)),
          );
          await res;
        }
        closeModal();
      } finally {
        setModals((prev) =>
          prev.map((e) => (e.id === id ? { ...e, okButtonProps: { ...e.okButtonProps, loading: false } } : e)),
        );
      }
    };

    setModals((prev) =>
      prev.concat({
        ...newModal,
        id,
        open: true,
        onClose: handleClose,
        onOk: handleOk,
      }),
    );

    return id;
  }, []);

  const idRef = useRef(0);
  const appModal = useMemo<ModalContextProps>(() => {
    return {
      ...modal,
      show,
      close: (id) => {
        setModals((prev) => prev.map((e) => (e.id === id ? { ...e, open: false } : e)));
        setTimeout(() => setModals((prev) => prev.filter((e) => e.id !== id)), 2000);
      },
      confirmDiscard: (callback) =>
        show({
          title: t('common.cancellation_confirmation'),
          children: t('common.cancellation_notice'),
          okText: t('common.yes'),
          cancelText: t('common.no'),
          onOk: callback,
        }),
      confirmDelete: (callback) =>
        show({
          title: t('common.delete_modal_title'),
          children: t('common.are_you_sure_to_action', { action: t('common.delete') }),
          okText: t('common.delete'),
          cancelText: t('common.cancel'),
          onOk: callback,
        }),
      confirmBulkDelete: (callback) =>
        show({
          title: t('common.bulk_delete_modal_title'),
          children: t('common.are_you_sure_to_action', { action: t('common.bulk_delete') }),
          okText: t('common.delete'),
          cancelText: t('common.cancel'),
          onOk: callback,
        }),
    };
  }, [modal, show, t]);

  return (
    <ModalContext.Provider value={appModal}>
      {children}
      {contextHolder}
      {modals.map((modal) => {
        return <AppModal key={modal.id} {...modal} />;
      })}
    </ModalContext.Provider>
  );
};
