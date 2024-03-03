import { PlanIdEnum } from 'cubes-dashboard'

export default {
  strategicPlans: 'خطط إستراتيجية',
  strategicPlan: 'الخطة الإستراتيجية',
  strategicPriority: 'الأولويات الإستراتيجية',
  executivePlan: 'الخطة التنفيذية',
  governmentKpis: 'مؤشرات قياس الأداء الحكومية الموحدة',
  govCommonKpi: 'مؤشر قياس الأداء الحكومي الموحد',
  keyPerformanceIndicators: 'مؤشرات قياس الأداء',
  executiveObjectives: 'الأهداف التنفيذية',
  errors: {
    pageNotFound: 'الصفحة غير موجودة',
    requestError: 'حدث خطأ ما!'
  },
  emptyPiTable: {
    [PlanIdEnum.strategic]: 'لم يتم العثور على تفاصيل الخطة الإستراتيجية',
    [PlanIdEnum.executive]: 'لم يتم العثور على تفاصيل الخطة التنفيذية',
    [PlanIdEnum.kpi]: 'لم يتم العثور على تفاصيل مؤشرات قياس الأداء الحكومية الموحدة'
  },
  emptyChart: 'الجدول فارغ',
  back: 'عودة',
  action: 'الإجراء',
  viewDetails: 'مشاهدة التفاصيل',
  lastReportedValue: 'آخر قيمة تم الإبلاغ عنها',
  noObjectives: 'لم يتم العثور على اي اهداف',
  noKpis: 'لم يتم العثور على اي مؤشرات قياس اداء',
  noProjects: 'لم يتم العثور على اي مشاريع',
  dashboardOverview: 'نظرة عامة على واجهة قياس الأداء ',
  selectAll: 'إختيار الجميع',
  searchByName: 'البحث باستخدام الاسم',
  noResult: 'لا نتائج',
  add: 'إضافة',
  cancel: 'إلغاء',
  deleteAll: 'حذف الجميع',
  delete: 'حذف',
  accessDenied: 'غير مسموح بالدخول',
  noPermission: 'ليس لديك صلاحيات الدخول',
  notEntered: 'غير مدخل'
}
