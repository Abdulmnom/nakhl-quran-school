// هندسة المخطط المعماري للمدرسة بالمتر، منقولة من مخططي الطابق الأرضي والأول المعتمدين.
// المحاور الأفقية 1–16 والرأسية A–O كما في المخطط؛ الأصل (0، 0) عند تقاطع المحور 1 مع المحور A.
// عرض المبنى 44 م وعمقه 48.7 م، والمدخل الرئيسي في الأسفل.

import type { FacilityKind, FloorId } from './facilities'

export const PLAN_W = 44
export const PLAN_H = 48.7

/** خطوط المحاور الأفقية (بالمتر) */
const X = { 1: 0, 2: 3, 3: 5.8, 4: 9.2, 5: 11.9, 6: 15.8, 8: 19.9, 9: 24.1, 11: 28.2, 12: 32.1, 13: 34.8, 14: 38.2, 15: 41.1, 16: 44 }
/** خطوط المحاور الرأسية (بالمتر) */
const Y = { A: 0, B: 3.9, C: 6.1, D: 7.8, E: 13, F: 18.2, G: 23.4, H: 28.6, I: 32.2, J: 33.4, K: 35.6, L: 38.3, N: 43.5, O: 48.7 }

export type RoomKind =
  | 'classroom' | 'hall' | 'office' | 'wet' | 'room' | 'circulation' | 'service'
  | 'outdoor' | 'roof' | 'entry' | 'food' | 'ramp' | 'stairs' | 'lift'

export type Room = {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
  kind: RoomKind
  label?: string
  facility?: FacilityKind
  vertical?: boolean
}

const r = (
  key: string, x1: number, y1: number, x2: number, y2: number,
  kind: RoomKind, label?: string, facility?: FacilityKind, vertical?: boolean,
): Room => ({ key, x1, y1, x2, y2, kind, label, facility, vertical })

/** الفصول الجانبية — أرقامها كما في المخطط */
const sideClasses = (): Room[] => {
  const rows = [Y.D, Y.E, Y.F, Y.G, Y.H]
  const out: Room[] = []
  for (let i = 0; i < 4; i++) {
    out.push(r(`c${10 - i}`, X[1], rows[i], X[4], rows[i + 1], 'classroom', `فصل ${10 - i}`, 'classes'))
    out.push(r(`c${i + 1}`, X[13], rows[i], X[16], rows[i + 1], 'classroom', `فصل ${i + 1}`, 'classes'))
  }
  return out
}

/** الأجزاء المشتركة بين الطابقين */
const common = (): Room[] => [
  // الممرات (تُرسم أولاً لتكون خلفية)
  r('pass-top-l', X[3], Y.C, X[5], Y.D, 'circulation'),
  r('pass-top-r', X[12], Y.C, X[14], Y.D, 'circulation'),
  r('pass-l', X[4], Y.C, X[5], Y.L, 'circulation', 'ممر', undefined, true),
  r('pass-r', X[12], Y.C, X[13], Y.L, 'circulation', 'ممر', undefined, true),
  r('pass-b', X[4], 35.4, X[13], Y.L, 'circulation', 'ممر'),
  r('block-l', X[2], Y.H, X[4], Y.L, 'circulation'),
  r('block-r', X[13], Y.H, X[15], Y.L, 'circulation'),

  // الغرف الركنية
  r('room-l', X[1], Y.A, X[3], Y.D, 'room', 'غرفة', 'rooms'),
  r('room-r', X[14], Y.A, X[16], Y.D, 'room', 'غرفة', 'rooms'),

  // دورات المياه والمواضئ
  r('wc-l', X[3], Y.A, X[6], Y.B, 'wet', 'دورات المياه', 'wudu'),
  r('abl-l1', X[3], Y.B, 10.4, Y.C, 'wet', 'مواضئ', 'wudu'),
  r('abl-l2', 11.4, Y.B, X[6], Y.C, 'wet', 'مواضئ', 'wudu'),
  r('wc-r', X[11], Y.A, X[14], Y.B, 'wet', 'دورات المياه', 'wudu'),
  r('abl-r1', X[11], Y.B, 32.6, Y.C, 'wet', 'مواضئ', 'wudu'),
  r('abl-r2', 33.6, Y.B, X[14], Y.C, 'wet', 'مواضئ', 'wudu'),

  ...sideClasses(),

  // كتلة الخدمات اليسرى
  r('pantry-l', X[2], Y.H, 6.4, Y.I, 'service', 'مطبخ', 'services'),
  r('it-l', 6.4, Y.H, X[4], 30.8, 'service', 'تقنية', 'services'),
  r('wcs-l', X[2], Y.I, 5, Y.K, 'wet', 'د.م', 'wudu'),
  r('wash-l', 5, Y.J, 6.6, Y.K, 'wet', 'مغاسل', 'wudu'),
  r('lift-l', 7.2, Y.J, X[4], Y.K, 'lift', 'مصعد', 'services'),
  r('stairs-l', X[2], Y.K, X[4], Y.L, 'stairs', 'درج', 'services'),

  // كتلة الخدمات اليمنى
  r('pantry-r', 37.6, Y.H, X[15], Y.I, 'service', 'مطبخ', 'services'),
  r('it-r', X[13], Y.H, 37.6, 30.8, 'service', 'تقنية', 'services'),
  r('wcs-r', 39.1, Y.I, X[15], Y.K, 'wet', 'د.م', 'wudu'),
  r('wash-r', 37.4, Y.J, 39, Y.K, 'wet', 'مغاسل', 'wudu'),
  r('lift-r', X[13], Y.J, 36.8, Y.K, 'lift', 'مصعد', 'services'),
  r('stairs-r', X[13], Y.K, X[15], Y.L, 'stairs', 'درج', 'services'),

  // الواجهة الأمامية
  r('c6', 5.6, Y.L, 14.7, Y.N, 'classroom', 'فصل 6', 'classes'),
  r('c5', 29.4, Y.L, 38.5, Y.N, 'classroom', 'فصل 5', 'classes'),
  r('off-l', 14.7, Y.L, X[8], Y.N, 'office', 'مكتب', 'admin'),
]

export const floorPlans: Record<FloorId, Room[]> = {
  ground: [
    // الساحة الداخلية بين الجناحين (خلفية)
    r('court', X[5], Y.A, X[12], 17.3, 'outdoor', 'الساحة الداخلية', 'courtyard'),
    ...common(),
    r('studio', X[5], 14.1, 15.2, 17.3, 'food', 'استوديو', 'studio'),
    r('canteen', 28.8, 14.1, X[12], 17.3, 'food', 'مقصف', 'canteen'),
    r('hall', X[5], 17.3, X[12], 35.4, 'hall', 'القاعة متعددة الأغراض', 'hall'),
    r('lobby', X[8], Y.L, X[9], Y.N, 'entry', 'الردهة', 'entrance'),
    r('off-r', X[9], Y.L, 29.4, Y.N, 'office', 'مكتب', 'admin'),
    r('porch', X[8], Y.N, X[9], Y.O, 'entry', 'المدخل', 'entrance'),
    r('side-l', X[2], Y.L, 5.6, 40.8, 'entry', 'مدخل', 'entrance'),
    r('side-r', 38.5, Y.L, X[15], 40.8, 'entry', 'مدخل', 'entrance'),
    r('ramp-l', 1.4, 30.8, 2.8, 40.8, 'ramp', undefined, 'entrance'),
    r('ramp-r', 41.3, 30.8, 42.7, 40.8, 'ramp', undefined, 'entrance'),
  ],
  first: [
    r('roof', X[5], Y.C, X[12], 35.4, 'roof', 'سطح القاعة'),
    ...common(),
    r('off-big', X[8], Y.L, 29.4, Y.N, 'office', 'مكتب', 'admin'),
    r('side-l', X[2], Y.L, 5.6, 40.8, 'circulation'),
    r('side-r', 38.5, Y.L, X[15], 40.8, 'circulation'),
    r('dome-roof', X[8], Y.N, X[9], Y.O, 'roof'),
  ],
}

/** القبة فوق المدخل الرئيسي (تظهر في الطابق الأول) */
export const dome = { cx: (X[8] + X[9]) / 2, cy: (Y.N + Y.O) / 2, r: 2 }
