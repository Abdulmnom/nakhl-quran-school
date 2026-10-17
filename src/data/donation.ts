// ⚠️ بيانات تجريبية — استبدلها بالبيانات البنكية الحقيقية قبل النشر.
// رمز QR يُولَّد تلقائياً من هذه البيانات.

export const donation = {
  isPlaceholder: true,
  headline: 'ساهم في دعم مدرسة نخل للقرآن الكريم',
  subline: 'صدقة جارية بإذن الله',
  accountName: 'مدرسة نخل للقرآن الكريم',
  bankName: 'اسم البنك',
  accountNumber: '0000 0000 0000',
  iban: 'OM00 0000 0000 0000 0000 000',
  swift: 'XXXXOMRX',
  /** رابط فتح تطبيق البنك أو صفحة التحويل (اتركه فارغاً لإخفاء الزر) */
  bankAppUrl: 'https://example.com',
  ways: [
    { title: 'صيانة المرافق', text: 'المساهمة في صيانة المبنى وتجهيز الفصول.' },
    { title: 'كفالة معلم', text: 'دعم المعلمين لاستمرار الحلقات.' },
    { title: 'مصاحف ووسائل', text: 'توفير المصاحف والوسائل التعليمية للطلاب.' },
  ],
}

export const qrPayload = () =>
  [
    `الحساب: ${donation.accountName}`,
    `البنك: ${donation.bankName}`,
    `رقم الحساب: ${donation.accountNumber}`,
    `IBAN: ${donation.iban.replace(/\s/g, '')}`,
  ].join('\n')
