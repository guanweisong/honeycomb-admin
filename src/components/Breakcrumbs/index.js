import React from 'react'
import { NavLink } from 'umi'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import menu from '@/utils/menu'

const routes = []
function getRoutes(data) {
  data.forEach((item) => {
    if (item.child) {
      getRoutes(item.child)
    }
    routes.push({
      path: item.link,
      breadcrumb: item.label,
    })
  })
}
getRoutes(menu)

export default withBreadcrumbs(routes)(({ breadcrumbs }) => {
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
  )
})
