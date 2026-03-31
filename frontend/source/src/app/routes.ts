import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { OwnerDetail } from './pages/OwnerDetail';
import { AdminOwnerList } from './pages/admin/AdminOwnerList';
import { AddOwner } from './pages/admin/AddOwner';
import { EditOwner } from './pages/admin/EditOwner';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'owner/:id', Component: OwnerDetail },
      { path: 'admin', Component: AdminOwnerList },
      { path: 'admin/add', Component: AddOwner },
      { path: 'admin/edit/:id', Component: EditOwner },
      { path: '*', Component: NotFound },
    ],
  },
]);
