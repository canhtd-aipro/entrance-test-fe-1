import { Button, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormProps } from 'antd/lib';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppCard } from '../../../components/common/app-card/AppCard';
import { AppForm } from '../../../components/common/app-form/AppForm';
import { BasePage } from '../../../components/common/base-page/BasePage';
import { AppDatePicker } from '../../../components/inputs/app-date-picker/AppDatePicker';
import { SelectInfiniteScroll } from '../../../components/inputs/select-infinite-scroll/SelectInfiniteScroll';
import { useAppModal } from '../../../components/modal-provider/ModalProvider';
import { notify } from '../../../components/notify-provider/NotifyProvider';
import { TEXTBOX_MAX_LENGTH } from '../../../constants/validation.constant';
import { DateTimeFormat } from '../../../enums/date-time-format.enum';
import { categoryRequest } from '../../../requests/category.request';
import { todoRequest } from '../../../requests/todo.request';
import { CreateTodoBody } from '../../../types/requests/todo.type';
import { itemDtoMapper } from '../../../utils/item-dto-mapper.util';
import { useFormChangeWatcher } from '../../../utils/use-form-change-watcher.util';

const CreateTodoPage: FC = () => {
  const { t } = useTranslation();
  const modal = useAppModal();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form] = useForm<CreateTodoBody>();
  const { isEdited, isValidated } = useFormChangeWatcher(form, {} as CreateTodoBody);

  const handleSubmit: FormProps<CreateTodoBody>['onFinish'] = async (values) => {
    try {
      setLoading(true);
      await todoRequest.create(values);
      notify.success(t('common.action_successfully', { action: t('common.register') }));
      navigate('/todos');
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
              label={t('todo.name')}
              rules={[{ required: true, whitespace: true, max: TEXTBOX_MAX_LENGTH }]}
            >
              <Input placeholder={t('todo.enter_name')} />
            </AppForm.Item>
            <AppForm.Item name="deadline" label={t('todo.deadline')}>
              <AppDatePicker
                className="w-full"
                valueFormat={DateTimeFormat.DateTimeValue}
                displayFormat={DateTimeFormat.DateTimeFull}
                showTime
                placeholder={t('todo.select_deadline')}
              />
            </AppForm.Item>
            <AppForm.Item name="categories" label={t('todo.categories')} {...itemDtoMapper}>
              <SelectInfiniteScroll
                mode="multiple"
                allowClear
                placeholder={t('todo.select_categories')}
                infiniteScroll={{ request: categoryRequest }}
              />
            </AppForm.Item>
          </div>
        </AppForm>
      </AppCard>
    </BasePage>
  );
};

export default CreateTodoPage;
