import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layout/app-layout/AppLayout';
import { lazyPage } from '../utils/lazy-page.util';

const Error403 = lazyPage(() => import('../components/error-pages/Error403'));
const Error404 = lazyPage(() => import('../components/error-pages/Error404'));
const ListCategoriesPage = lazyPage(() => import('./categories'));
const CreateCategoryPage = lazyPage(() => import('./categories/create'));
const DetailCategoryPage = lazyPage(() => import('./categories/[id]'));
const ListTodosPage = lazyPage(() => import('./todos'));
const CreateTodoPage = lazyPage(() => import('./todos/create'));
const DetailTodoPage = lazyPage(() => import('./todos/[id]'));

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<Error404 />} />
      <Route path="/403" element={<Error403 />} />

      {/* Authenticated routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/categories" replace />} />
        <Route path="/categories" element={<ListCategoriesPage />} />
        <Route path="/categories/create" element={<CreateCategoryPage />} />
        <Route path="/categories/:id" element={<DetailCategoryPage />} />
        <Route path="/todos" element={<ListTodosPage />} />
        <Route path="/todos/create" element={<CreateTodoPage />} />
        <Route path="/todos/:id" element={<DetailTodoPage />} />
      </Route>
    </Routes>
  );
};
