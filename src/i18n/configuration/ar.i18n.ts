import { PlanIdEnum } from 'cubes-dashboard'

export default {
  configCard: {
    title: {
      [PlanIdEnum.strategic]: 'الخطة الإستراتيجية',
      [PlanIdEnum.executive]: 'الخطة التنفيذية',
      [PlanIdEnum.kpi]: 'مؤشرات  قياس الأداء الحكومية الموحدة'
    },
    subTitle: {
      [PlanIdEnum.strategic]: 'الأولويات المختارة',
      [PlanIdEnum.executive]: 'الأهداف المختارة',
      [PlanIdEnum.kpi]: 'الركائز المختارة'
    },
    name: {
      [PlanIdEnum.strategic]: 'الأولويات',
      [PlanIdEnum.executive]: 'الأهداف',
      [PlanIdEnum.kpi]: 'الركائز'
    },
    addContainer: {
      [PlanIdEnum.strategic]: 'إضافة أولويات',
      [PlanIdEnum.executive]: 'إضافة أهداف',
      [PlanIdEnum.kpi]: 'إضافة ركائز'
    },
    emptyContainer: {
      [PlanIdEnum.strategic]: 'لم يتم إضافة أولويات بعد',
      [PlanIdEnum.executive]: 'لم يتم إضافة أهداف بعد',
      [PlanIdEnum.kpi]: 'لم يتم إضافة ركائز بعد'
    }
  },
  folderBrowser: {
    title: {
      [PlanIdEnum.strategic]: 'إضافة أولويات الخطة الإستراتيجية',
      [PlanIdEnum.executive]: 'إضافة أهداف الخطة التنفيذية',
      [PlanIdEnum.kpi]: 'إضافة ركائز مؤشرات قياس الأداء الحكومية الموحدة'
    }
  },
  dashboardConfiguration: 'ضبط لوحة قياس الأداء',
  dashboardConfigurationDescription: ' قم بتخصيص ما تريد تضمينه في لوحة قياس الأداء لكل قسم',
  deleteAllBody: 'هل أنت متأكد أنك تريد حذف جميع العناصر في',
  add: 'إضافة',
  optional: 'إختياري',
  save: 'حفظ',
  edit: 'تعديل',
  discard: 'تخلي عن التعديلات',
  delete: 'حذف',
  cancel: 'إلغاء',
  deleteUnit: 'حذف الوحدة',
  confirmDeletion: 'تأكيد الحذف',
  search: 'ابحث في القائمة',
  browser: 'المتصفح',
  deleteAll: 'حذف الكل',
  notifications: {
    deleteAllDashboardItems: {
      [PlanIdEnum.strategic]: 'تم حذف جميع الأولويات بنجاح',
      [PlanIdEnum.executive]: 'تم حذف جميع الأهداف بنجاح',
      [PlanIdEnum.kpi]: 'تم حذف جميع الركائز بنجاح'
    },
    deletedDashboardItem: {
      [PlanIdEnum.strategic]: 'تم حذف الأولوية بنجاح',
      [PlanIdEnum.executive]: 'تم حذف الهدف بنجاح',
      [PlanIdEnum.kpi]: 'تم حذف الركيزة بنجاح'
    },
    addDashboardItem: {
      [PlanIdEnum.strategic]: (count: number) => `تم إضافة ${count} أولوية(أولويات) بنجاح`,
      [PlanIdEnum.executive]: (count: number) => `تم إضافة ${count} هدف(أهداف) بنجاح`,
      [PlanIdEnum.kpi]: (count: number) => `تم إضافة ${count} ركيزة(ركائز) بنجاح`
    },
    updateDashboard: {
      [PlanIdEnum.strategic]: 'تم تحديث الأولويات بنجاح',
      [PlanIdEnum.executive]: 'تم تحديث الأهداف بنجاح',
      [PlanIdEnum.kpi]: 'تم تحديث الركائز بنجاح'
    }
  }
}
