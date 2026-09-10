import type en from './en';

const ar: { [Key in keyof typeof en]: string } = {
  loading: 'جار التحميل',
  cancel: 'إلغاء',
  save: 'حفظ',
  continue: 'متابعة',
  back: 'رجوع',
  done: 'تم',
  error: 'حدث خطأ ما',
  languages: 'اللغات',
};

export default ar;