import React from 'react';
import { NavLink } from 'umi';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import withBreadcrumbs, { BreadcrumbsRoute } from 'react-router-breadcrumbs-hoc';
import menu, { MenuItem } from '@/utils/menu';

const getRoutes = (data: MenuItem[]) => {
  const routes: BreadcrumbsRoute[] = [];
  data.forEach((item) => {
    if (item.child) {
      getRoutes(item.child);
    }
    routes.push({
      path: item.link,
      breadcrumb: item.label,
    });
  });
  return routes;
};

export default withBreadcrumbs(getRoutes(menu))(({ breadcrumbs }: { breadcrumbs: any[] }) => {
  return (
    <div>
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.key}>
          <Choose>
            <When condition={['/post', '/page'].includes(breadcrumb.match.url)}>
              {breadcrumb.breadcrumb}
            </When>
            <Otherwise>
              <NavLink to={breadcrumb.match.url}>{breadcrumb.breadcrumb}</NavLink>
            </Otherwise>
          </Choose>
          {index < breadcrumbs.length - 1 && <i> / </i>}
        </span>
      ))}
    </div>
  );
});
