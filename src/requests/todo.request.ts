import { DeleteBody } from '../types/common/delete-body.type';
import {
  CreateTodoBody,
  DetailTodoResponse,
  ListTodosQuery,
  ListTodosResponse,
  UpdateTodoBody,
} from '../types/requests/todo.type';
import { api } from '../utils/api.util';

export const todoRequest = {
  create: async (body: CreateTodoBody) => {
    const { data } = await api.post('/todos', body);
    return data;
  },

  list: async (params: ListTodosQuery) => {
    const { data } = await api.get<ListTodosResponse>('/todos', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailTodoResponse>(`/todos/${id}`);
    return data;
  },

  update: async (id: number, body: UpdateTodoBody) => {
    const { data } = await api.put(`/todos/${id}`, body);
    return data;
  },

  delete: async (body: DeleteBody) => {
    const { data } = await api.delete('/todos', { data: body });
    return data;
  },
};
