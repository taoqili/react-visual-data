import React, { lazy } from "react";

import Error from '@/pages/404';
import Demo from '@/pages/demo';
import Preview from '@/pages/preview';

export default [
  {
    path: '/',
    exact: true,
    component: Demo
  },
  {
    path: '/preview/:id',
    component: Preview
  },
  {
    path: "/error/404",
    component: Error
  }
];
