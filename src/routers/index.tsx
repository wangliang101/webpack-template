import type { RouteObject } from 'react-router-dom';
import React, { lazy } from 'react';

const Login = lazy(() => import('../page/login'));

const routers: RouteObject[] = [
  {
    path: '/',
    // auth: false,
    element: <Login />
  }
];

export default routers;
