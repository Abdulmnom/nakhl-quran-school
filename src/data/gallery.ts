export type GalleryCategory = 'access' | 'facilities' | 'activities'

export const galleryCategories: { id: 'all' | GalleryCategory; label: string }[] = [
  { id: 'all', label: 'الكل' },
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
