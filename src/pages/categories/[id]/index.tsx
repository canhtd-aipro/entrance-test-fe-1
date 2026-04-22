import { Button, Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormProps } from 'antd/lib';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { AppCard } from '../../../components/common/app-card/AppCard';
import { AppForm } from '../../../components/common/app-form/AppForm';
import { BasePage } from '../../../components/common/base-page/BasePage';
import { AppDatePicker } from '../../../components/inputs/app-date-picker/AppDatePicker';
import { Loading } from '../../../components/loading/Loading';
import { useAppModal } from '../../../components/modal-provider/ModalProvider';
import { notify } from '../../../components/notify-provider/NotifyProvider';
import { TEXTBOX_MAX_LENGTH } from '../../../constants/validation.constant';
import { DateTimeFormat } from '../../../enums/date-time-format.enum';
import { Priority } from '../../../enums/priority.enum';
import { categoryRequest } from '../../../requests/category.request';
import { CategoryDetail, UpdateCategoryBody } from '../../../types/requests/category.type';
import { enumValues } from '../../../utils/enum-values.util';
import { useFormChangeWatcher } from '../../../utils/use-form-change-watcher.util';

const DetailCategoryPage: FC = () => {
  const { t } = useTranslation();
  const modal = useAppModal();
  const params = useParams();
  const id = useMemo(() => Number(params.id), [params.id]);

  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [data, setData] = useState<CategoryDetail>();
  const [form] = useForm<UpdateCategoryBody>();
  const { isEdited, isValidated } = useFormChangeWatcher(form, data);

  const getData = useCallback(async () => {
    try {
      setLoadingGet(true);
      const detailData = await categoryRequest.detail(id);
      setData(detailData.category);
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

  const handleSubmit: FormProps<UpdateCategoryBody>['onFinish'] = async (values) => {
    try {
      setLoadingSave(true);
      await categoryRequest.update(id, values);
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
            <AppForm.Item label={t('category.created_date')}>
              <AppDatePicker disabled value={data?.createdAt} displayFormat={DateTimeFormat.DateTimeFull} />
            </AppForm.Item>
            <AppForm.Item label={t('category.updated_date')}>
              <AppDatePicker disabled value={data?.updatedAt} displayFormat={DateTimeFormat.DateTimeFull} />
            </AppForm.Item>
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

export default DetailCategoryPage;
