import { useDebounce } from 'ahooks';
import { AutoCompleteProps } from 'antd/lib';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ListQuery } from '../types/common/list-query.type';
import { useGeneratedRef } from './use-generated-ref.util';

export type AutoCompleteRequestType<E, L extends string> = {
  list: (params: ListQuery) => Promise<
    { total: number } & {
      [K in L]: E[];
    }
  >;
};

export type AutoCompleteConfig<E, L> = {
  query?: Record<string, any>;
  listPropName?: L;
  valuePropName?: keyof E;
  labelPropName?: keyof E;
  labelRender?: (entity: E) => ReactNode;
};

export const useAutoComplete = <
  E extends Record<string, any>,
  R extends AutoCompleteRequestType<E, L>,
  L extends string = R extends AutoCompleteRequestType<E, infer L> ? L : never,
>(
  request: R,
  {
    query,
    listPropName,
    valuePropName = 'name' as keyof E,
    labelPropName = 'name' as keyof E,
    labelRender,
  }: AutoCompleteConfig<E, L> = {},
) => {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const debounceKeyword = useDebounce(keyword, { wait: 400 });
  const [_options, setOptions] = useState<E[]>([]);

  const labelRenderRef = useGeneratedRef<(e: E) => ReactNode>(() => {
    return labelRender ?? ((e) => e[labelPropName]);
  });

  const options = useMemo(() => {
    return [
      ..._options.map((e) => ({ ...e, value: e[valuePropName], label: labelRenderRef.current(e) })),
    ] satisfies AutoCompleteProps['options'];
  }, [_options, valuePropName]);

  useEffect(() => {
    const getMoreOptions = async () => {
      try {
        setLoading(true);
        const { total, ...rest } = await request.list({
          keyword: debounceKeyword,
          skip: 0,
          take: 5,
          ...query,
        });
        let options;
        if (listPropName) {
          options = rest[listPropName as keyof typeof rest];
        } else {
          const [key] = Object.keys(rest);
          options = rest[key as keyof typeof rest];
        }

        setOptions(options);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    getMoreOptions();
  }, [request, debounceKeyword, query, listPropName]);

  return useMemo(() => ({ options, loading, setKeyword }), [loading, options]);
};
