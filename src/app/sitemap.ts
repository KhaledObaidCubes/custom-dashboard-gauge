import { profilePage } from 'cubes-app'
import { sessionRoutes } from 'cubes-ui'

// const RouterView = defineComponent({
//   template: '<router-view></router-view>'
// })

const UnitOverview = () => import('./presentation/pages/overview/index.vue')
const ObjectSummary = () => import('./presentation/pages/object-summary/index.vue')
const KpiSummary = () => import('./presentation/pages/kpi-summary/index.vue')
const ProjectDetails = () => import('./presentation/pages/project-details/index.vue')
const StrategicPlan = () => import('./presentation/pages/strategic-plan/index.vue')
const ExecutivePlan = () => import('./presentation/pages/executive-plan/index.vue')
const GovernmentCommonKpis = () => import('./presentation/pages/government-common-kpis/index.vue')
const Unit = () => import('./presentation/pages/unit/index.vue')
const DashboardConfiguration = () => import('./presentation/pages/dashboard-configuration/index.vue')
const AccessDenied = () => import('./presentation/access-denied/access-denied.vue')
// const PageNotFound = () => import('./presentation/pages/404.vue')

const unitOverviewRoute = {
  path: 'overview/:id?',
  name: 'overview',
  component: UnitOverview,
  meta: {
    title: { en: 'Dashboard Overview', ar: 'نظرة عامة على واجهة قياس الأداء' },
    parent: 'unit'
  }
}

const strategicPlanRoute = {
  path: 'strategic-plan/:id',
  name: 'strategic-plan',
  component: StrategicPlan,
  meta: {
    title: { en: 'Strategic Plan', ar: 'الخطة الإستراتيجية' },

    parent: 'unit'
  }
}

const executivePlanRoute = {
  path: 'executive-plan/:id',
  name: 'executive-plan',
  component: ExecutivePlan,
  meta: {
    title: { en: 'Executive Plan', ar: 'الخطة التنفيذية' },

    parent: 'unit'
  }
}

const governmentCommonKpisRoute = {
  path: 'government-common-kpis/:id',
  name: 'government-common-kpis',
  component: GovernmentCommonKpis,
  meta: {
    title: { en: 'Government Common KPIs', ar: 'مؤشرات قياس الأداء الحكومية الموحدة' },
    parent: 'unit'
  }
}

const unit = {
  path: '/unit',
  name: 'unit',
  component: Unit,
  redirect: { name: 'overview' },
  meta: {
    title: { en: 'unit', ar: 'الوحدة' }
  },
  children: [unitOverviewRoute, strategicPlanRoute, executivePlanRoute, governmentCommonKpisRoute]
}

const objectiveSummaryRoute = {
  path: '/objective-summary/:id',
  name: 'objective-summary',
  component: ObjectSummary,
  meta: {
    title: { en: 'Objective Summary', ar: 'Objective Summary' }
  }
}

const kpiDetailsRoute = {
  path: '/kpi-details/:id',
  name: 'kpi-details',
  component: KpiSummary,
  meta: {
    title: { en: 'KPI Details', ar: 'KPI Details' }
  }
}

const projectDetailsRoute = {
  path: '/project-details/:id',
  name: 'project-details',
  component: ProjectDetails,
  meta: {
    title: { en: 'Project Details', ar: 'Project Details' }
  }
}

const dashboardConfigurationRoute = {
  path: '/configuration',
  name: 'dashboard-configuration',
  component: DashboardConfiguration,
  meta: {
    title: { en: 'Dashboard Configuration', ar: 'إعدادات اللوائح' },
    tile: true,
    hidden: true
  }
}

const routes = [
  objectiveSummaryRoute,
  kpiDetailsRoute,
  projectDetailsRoute,
  unit,
  dashboardConfigurationRoute,
  {
    path: '/',
    redirect: { name: 'overview' }
  },
  ...sessionRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'overview' }
    // name: '404',
    // beforeEnter: (to: any, from: any, next: any) => {
    //   if ((to.fullPath == '/' && from.fullPath == '/') || ['/login', '/logout'].includes(to.fullPath)) return next({ name: 'overview' })
    //   else next()
    // },
    // component: PageNotFound,
    // props: {} //{ routeName: 'initiatives-list', actionTitleKey: 'defaultInitiativesRedirect' }
  },
  {
    path: '/accessDenied',
    name: 'access-denied',
    component: AccessDenied
  }
]
if (window['configure']().secure) routes.splice(routes.length - 2, 0, profilePage as any)

export default routes
