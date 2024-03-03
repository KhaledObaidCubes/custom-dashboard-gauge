import { FrequencyType } from 'cubes'
import { PlanIdEnum } from 'cubes-dashboard'

export default {
  strategicPlans: 'Strategic Plans',
  strategicPlan: 'Strategic Plan',
  strategicPriority: 'Strategic Priorities',
  executivePlan: 'Executive Plan',
  governmentKpis: 'Government Common KPIs',
  govCommonKpi: 'Gov. Common KPI',
  keyPerformanceIndicators: 'Key Performance Indicators',
  executiveObjectives: 'Executive Objectives',
  errors: {
    pageNotFound: 'Page Not Found',
    requestError: 'Something went wrong!'
  },
  emptyChart: 'This Chart is Empty',
  emptyPiTable: {
    [PlanIdEnum.strategic]: 'No strategic plan details were found',
    [PlanIdEnum.executive]: 'No executive plan details were found',
    [PlanIdEnum.kpi]: 'No government common KPIs details were found'
  },
  enums: {
    FrequencyType: {
      [FrequencyType.Daily]: 'Daily',
      [FrequencyType.Monthly]: 'Monthly',
      [FrequencyType.Quarterly]: 'Quarterly',
      [FrequencyType.Semesterly]: 'Semi-annually',
      [FrequencyType.Yearly]: 'Yearly'
    }
  },
  back: 'Back',
  action: 'Action',
  lastReportedValue: 'Last Reported Value',
  viewDetails: 'View Details',
  noObjectives: 'No objectives were found',
  noKpis: 'No kpis were found',
  noProjects: 'No projects were found',
  dashboardOverview: 'Dashboard Overview',
  selectAll: 'Select All',
  searchByName: 'Search By Name ',
  noResult: 'No Result',
  add: 'Add',
  cancel: 'Cancel',
  deleteAll: 'Delete All',
  delete: 'Delete',
  accessDenied: 'Access Denied',
  noPermission: "You don't have access permissions",
  notEntered: 'Not Entered'
}
