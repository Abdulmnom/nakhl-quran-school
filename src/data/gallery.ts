export type GalleryCategory = 'designs' | 'access' | 'facilities' | 'activities'

export const galleryCategories: { id: 'all' | GalleryCategory; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'designs', label: 'التصاميم' },
  { id: 'access', label: 'الوصول' },
  { id: 'facilities', label: 'المرافق' },
  { id: 'activities', label: 'الأنشطة' },
]

export type GalleryItem = {
  id: string
  title: string
  category: GalleryCategory
  /** اسم الصورة داخل public/images بدون الامتداد — توجد نسختان: name.webp و name-sm.webp */
  image: string
}

// استبدل الصور داخل public/images بنفس الأسماء، أو أضف عناصر جديدة هنا.
export const gallery: GalleryItem[] = [
  { id: 'd1', title: 'تصور الواجهة الأمامية للمدرسة', category: 'designs', image: 'render-front' },
  { id: 'd2', title: 'منظر جوي للمدرسة والمبنى الوقفي', category: 'designs', image: 'render-aerial' },
  { id: 'd3', title: 'المبنى الوقفي: المحلات والشقق', category: 'designs', image: 'render-waqf' },
  { id: 'd4', title: 'بهو الاستقبال', category: 'designs', image: 'interior-lobby' },
  { id: 'd5', title: 'قاعة تعليم القرآن الكريم', category: 'designs', image: 'interior-classroom' },
  { id: 'd6', title: 'القاعة متعددة الأغراض', category: 'designs', image: 'interior-hall' },
  { id: 'd7', title: 'المكتب الإداري', category: 'designs', image: 'interior-office' },
  { id: 'd8', title: 'الممرات الداخلية', category: 'designs', image: 'interior-corridor' },
  { id: 'd9', title: 'مرافق الوضوء', category: 'designs', image: 'interior-wudu' },
  { id: 'g1', title: 'المبنى الرئيسي للمدرسة', category: 'access', image: 'hero' },
  { id: 'g2', title: 'البوابة الرئيسية', category: 'access', image: 'entrance' },
  { id: 'g3', title: 'الواجهة الجانبية', category: 'access', image: 'exterior-1' },
  { id: 'g4', title: 'الفصول الدراسية', category: 'facilities', image: 'classroom' },
  { id: 'g5', title: 'المكتبة', category: 'facilities', image: 'library' },
  { id: 'g6', title: 'المصلى', category: 'facilities', image: 'prayer-hall' },
  { id: 'g7', title: 'الساحة الداخلية', category: 'facilities', image: 'courtyard' },
  { id: 'g8', title: 'حلقة تحفيظ', category: 'activities', image: 'halaqa' },
  { id: 'g9', title: 'حلقة التجويد', category: 'activities', image: 'halaqa-2' },
  { id: 'g10', title: 'فصل المراجعة', category: 'activities', image: 'classroom-2' },
  { id: 'g11', title: 'الحديقة', category: 'access', image: 'garden' },
  { id: 'g12', title: 'مدخل المبنى', category: 'access', image: 'exterior-2' },
]

export const img = (name: string, size: 'sm' | 'lg' = 'lg') =>
  `/images/${name}${size === 'sm' ? '-sm' : ''}.webp`
