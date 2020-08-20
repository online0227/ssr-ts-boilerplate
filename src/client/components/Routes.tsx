import React from 'react';
import Loadable from 'react-loadable';
import Menu from "./core/Menu";

const loading = () => <div>Loading...</div>;

const HomePage = Loadable({
  loader: () => import('./core/ToBeDeleted_Homepage'),
  loading,
});

const Signin = Loadable({
  loader: () => import('./user/Signin'),
  loading,
});

const Signup = Loadable({
  loader: () => import('./user/Signup'),
  loading,
});

const UserDashboard = Loadable({
  loader: () => import('./user/UserDashboard'),
  loading,
});

const UpdateProfile = Loadable({
  loader: () => import('./user/UpdateProfile'),
  loading,
});

const AdminDashboard = Loadable({
  loader: () => import('./admin/AdminDashboard'),
  loading,
});

const Test = Loadable({
  loader: () => import('./core/ToBeDeleted_Test'),
  loading,
});

const NotFound = Loadable({
  loader: () => import('./core/NotFound'),
  loading,
});

export default [
  {
    component: Menu,
    routes: [
      {
        component: HomePage,
        path: '/',
        exact: true,
      },
      {
        component: Signin,
        path: '/signin'
      },
      {
        component: Signup,
        path: '/signup'
      },
      {
        component: UserDashboard,
        path: '/dashboard',
        exact: true,
      },
      {
        component: UpdateProfile,
        path: '/dashboard/edit/profile'
      },
      {
        component: AdminDashboard,
        path: '/admin',
        exact: true,
      }, {
        component: NotFound
      }
    ]
  }
];