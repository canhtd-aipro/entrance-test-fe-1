import { useDebounceEffect } from 'ahooks';
import { DefaultOptionType } from 'antd/es/select';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ListQuery } from '../types/common/list-query.type';
import { Observer } from './observer.util';
import { useGeneratedRef } from './use-generated-ref.util';
import { useMemoRef } from './use-memo-ref.util';
import { useStateRef } from './use-state-ref.util';

export type InfiniteScrollRequestType<E, D extends string, L extends string> = {
  detail: (id: number) => Promise<Record<D, E>>;
  list: (params: ListQuery) => Promise<
    {
      total: number;
    } & {
      [K in L]: E[];
    }
  >;
};

export type InfiniteScrollConfig<E, D, L> = {
  initialValue?: number | null;
  initialValues?: number[];
  initialOptions?: E[];
  keywordPropName?: string;
  valuePropName?: keyof E;
  labelPropName?: keyof E;
  labelRender?: (entity: E) => ReactNode;
  detailPropName?: D;
  listPropName?: L;
  query?: Record<string, any>;
};

export const useInfiniteScroll = <
  E extends Record<string, any>,
  R extends InfiniteScrollRequestType<E, D, L>,
  D extends string = R extends InfiniteScrollRequestType<E, infer D, any> ? D : never,
  L extends string = R extends InfiniteScrollRequestType<E, any, infer L> ? L : never,
>(
  request: R,
  {
    initialValue,
    initialValues,
    initialOptions,
    keywordPropName = 'keyword',
    labelPropName = 'name' as keyof E,
    valuePropName = 'id' as keyof E,
    labelRender,
    detailPropName,
    listPropName,
    query,
  }: InfiniteScrollConfig<E, D, L> = {},
) => {
  const [loading, setLoading] = useState(false);
  const [_initialOptions, setInitialOptions] = useState<E[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState<string>();
  const [debounceKeyword, setDebounceKeyword] = useState<string>();
  const [_options, setOptions] = useState<E[]>([]);

  const observerRef = useGeneratedRef(() => new Observer<[]>());
  const populateCacheRef = useGeneratedRef<Map<number, Promise<E | undefined>>>(() => new Map());

  const labelRenderRef = useMemoRef<(e: E) => ReactNode>(() => {
    return labelRender ?? ((e) => e[labelPropName]);
  }, [labelPropName, labelRender]);

  const options = useMemo(() => {
    const values = new Set(_options.map((option) => option[valuePropName]));

    const filteredInitialOptions = _initialOptions.filter((initialOption) => !values.has(initialOption[valuePropName]));

    return [
      ..._options.map((e) => ({ ...e, value: e[valuePropName], label: labelRenderRef.current(e) })),
      ...filteredInitialOptions.map((e) => ({ ...e, value: e[valuePropName], label: labelRenderRef.current(e) })),
    ] satisfies Array<DefaultOptionType & E>;
  }, [_options, _initialOptions, valuePropName]);

  const optionsRef = useStateRef(options);

  useDebounceEffect(
    () => {
      setDebounceKeyword(keyword);
      setPage(1);
    },
    [keyword],
    { wait: 400 },
  );

  useEffect(() => {
    const getDefaultValue = async () => {
      const populate = async (id: number) => {
        let detail = populateCacheRef.current.get(id);
        if (!detail) {
          const getDetail = async () => {
            const ans: E | undefined = optionsRef.current.find((e) => e.value === id);
            if (ans) return ans;

            try {
              setLoading(true);

              const option = await request.detail(id);

              if (detailPropName) {
                return option[detailPropName];
              }
              const [key] = Object.keys(option);
              return option[key as D] as E;
            } catch {
            } finally {
              setLoading(false);
            }
          };
          detail = getDetail();
        }
        populateCacheRef.current.set(id, detail);
        return await detail;
      };

      let initialOption: E[] = [];
      if (initialOptions) {
        initialOption = initialOptions;
      } else if (initialValues) {
        initialOption = await initialValues.filterMapAsync(populate);
      } else if (initialValue) {
        const o = await populate(initialValue);
        initialOption = o ? [o] : [];
      }
      setInitialOptions(initialOption);
    };
    getDefaultValue();
  }, [detailPropName, initialOptions, initialValue, initialValues, request]);

  useEffect(() => {
    const getMoreOptions = async () => {
      try {
        setLoading(true);
        const { total, ...rest } = await request.list({
          [keywordPropName]: debounceKeyword,
          skip: (page - 1) * 10,
          take: 10,
          ...query,
        });
        let options;
        if (listPropName) {
          options = rest[listPropName as keyof typeof rest];
        } else {
          const [key] = Object.keys(rest);
          options = rest[key as keyof typeof rest];
        }

        setOptions((prev) => prev.slice(0, (page - 1) * 10).concat(options as E[]));
        setTotal(total);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    getMoreOptions();
  }, [page, request, debounceKeyword, query, listPropName, keywordPropName]);

  useEffect(() => {
    if (!loading) {
      observerRef.current.notify();
    }
  }, [loading]);

  const waitLoadingMore = useCallback(() => {
    return new Promise<void>((resolve) => {
      const listener = () => {
        observerRef.current.unsubscribe(listener);
        resolve();
      };
      observerRef.current.subscribe(listener);
    });
  }, []);

  return useMemo(
    () => ({ total, options, loading, setKeyword, setPage, waitLoadingMore }),
    [loading, options, total, waitLoadingMore],
  );
};
