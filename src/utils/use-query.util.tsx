import { isArray } from 'lodash';
import { DependencyList, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStateRef } from './use-state-ref.util';

type DefaultMap = Record<string, any>;

export type UseQueryOptions<T extends DefaultMap> = {
  [F in keyof T]: (searchParams: URLSearchParams, field: string) => T[F];
};

export type UseQueryReturnType<T extends DefaultMap> = [
  T, // query
  (p: Partial<T> | ((prev: T) => T)) => void, // setQuery
];

export const useQuery = <T extends DefaultMap = DefaultMap>(
  types: UseQueryOptions<T>,
  deps: DependencyList = [types?.defaults, types?.types],
): UseQueryReturnType<T> => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryRef = useRef<T>();
  const searchParamsRef = useStateRef(searchParams);

  const query = useMemo(() => {
    queryRef.current = Object.fromEntries(
      Object.keys(types).map((field) => [field, types[field](searchParams!, field)]),
    ) as T;
    return queryRef.current;
    // eslint-disable-next-line
  }, [searchParams, ...deps]);

  const setQuery = useCallback<UseQueryReturnType<T>[1]>(
    (p) => {
      const query = typeof p === 'function' ? p(queryRef.current!) : p;
      const newSearchParams = new URLSearchParams();

      for (const key in query) {
        if (isArray(query[key])) {
          query[key].forEach((value: string) => newSearchParams.append(key, String(value)));
        } else if (query[key] !== undefined) {
          newSearchParams.set(key, String(query[key]));
        }
      }

      if (newSearchParams.toString() === searchParamsRef.current.toString()) {
        newSearchParams.set('qt', String(Date.now()));
      }
      navigate({ search: `?${newSearchParams.toString()}` });
    },
    [navigate, searchParamsRef],
  );

  return useMemo(() => [query, setQuery], [query, setQuery]);
};

export function parseNumber(): (searchParams: URLSearchParams, field: string) => number | undefined;
export function parseNumber(d: number): (searchParams: URLSearchParams, field: string) => number;
export function parseNumber(d?: number) {
  return (searchParams: URLSearchParams, field: string) => {
    const p = searchParams.get(field);
    if (!p) return d;
    const ans = Number(p);
    return Number.isNaN(ans) ? d : ans;
  };
}

export function parseString(): (searchParams: URLSearchParams, field: string) => string | undefined;
export function parseString(d: string): (searchParams: URLSearchParams, field: string) => string;
export function parseString(d?: string) {
  return (searchParams: URLSearchParams, field: string) => searchParams.get(field) ?? d;
}

export function parseBoolean(d?: boolean) {
  return (searchParams: URLSearchParams, field: string) => {
    const p = searchParams.get(field);
    if (p === null) return d;
    return p === 'true' || p === '1';
  };
}
export function parseNumberArray(): (searchParams: URLSearchParams, field: string) => number[] | undefined;
export function parseNumberArray(d: number[]): (searchParams: URLSearchParams, field: string) => number[];
export function parseNumberArray(d?: number[]) {
  return (searchParams: URLSearchParams, field: string) => {
    const p = searchParams.getAll(field);
    if (!p || p.length === 0) return d;
    return p.map((e) => Number(e)).filter((e) => !Number.isNaN(e));
  };
}

export function parseStringArray(): (searchParams: URLSearchParams, field: string) => string[] | undefined;
export function parseStringArray(d: string[]): (searchParams: URLSearchParams, field: string) => string[];
export function parseStringArray(d?: string[]) {
  return (searchParams: URLSearchParams, field: string) => {
    const p = searchParams.getAll(field);
    if (!p || p.length === 0) return d;
    return p;
  };
}
