import React from "react";

import Error from '@/pages/404';
import Designer from '@/pages/designer';
import Preview from '@/pages/preview';

export default [
  {
    path: '/',
    exact: true,
    component: Designer
  },
  {
    path: '/preview/:id',
    component: Preview
  },
  {
    path: "*",
    component: Error
  }
];
