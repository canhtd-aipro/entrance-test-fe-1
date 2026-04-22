import { Button, Modal, ModalProps } from 'antd';
import { ButtonProps } from 'antd/lib';
import classNames from 'classnames';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import './styles.scss';

export type AppModalProps = ModalProps & {
  onClose?: ModalProps['onCancel'];
  contentClassName?: string | undefined;
};

export const AppModal: FC<AppModalProps> = ({
  children,
  onOk,
  onCancel,
  onClose,
  cancelText,
  okText,
  okButtonProps,
  cancelButtonProps,
  className,
  contentClassName,
  ...others
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOk: ButtonProps['onClick'] = useCallback(
    async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      try {
        const res = onOk?.(e);
        if ((res as any) instanceof Promise) {
          setLoading(true);
          await res;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [onOk],
  );

  return (
    <Modal
      className={classNames('app-modal', className)}
      centered
      footer={
        <div className="flex w-full flex-row justify-end space-x-16 px-16 pb-8 pt-0">
          <Button onClick={onCancel ?? onClose} {...cancelButtonProps}>
            {cancelText ?? t('common.cancel')}
          </Button>
          <Button onClick={handleOk} type="primary" loading={loading} {...okButtonProps}>
            {okText ?? t('common.yes')}
          </Button>
        </div>
      }
      //@ts-ignore
      closeIcon={<IoMdClose className="cursor-pointer !text-white" onClick={onClose ?? onCancel} />}
      destroyOnHidden
      {...others}
    >
      <div className={classNames('app-modal-content gap-16 px-16 py-8 text-14 text-[#000000D9]', contentClassName)}>
        {children}
      </div>
    </Modal>
  );
};
