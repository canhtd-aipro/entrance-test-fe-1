import { Button, Input, Select, TableProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { FormProps } from 'antd/lib';
import { omit } from 'lodash';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';
import { PiTrash } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { AppCard } from '../../components/common/app-card/AppCard';
import { AppForm } from '../../components/common/app-form/AppForm';
import { MultiFormItem } from '../../components/common/app-form/multi-form-item/MultiFormItem';
import { AppTable } from '../../components/common/app-table/AppTable';
import { BasePage } from '../../components/common/base-page/BasePage';
import { AppRangePicker } from '../../components/inputs/app-range-picker/AppRangePicker';
import { useAppModal } from '../../components/modal-provider/ModalProvider';
import { notify } from '../../components/notify-provider/NotifyProvider';
import { defaultPageSize } from '../../constants/pagination.constant';
import { DateTimeFormat } from '../../enums/date-time-format.enum';
import { Priority } from '../../enums/priority.enum';
import { categoryRequest } from '../../requests/category.request';
import { CategoryItem, ListCategoriesQuery, ListCategoriesResponse } from '../../types/requests/category.type';
import { datetime } from '../../utils/datetime.util';
import { enumValues } from '../../utils/enum-values.util';
import { parseNumber, parseNumberArray, parseString, useQuery } from '../../utils/use-query.util';

const queryTypes = {
  keyword: parseString(),
  createdAtFrom: parseString(),
  createdAtTo: parseString(),
  priorities: parseNumberArray(),
  page: parseNumber(1),
  pageSize: parseNumber(defaultPageSize),
};

const ListCategoriesPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modal = useAppModal();

  const [query, setQuery] = useQuery(queryTypes);
  const [data, setData] = useState<ListCategoriesResponse>();
  const [loadingGet, setLoadingGet] = useState(false);

  const [form] = useForm<ListCategoriesQuery>();

  const getData = useCallback(async () => {
    try {
      setLoadingGet(true);

      const { page, pageSize, ...rest } = query;
      const params: ListCategoriesQuery = {
        skip: (page - 1) * pageSize,
        take: pageSize,
        ...rest,
      };

      const listData = await categoryRequest.list(params);
      setData(listData);
    } catch {
    } finally {
      setLoadingGet(false);
    }
  }, [query]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    form.setFieldsValue(omit(query, 'page', 'pageSize'));
  }, [form, query]);

  const handleSearch: FormProps<ListCategoriesQuery>['onFinish'] = (values) => {
    setQuery((prev) => ({ ...prev, ...values, page: 1 }));
  };

  const columns = useMemo(() => {
    return [
      {
        title: t('category.name'),
        dataIndex: 'name',
      },
      {
        title: t('category.priority'),
        dataIndex: 'priority',
        render: (value: Priority) => t(`enum.priority.${value}`),
      },
      {
        title: t('category.created_date'),
        dataIndex: 'createdAt',
        render: (date: string) => datetime(date).format(DateTimeFormat.Date),
      },
      {
        title: t('category.updated_date'),
        dataIndex: 'updatedAt',
        render: (date: string) => datetime(date).format(DateTimeFormat.Date),
      },
      {
        title: t('common.actions'),
        width: 1,
        fixed: 'right',
        render: (_, record: CategoryItem) => (
          <div className="flex items-center justify-center">
            <PiTrash
              className="cursor-pointer text-18 text-danger"
              onClick={(e) => {
                e.stopPropagation();
                modal.confirmDelete(async () => {
                  await categoryRequest.delete({ ids: [record.id] });
                  notify.success(t('common.action_successfully', { action: t('common.delete') }));
                  await getData();
                });
              }}
            />
          </div>
        ),
      },
    ] satisfies TableProps<CategoryItem>['columns'];
  }, [getData, modal, t]);

  return (
    <BasePage>
      <AppCard>
        <AppForm form={form} onFinish={handleSearch}>
          <div className="app-filter-form">
            <AppForm.Item name="keyword" label={t('category.name')}>
              <Input placeholder={t('category.search_name')} />
            </AppForm.Item>
            <AppForm.Item name="priorities" label={t('category.priority')}>
              <Select
                mode="multiple"
                allowClear
                options={enumValues(Priority).map((e) => ({ value: e, label: t(`enum.priority.${e}`) }))}
                placeholder={t('category.select_priority')}
              />
            </AppForm.Item>
            <MultiFormItem names={['createdAtFrom', 'createdAtTo']} label={t('category.created_date')}>
              <AppRangePicker
                nullable={false}
                picker="date"
                displayFormat={DateTimeFormat.Date}
                valueFormat={DateTimeFormat.DateTimeValue}
              />
            </MultiFormItem>
            <AppForm.Item label=" ">
              <div className="flex items-end justify-end gap-8">
                <Button
                  onClick={() => {
                    form.resetFields();
                    setQuery({});
                  }}
                >
                  {t('common.clear')}
                </Button>
                <Button type="primary" htmlType="submit">
                  {t('common.search')}
                </Button>
              </div>
            </AppForm.Item>
          </div>
        </AppForm>
      </AppCard>
      <AppCard className="mt-6 sm:mt-12">
        <div className="mb-12 flex justify-end">
          <Link to="/categories/create">
            <Button icon={<AiOutlinePlus className="text-16" />} type="primary">
              {t('common.create_new')}
            </Button>
          </Link>
        </div>
        <AppTable
          className="flex-1-recursive"
          columns={columns}
          dataSource={data?.categories}
          pagination={{
            total: data?.total,
            pageSize: query.pageSize,
            onChange: (page, pageSize) => setQuery((prev) => ({ ...prev, page, pageSize })),
            current: query.page,
          }}
          loading={loadingGet}
          onRow={(record) => ({
            onClick: () => {
              navigate(`/categories/${record.id}`);
            },
          })}
        />
      </AppCard>
    </BasePage>
  );
};

export default ListCategoriesPage;
