import { DeleteBody } from '../types/common/delete-body.type';
import {
  CreateCategoryBody,
  DetailCategoryResponse,
  ListCategoriesQuery,
  ListCategoriesResponse,
  UpdateCategoryBody,
} from '../types/requests/category.type';
import { api } from '../utils/api.util';

export const categoryRequest = {
  create: async (body: CreateCategoryBody) => {
    const { data } = await api.post('/categories', body);
    return data;
  },

  list: async (params: ListCategoriesQuery) => {
    const { data } = await api.get<ListCategoriesResponse>('/categories', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailCategoryResponse>(`/categories/${id}`);
    return data;
  },

  update: async (id: number, body: UpdateCategoryBody) => {
    const { data } = await api.put(`/categories/${id}`, body);
    return data;
  },

  delete: async (body: DeleteBody) => {
    const { data } = await api.delete('/categories', { data: body });
    return data;
  },
};
