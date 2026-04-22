import { Button, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormProps } from 'antd/lib';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { AppCard } from '../../../components/common/app-card/AppCard';
import { AppForm } from '../../../components/common/app-form/AppForm';
import { BasePage } from '../../../components/common/base-page/BasePage';
import { AppDatePicker } from '../../../components/inputs/app-date-picker/AppDatePicker';
import { SelectInfiniteScroll } from '../../../components/inputs/select-infinite-scroll/SelectInfiniteScroll';
import { Loading } from '../../../components/loading/Loading';
import { useAppModal } from '../../../components/modal-provider/ModalProvider';
import { notify } from '../../../components/notify-provider/NotifyProvider';
import { TEXTBOX_MAX_LENGTH } from '../../../constants/validation.constant';
import { DateTimeFormat } from '../../../enums/date-time-format.enum';
import { categoryRequest } from '../../../requests/category.request';
import { todoRequest } from '../../../requests/todo.request';
import { TodoDetail, UpdateTodoBody } from '../../../types/requests/todo.type';
import { itemDtoMapper } from '../../../utils/item-dto-mapper.util';
import { useFormChangeWatcher } from '../../../utils/use-form-change-watcher.util';

const DetailTodoPage: FC = () => {
  const { t } = useTranslation();
  const modal = useAppModal();
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);

  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [data, setData] = useState<TodoDetail>();
  const [form] = useForm<UpdateTodoBody>();
  const { isEdited, isValidated } = useFormChangeWatcher(form, data);

  const getData = useCallback(async () => {
    try {
      setLoadingGet(true);
      const detailData = await todoRequest.detail(id);
      setData(detailData.todo);
    } catch {
    } finally {
      setLoadingGet(false);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const handleSubmit: FormProps<UpdateTodoBody>['onFinish'] = async (values) => {
    try {
      setLoadingSave(true);
      await todoRequest.update(id, values);
      notify.success(t('common.action_successfully', { action: t('common.save') }));
      await getData();
    } catch {
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCancel = () => {
    if (!data) return;
    form.setFieldsValue(data);
  };

  if (loadingGet) return <Loading />;

  return (
    <BasePage
      buttons={
        <>
          <Button disabled={!isEdited} onClick={() => modal.confirmDiscard(handleCancel)}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" disabled={!isEdited || !isValidated} onClick={form.submit} loading={loadingSave}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <AppCard>
        <AppForm form={form} onFinish={handleSubmit}>
          <div className="app-detail-form">
            <AppForm.Item label={t('todo.created_date')}>
              <AppDatePicker
                value={data?.createdAt}
                disabled
                className="w-full"
                displayFormat={DateTimeFormat.DateTimeFull}
              />
            </AppForm.Item>
            <AppForm.Item label={t('todo.updated_date')}>
              <AppDatePicker
                value={data?.updatedAt}
                disabled
                className="w-full"
                displayFormat={DateTimeFormat.DateTimeFull}
              />
            </AppForm.Item>
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

export default DetailTodoPage;
