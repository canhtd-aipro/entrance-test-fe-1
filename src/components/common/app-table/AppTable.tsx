import { Table, TableProps } from 'antd';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultPageSize, pageSizeOptions } from '../../../constants/pagination.constant';
import './styles.scss';

export type AppTableProps<T> = TableProps<T> & { highlightedRows?: (record: T) => boolean };

export const AppTable = <T,>({
  className,
  dataSource = [],
  pagination,
  onRow,
  scroll,
  virtual = false,
  highlightedRows,
  rowClassName,
  rowSelection,
  ...others
}: AppTableProps<T>) => {
  const { t } = useTranslation();

  const [_page, setPage] = useState(() => (pagination ? (pagination?.defaultCurrent ?? 1) : 1));
  const [_pageSize, setPageSize] = useState(() =>
    pagination ? (pagination?.defaultPageSize ?? defaultPageSize) : defaultPageSize,
  );

  const page = useMemo(() => {
    return pagination === false ? undefined : (pagination?.current ?? pagination?.defaultCurrent ?? _page);
  }, [_page, pagination]);
  const pageSize = useMemo(() => {
    return pagination === false ? undefined : (pagination?.pageSize ?? pagination?.defaultPageSize ?? _pageSize);
  }, [_pageSize, pagination]);

  const total = useMemo(() => {
    if (pagination) return pagination.total;
    return dataSource.length;
  }, [dataSource.length, pagination]);

  const handleRow = useMemo<TableProps<T>['onRow']>(() => {
    if (onRow) {
      return (record, index) => {
        const res = onRow(record, index);
        if (res.onClick) {
          return {
            ...res,
            className: classNames(res.className, 'cursor-pointer'),
            onClick: (e) => {
              if (window.getSelection()?.toString()) {
                return;
              }
              if ((e.target as HTMLElement).closest('.ant-table-selection-column')) {
                return;
              }
              res.onClick!(e);
            },
          };
        }
        return res;
      };
    }
  }, [onRow]);

  useEffect(() => {
    if (total !== undefined) {
      const lastPage = Math.max(Math.ceil(total / pageSize!), 1);
      if (page! > lastPage) {
        setPage(lastPage);
        if (pagination) pagination.onChange?.(lastPage, pageSize!);
      }
    }
  }, [pagination, total, pageSize, page]);

  const _rowClassName = useCallback<Exclude<TableProps<T>['rowClassName'], string | undefined>>(
    (record, index, indent) =>
      classNames(
        { 'highlighted-row': highlightedRows?.(record) },
        typeof rowClassName === 'function' ? rowClassName(record, index, indent) : rowClassName,
      ),
    [highlightedRows, rowClassName],
  );

  return (
    <Table<T>
      className={classNames('app-table [&_.ant-table-pagination]:!mb-0', className)}
      size="middle"
      dataSource={dataSource}
      rowClassName={_rowClassName}
      scroll={{ x: 'max-content', ...scroll }}
      virtual={virtual}
      rowKey="id"
      {...others}
      pagination={
        pagination === false
          ? false
          : {
              showTotal: (total) => (
                <div className="text-14 font-[400]">{t('common.total_number', { number: total })}</div>
              ),
              pageSizeOptions: pageSizeOptions,
              ...pagination,
              current: page,
              total,
              pageSize,
              showSizeChanger:
                pagination?.showSizeChanger === false
                  ? false
                  : {
                      getPopupContainer: () => document.body,
                      ...(pagination?.showSizeChanger as any),
                    },
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
                pagination?.onChange?.(page, pageSize);
              },
            }
      }
      onRow={handleRow}
      rowSelection={rowSelection && { ...rowSelection, fixed: 'left', preserveSelectedRowKeys: true }}
    />
  );
};
