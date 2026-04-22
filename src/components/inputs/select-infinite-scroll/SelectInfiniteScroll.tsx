import Select, { BaseOptionType, DefaultOptionType, SelectProps } from 'antd/es/select';
import { BaseSelectRef } from 'rc-select/lib';
import { forwardRef, ReactNode, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseEntity } from '../../../types/entities/_base.entity';
import { sleep } from '../../../utils/sleep.util';
import { useCompareMemo } from '../../../utils/use-compare-memo.util';
import { useConditionalHook } from '../../../utils/use-conditional-hook.util';
import {
  InfiniteScrollConfig,
  InfiniteScrollRequestType,
  useInfiniteScroll,
} from '../../../utils/use-infinite-scroll.util';
import { useStateRef } from '../../../utils/use-state-ref.util';
import { AppSelect, AppSelectProps } from '../app-select/AppSelect';

export type SelectInfiniteScrollProps<
  E extends Record<string, any> = BaseEntity,
  R extends InfiniteScrollRequestType<E, D, L> = any,
  D extends string = R extends InfiniteScrollRequestType<E, infer D, any> ? D : never,
  L extends string = R extends InfiniteScrollRequestType<E, any, infer L> ? L : never,
  ValueType = number,
  OptionType extends BaseOptionType | DefaultOptionType = E & { value?: number; label?: ReactNode },
> = AppSelectProps<ValueType, OptionType> & {
  children?: React.ReactNode;
  hasMore?: boolean;
  onLoadMore?: () => void | Promise<void>;
  infiniteScroll?: {
    request: R;
    config?: InfiniteScrollConfig<E, D, L>;
  };
} & React.RefAttributes<BaseSelectRef>;

export type SelectInfiniteScrollType = <
  E extends Record<string, any> = BaseEntity,
  R extends InfiniteScrollRequestType<E, D, L> = any,
  D extends string = R extends InfiniteScrollRequestType<E, infer D, any> ? D : never,
  L extends string = R extends InfiniteScrollRequestType<E, any, infer L> ? L : never,
  ValueType = number,
  OptionType extends BaseOptionType | DefaultOptionType = E & { value?: number; label?: ReactNode },
>(
  props: SelectInfiniteScrollProps<E, R, D, L, ValueType, OptionType>,
) => React.ReactElement;

export const SelectInfiniteScroll = forwardRef(
  ({ classNames, children, infiniteScroll, mode, value, onPopupScroll, onOpenChange, ...others }, ref) => {
    const { t } = useTranslation();

    const loadingMore = useRef(false);
    const popupRef = useRef<HTMLDivElement>();

    const initialValue = useMemo(() => (mode ? undefined : value), [mode, value]);
    const _initialValues = useMemo(() => (mode ? value : undefined), [mode, value]);
    const initialValues = useCompareMemo(_initialValues);

    const infiniteScrollConfig = useMemo(() => {
      if (!infiniteScroll?.request) return undefined;
      return {
        initialValue,
        initialValues,
        ...infiniteScroll.config,
      };
    }, [infiniteScroll?.config, infiniteScroll?.request, initialValue, initialValues]);

    const [data, contextHolder] = useConditionalHook(Boolean(infiniteScroll?.request), useInfiniteScroll, [
      infiniteScroll?.request,
      infiniteScrollConfig,
    ] as any);

    const { hasMore, onLoadMore, options, ...props } = useMemo(() => {
      if (data) {
        return {
          options: data.options,
          loading: data.loading,
          hasMore: data.total > data.options.length,
          onSearch: (value: string) => {
            data.setKeyword(value);
          },
          onLoadMore: async () => {
            data.setPage((prev) => prev + 1);
            await data.waitLoadingMore();
          },
          ...others,
          onFocus: ((e) => {
            others.onFocus?.(e);
            data.setKeyword(undefined);
          }) as AppSelectProps['onFocus'],
        };
      }
      return others;
    }, [data, others]);

    const hasMoreRef = useStateRef(hasMore);

    const loadMore = useCallback(async () => {
      if (
        hasMoreRef.current &&
        !loadingMore.current &&
        popupRef.current?.offsetHeight &&
        popupRef.current.scrollTop + popupRef.current.offsetHeight + 8 >= popupRef.current.scrollHeight
      ) {
        try {
          loadingMore.current = true;
          await onLoadMore?.();
        } catch {
        } finally {
          loadingMore.current = false;
        }
        await sleep(1000);
        await loadMore();
      }
    }, [onLoadMore]);

    const handleScroll = useCallback<NonNullable<SelectProps['onPopupScroll']>>(
      async (e) => {
        popupRef.current = e.target as HTMLDivElement;
        loadMore();
        onPopupScroll?.(e);
      },
      [loadMore, onPopupScroll],
    );

    const handleOpenChange = useCallback<NonNullable<SelectProps['onOpenChange']>>(
      async (visible) => {
        onOpenChange?.(visible);
        if (visible) {
          setTimeout(loadMore, 1);
        }
      },
      [loadMore, onOpenChange],
    );

    return (
      <>
        {contextHolder}
        <AppSelect
          ref={ref}
          mode={mode}
          value={value}
          showSearch
          filterOption={false}
          labelRender={({ label }) => label ?? <></>}
          onPopupScroll={handleScroll}
          onOpenChange={handleOpenChange}
          {...props}
        >
          <>
            {options?.map((e) => (
              <Select.Option key={e.value} value={e.value} {...e}>
                {e.label}
              </Select.Option>
            )) ?? children}
            {hasMore && (
              <Select.Option value="_" disabled>
                {t('common.loading')}...
              </Select.Option>
            )}
          </>
        </AppSelect>
      </>
    );
  },
) as SelectInfiniteScrollType;
