import { Home, Images, MapPinned, HandHeart, type LucideIcon } from 'lucide-react'

export type NavItem = { to: string; label: string; icon: LucideIcon; desc: string }

export const navItems: NavItem[] = [
  { to: '/home', label: 'الرئيسية', icon: Home, desc: 'نظرة عامة على المدرسة' },
  { to: '/gallery', label: 'الصور', icon: Images, desc: 'استعرض صور المدرسة' },
  { to: '/map', label: 'الخريطة', icon: MapPinned, desc: 'تعرّف على مرافق المدرسة' },
  { to: '/donate', label: 'التبرع', icon: HandHeart, desc: 'ساهم في دعم المدرسة' },
]
