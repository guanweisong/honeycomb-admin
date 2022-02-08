import React from 'react';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';
import Layout from '@/layouts/layout';

const BasicLayout: React.FC = (props) => {
  return (
    <QueryParamProvider ReactRouterRoute={Route}>
      <Layout>{props.children}</Layout>
    </QueryParamProvider>
  );
};

export default BasicLayout;
