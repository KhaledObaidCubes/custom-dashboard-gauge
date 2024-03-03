import { PlanIdEnum } from 'cubes-dashboard'

export default {
  configCard: {
    title: {
      [PlanIdEnum.strategic]: 'Strategic Plan',
      [PlanIdEnum.executive]: 'Executive Plan',
      [PlanIdEnum.kpi]: 'Government Common KPIs'
    },
    subTitle: {
      [PlanIdEnum.strategic]: 'Selected Priorities',
      [PlanIdEnum.executive]: 'Selected Objectives',
      [PlanIdEnum.kpi]: 'Selected Pillars'
    },
    name: {
      [PlanIdEnum.strategic]: 'priorities',
      [PlanIdEnum.executive]: 'objectives',
      [PlanIdEnum.kpi]: 'pillars'
    },
    addContainer: {
      [PlanIdEnum.strategic]: 'Add Priorities',
      [PlanIdEnum.executive]: 'Add Objectives',
      [PlanIdEnum.kpi]: 'Add Pillars'
    },
    emptyContainer: {
      [PlanIdEnum.strategic]: 'No priorities have been added yet',
      [PlanIdEnum.executive]: 'No objectives have been added yet',
      [PlanIdEnum.kpi]: 'No pillars have been added yet'
    }
  },
  folderBrowser: {
    title: {
      [PlanIdEnum.strategic]: 'Add Strategic Plan Priorities',
      [PlanIdEnum.executive]: 'Add Executive Plan Objectives',
      [PlanIdEnum.kpi]: 'Add Government Common KPIs Pillars'
    }
  },
  dashboardConfiguration: 'Dashboard Configuration',
  dashboardConfigurationDescription: 'Customize what to include in the dashboard for each section.',
  deleteAllBody: 'Are you sure that you want to delete all items from',
  add: 'Add',
  optional: 'Optional',
  save: 'Save',
  edit: 'Edit',
  discard: 'Discard',
  delete: 'Delete',
  cancel: 'Cancel',
  confirmDeletion: 'Confirm Deletion',
  search: 'Search this list',
  browser: 'Browser',
  deleteAll: 'Delete All',
  notifications: {
    deleteAllDashboardItems: {
      [PlanIdEnum.strategic]: 'All priorities have been deleted successfully',
      [PlanIdEnum.executive]: 'All objectives have been deleted successfully',
      [PlanIdEnum.kpi]: 'All pillars have been deleted successfully'
    },
    deletedDashboardItem: {
      [PlanIdEnum.strategic]: 'Priority has been deleted successfully',
      [PlanIdEnum.executive]: 'Objective has been deleted successfully',
      [PlanIdEnum.kpi]: 'Pillar has been deleted successfully'
    },
    addDashboardItem: {
      [PlanIdEnum.strategic]: (count: number) => `${count} Priority(s) has been added successfully`,
      [PlanIdEnum.executive]: (count: number) => `${count} Objective(s) has been added successfully`,
      [PlanIdEnum.kpi]: (count: number) => `${count} Pillar(s) has been added successfully`
    },
    updateDashboard: {
      [PlanIdEnum.strategic]: 'Priorities have been updated successfully',
      [PlanIdEnum.executive]: 'Objectives have been updated successfully',
      [PlanIdEnum.kpi]: 'Pillars have been updated successfully'
    }
  }
}
