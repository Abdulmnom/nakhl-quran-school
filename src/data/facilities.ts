// مرافق المدرسة كما تظهر على الخريطة التفاعلية.
// الإحداثيات (x, y) داخل لوحة الخريطة بمقاس 1000 × 760.

export type FacilityKind =
  | 'entrance' | 'reception' | 'classes' | 'library' | 'admin' | 'prayer'
  | 'wudu' | 'courtyard' | 'activities' | 'garden' | 'parking'

export type Facility = {
  id: FacilityKind
  name: string
  short: string
  description: string
  image: string
  pin: { x: number; y: number }
  features: string[]
}

export const facilities: Facility[] = [
  {
    id: 'entrance',
    name: 'المدخل الرئيسي',
    short: 'بوابة الدخول للطلاب والزوار',
    description: 'البوابة الرئيسية للمدرسة، تطل على موقف السيارات وتؤدي مباشرة إلى الاستقبال والساحة الداخلية.',
    image: 'entrance',
    pin: { x: 500, y: 640 },
    features: ['ممر مظلل', 'مدخل لذوي الهمم'],
  },
  {
    id: 'reception',
    name: 'الاستقبال',
    short: 'استقبال الزوار وأولياء الأمور',
    description: 'مكتب استقبال الزوار وأولياء الأمور، ويُعنى بالتسجيل والاستفسارات.',
    image: 'exterior-2',
    pin: { x: 610, y: 585 },
    features: ['التسجيل', 'الاستفسارات'],
  },
  {
    id: 'classes',
    name: 'الفصول الدراسية',
    short: 'فصول مجهزة للتعليم',
    description: 'مبنى الفصول الدراسية، يضم فصولاً مجهزة لحلقات التحفيظ والتجويد بمختلف المستويات.',
    image: 'classroom',
    pin: { x: 285, y: 180 },
    features: ['6 فصول', 'تكييف وإضاءة طبيعية', 'سبورات تعليمية'],
  },
  {
    id: 'library',
    name: 'المكتبة',
    short: 'مصاحف وكتب علوم القرآن',
    description: 'مكتبة تضم المصاحف وكتب التفسير والتجويد وعلوم القرآن، مع ركن للقراءة والمراجعة.',
    image: 'library',
    pin: { x: 680, y: 165 },
    features: ['ركن قراءة', 'مصاحف بأحجام مختلفة'],
  },
  {
    id: 'admin',
    name: 'الإدارة',
    short: 'مكاتب الإدارة والمعلمين',
    description: 'مكاتب إدارة المدرسة وغرفة المعلمين.',
    image: 'exterior-1',
    pin: { x: 840, y: 165 },
    features: ['مكتب المدير', 'غرفة المعلمين'],
  },
  {
    id: 'prayer',
    name: 'المصلى',
    short: 'مصلى الطلاب والحلقات',
    description: 'مصلى المدرسة، تُقام فيه الصلوات وبعض حلقات التلاوة الجماعية.',
    image: 'prayer-hall',
    pin: { x: 200, y: 400 },
    features: ['مفروش بالسجاد', 'محراب'],
  },
  {
    id: 'wudu',
    name: 'دورات المياه والوضوء',
    short: 'أماكن الوضوء',
    description: 'دورات المياه وأماكن الوضوء بجوار المصلى.',
    image: 'courtyard',
    pin: { x: 165, y: 560 },
    features: ['قسم للوضوء', 'دورات مياه'],
  },
  {
    id: 'courtyard',
    name: 'الساحة',
    short: 'الساحة الداخلية المفتوحة',
    description: 'ساحة مفتوحة تتوسط المدرسة، تُستخدم للطابور الصباحي والفعاليات والاحتفالات.',
    image: 'courtyard',
    pin: { x: 500, y: 410 },
    features: ['نافورة', 'مقاعد مظللة'],
  },
  {
    id: 'activities',
    name: 'قاعة الأنشطة',
    short: 'المسابقات والفعاليات',
    description: 'قاعة متعددة الاستخدامات للمسابقات القرآنية والدورات وحفلات التكريم.',
    image: 'halaqa',
    pin: { x: 800, y: 360 },
    features: ['منصة', 'جهاز عرض'],
  },
  {
    id: 'garden',
    name: 'الحديقة',
    short: 'مساحة خضراء بالنخيل',
    description: 'حديقة النخيل في الجزء الشرقي من المدرسة، مساحة هادئة للاستراحة.',
    image: 'garden',
    pin: { x: 800, y: 530 },
    features: ['أشجار نخيل', 'جلسات خارجية'],
  },
  {
    id: 'parking',
    name: 'موقف السيارات',
    short: 'موقف لأولياء الأمور والزوار',
    description: 'موقف سيارات أمام المدخل الرئيسي لأولياء الأمور والزوار.',
    image: 'hero',
    pin: { x: 230, y: 700 },
    features: ['موقف مظلل', 'منطقة إنزال الطلاب'],
  },
]
