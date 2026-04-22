import { Button, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormProps } from 'antd/lib';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppCard } from '../../../components/common/app-card/AppCard';
import { AppForm } from '../../../components/common/app-form/AppForm';
import { BasePage } from '../../../components/common/base-page/BasePage';
import { useAppModal } from '../../../components/modal-provider/ModalProvider';
import { notify } from '../../../components/notify-provider/NotifyProvider';
import { TEXTBOX_MAX_LENGTH } from '../../../constants/validation.constant';
import { Priority } from '../../../enums/priority.enum';
import { categoryRequest } from '../../../requests/category.request';
import { CreateCategoryBody } from '../../../types/requests/category.type';
import { enumValues } from '../../../utils/enum-values.util';
import { useFormChangeWatcher } from '../../../utils/use-form-change-watcher.util';

const CreateCategoryPage: FC = () => {
  const { t } = useTranslation();
  const modal = useAppModal();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form] = useForm<CreateCategoryBody>();
  const { isEdited, isValidated } = useFormChangeWatcher(form, {} as CreateCategoryBody);

  const handleSubmit: FormProps<CreateCategoryBody>['onFinish'] = async (values) => {
    try {
      setLoading(true);
      await categoryRequest.create(values);
      notify.success(t('common.action_successfully', { action: t('common.register') }));
      navigate('/categories');
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <BasePage
      buttons={
        <>
          <Button disabled={!isEdited} onClick={() => modal.confirmDiscard(handleCancel)}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" disabled={!isEdited || !isValidated} onClick={form.submit} loading={loading}>
            {t('common.register')}
          </Button>
        </>
      }
    >
      <AppCard>
        <AppForm form={form} onFinish={handleSubmit}>
          <div className="app-detail-form">
            <AppForm.Item
              name="name"
              label={t('category.name')}
              rules={[{ required: true, whitespace: true, max: TEXTBOX_MAX_LENGTH }]}
            >
              <Input placeholder={t('category.enter_name')} />
            </AppForm.Item>
            <AppForm.Item name="priority" label={t('category.priority')} rules={[{ required: true }]}>
              <Select
                allowClear
                options={enumValues(Priority).map((e) => ({ value: e, label: t(`enum.priority.${e}`) }))}
                placeholder={t('category.select_priority')}
              />
            </AppForm.Item>
          </div>
        </AppForm>
      </AppCard>
    </BasePage>
  );
};

export default CreateCategoryPage;
