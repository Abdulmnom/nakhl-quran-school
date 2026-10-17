import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Briefcase, ConciergeBell, DoorOpen, Droplets, Landmark, Library, Minus, Plus, RotateCcw,
  School, SquareParking, Sun, TreePalm, Trophy, type LucideIcon,
} from 'lucide-react'
import { facilities, type Facility, type FacilityKind } from '../data/facilities'

export const facilityIcons: Record<FacilityKind, LucideIcon> = {
  entrance: DoorOpen,
  reception: ConciergeBell,
  classes: School,
  library: Library,
  admin: Briefcase,
  prayer: Landmark,
  wudu: Droplets,
  courtyard: Sun,
  activities: Trophy,
  garden: TreePalm,
  parking: SquareParking,
}

const VW = 1000
const VH = 760
const MIN = 1
const MAX = 3

type View = { s: number; x: number; y: number }

const clampView = ({ s, x, y }: View): View => {
  const cs = Math.min(MAX, Math.max(MIN, s))
  return {
    s: cs,
    x: Math.min(0, Math.max(VW - VW * cs, x)),
    y: Math.min(0, Math.max(VH - VH * cs, y)),
  }
}

/* ------------------------------------------------------------------ */
/* عناصر الرسم                                                         */
/* ------------------------------------------------------------------ */

const C = {
  outside: '#E6D7B5',
  ground: '#F1E7D0',
  wall: '#D2B98A',
  wallTop: '#E4CFA4',
  building: '#F6EBD3',
  roof: '#E9D5AC',
  roofEdge: '#C9A96E',
  green: '#1F5A45',
  gold: '#C9A24A',
  path: '#FAF4E6',
  tile: '#E8DCC0',
  grass: '#B9D3A0',
  grassDark: '#8DB57A',
  water: '#9CCBE0',
  ink: '#10322A',
}

function Palm({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  const fronds = Array.from({ length: 7 }, (_, i) => (i * 360) / 7)
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={4} cy={6} rx={r * 0.9} ry={r * 0.5} fill="rgba(60,40,10,0.15)" />
      {fronds.map((a) => (
        <path
          key={a}
          d={`M0 0 Q ${r * 0.5} ${-r * 0.35} ${r} 0 Q ${r * 0.5} ${r * 0.2} 0 0`}
          fill={a % 2 ? '#3E8A5A' : '#2F7349'}
          transform={`rotate(${a})`}
        />
      ))}
      <circle r={r * 0.18} fill="#8A6A3E" />
    </g>
  )
}

function Building({
  x, y, w, h, active, children,
}: { x: number; y: number; w: number; h: number; active: boolean; children?: ReactNode }) {
  return (
    <g>
      <rect x={x + 7} y={y + 9} width={w} height={h} rx={6} fill="rgba(70,50,20,0.16)" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill={C.roof}
        stroke={active ? C.gold : C.roofEdge}
        strokeWidth={active ? 5 : 2}
        style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
      />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx={3} fill={C.building} />
      {children}
    </g>
  )
}

function Label({ x, y, text, show }: { x: number; y: number; text: string; show: boolean }) {
  if (!show) return null
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={17}
      fontWeight={700}
      fill={C.ink}
      fontFamily="IBM Plex Sans Arabic, sans-serif"
      style={{ paintOrder: 'stroke', stroke: 'rgba(255,250,240,0.9)', strokeWidth: 4, pointerEvents: 'none' }}
    >
      {text}
    </text>
  )
}

/* ------------------------------------------------------------------ */

type Props = {
  selected: FacilityKind | null
  onSelect: (id: FacilityKind) => void
}

export default function SchoolMap({ selected, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [width, setWidth] = useState(800)
  const moved = useRef(0)
  const widthRef = useRef(800)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      widthRef.current = e.contentRect.width
      setWidth(e.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // تقريب الخريطة على المرفق المختار في الشاشات الصغيرة
  const firstFocus = useRef(true)
  useEffect(() => {
    if (!selected) return
    if (firstFocus.current) {
      firstFocus.current = false
      return
    }
    const f = facilities.find((x) => x.id === selected)
    if (!f) return
    setView((v) => {
      const s = widthRef.current < 640 ? Math.max(v.s, 1.8) : v.s
      if (s === 1) return v
      return clampView({ s, x: VW / 2 - s * f.pin.x, y: VH / 2 - s * f.pin.y })
    })
  }, [selected])

  const zoom = (factor: number) =>
    setView((v) => {
      const s = Math.min(MAX, Math.max(MIN, v.s * factor))
      // تقريب حول مركز العرض
      const cx = (VW / 2 - v.x) / v.s
      const cy = (VH / 2 - v.y) / v.s
      return clampView({ s, x: VW / 2 - s * cx, y: VH / 2 - s * cy })
    })

  const onPointerDown = (e: React.PointerEvent) => {
    if (view.s <= 1 || e.button !== 0) return
    const rect = svgRef.current!.getBoundingClientRect()
    const k = VW / rect.width
    const start = { cx: e.clientX, cy: e.clientY, x: view.x, y: view.y }
    moved.current = 0
    setDragging(true)
    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - start.cx) * k
      const dy = (ev.clientY - start.cy) * k
      moved.current = Math.hypot(dx, dy)
      setView((v) => clampView({ s: v.s, x: start.x + dx, y: start.y + dy }))
    }
    const up = () => {
      setDragging(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const pick = (id: FacilityKind) => {
    if (moved.current > 6) return
    onSelect(id)
  }

  const showLabels = (width / VW) * view.s >= 0.62
  const k = (width / VW) * view.s
  const pinScale = Math.max(0.6, Math.min(1.5, (width < 640 ? 44 : 56) / (60 * k)))
  const is = (id: FacilityKind) => selected === id

  const area = (id: FacilityKind, el: ReactNode) => (
    <g
      key={id}
      onClick={() => pick(id)}
      className="cursor-pointer"
      role="button"
      aria-label={facilities.find((f) => f.id === id)?.name}
    >
      {el}
    </g>
  )

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-3xl border border-sand-200 bg-[#E6D7B5] shadow-lg shadow-brand-900/10">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className={`block h-auto w-full select-none ${view.s > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
        style={{ touchAction: view.s > 1 ? 'none' : 'pan-y' }}
        onPointerDown={onPointerDown}
        role="img"
        aria-label="خريطة مدرسة نخل للقرآن الكريم"
      >
        <defs>
          <pattern id="tiles" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="28" height="28" fill={C.tile} />
            <path d="M14 2 L26 14 L14 26 L2 14 Z" fill="none" stroke="#D9C8A2" strokeWidth="1.5" />
          </pattern>
          <pattern id="parking" width="44" height="80" patternUnits="userSpaceOnUse">
            <rect width="44" height="80" fill="#CFC6B4" />
            <line x1="0" y1="0" x2="0" y2="62" stroke="#fff" strokeWidth="3" />
          </pattern>
          <pattern id="sand" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={C.outside} />
            <circle cx="8" cy="12" r="1.3" fill="#D6C399" />
            <circle cx="28" cy="30" r="1.1" fill="#D6C399" />
          </pattern>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#10322A" floodOpacity="0.35" />
          </filter>
        </defs>

        <g
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
            transformOrigin: '0 0',
            transition: dragging ? 'none' : 'transform 0.45s cubic-bezier(.2,.8,.2,1)',
          }}
        >
          {/* الأرض الخارجية */}
          <rect width={VW} height={VH} fill="url(#sand)" />
          {/* الطريق */}
          <rect x={0} y={748} width={VW} height={12} fill="#BDB3A1" />

          {/* موقف السيارات */}
          {area(
            'parking',
            <g>
              <rect x={110} y={664} width={370} height={80} rx={8} fill="url(#parking)" stroke={is('parking') ? C.gold : '#B9AE98'} strokeWidth={is('parking') ? 5 : 2} />
              {[0, 2, 3, 6].map((i) => (
                <rect key={i} x={118 + i * 44} y={672} width={28} height={50} rx={7} fill={['#2F6E8F', '#E7E2D6', '#8E3B3B', '#5B5B5B'][i % 4]} />
              ))}
              <Label x={380} y={712} text="موقف السيارات" show={showLabels} />
            </g>,
          )}
          {/* ممر من الموقف */}
          <rect x={480} y={640} width={40} height={108} fill={C.path} />
          <rect x={520} y={680} width={300} height={22} fill={C.path} opacity={0.6} />

          {/* السور */}
          <rect x={60} y={60} width={880} height={580} rx={20} fill={C.ground} />
          <rect x={60} y={60} width={880} height={580} rx={20} fill="none" stroke={C.wall} strokeWidth={14} />
          <rect x={60} y={60} width={880} height={580} rx={20} fill="none" stroke={C.wallTop} strokeWidth={4} strokeDasharray="14 10" />

          {/* الممرات الداخلية */}
          <g fill={C.path}>
            <rect x={482} y={515} width={36} height={130} />
            <rect x={285} y={260} width={30} height={60} />
            <rect x={300} y={395} width={45} height={30} />
            <rect x={655} y={345} width={50} height={30} />
            <rect x={655} y={505} width={50} height={26} />
            <rect x={665} y={230} width={30} height={75} />
            <rect x={830} y={230} width={26} height={60} />
            <rect x={150} y={480} width={30} height={45} />
            <rect x={518} y={572} width={55} height={26} />
          </g>

          {/* الساحة */}
          {area(
            'courtyard',
            <g>
              <rect x={340} y={300} width={320} height={220} rx={14} fill="url(#tiles)" stroke={is('courtyard') ? C.gold : '#D3C094'} strokeWidth={is('courtyard') ? 5 : 2} />
              <polygon points="500,368 530,380 542,410 530,440 500,452 470,440 458,410 470,380" fill="#E0CDA4" stroke="#C9A96E" strokeWidth={2} />
              <circle cx={500} cy={410} r={26} fill={C.water} />
              <circle cx={500} cy={410} r={8} fill="#E8F5FA" />
              {[370, 630].map((x) => (
                <g key={x}>
                  <rect x={x - 14} y={322} width={28} height={10} rx={3} fill="#A98A5C" />
                  <rect x={x - 14} y={488} width={28} height={10} rx={3} fill="#A98A5C" />
                </g>
              ))}
              <Label x={430} y={505} text="الساحة" show={showLabels} />
            </g>,
          )}

          {/* الفصول الدراسية */}
          {area(
            'classes',
            <Building x={100} y={100} w={370} h={160} active={is('classes')}>
              {Array.from({ length: 6 }, (_, i) => (
                <rect key={i} x={116 + i * 58} y={116} width={50} height={60} rx={4} fill="#EEDDBB" stroke="#D6BF92" />
              ))}
              <rect x={116} y={186} width={338} height={16} rx={3} fill="#E3CFA6" />
              <Label x={285} y={238} text="الفصول الدراسية" show={showLabels} />
            </Building>,
          )}

          {/* المكتبة */}
          {area(
            'library',
            <Building x={590} y={100} w={180} h={130} active={is('library')}>
              {[0, 1, 2].map((i) => (
                <rect key={i} x={612} y={118 + i * 18} width={136} height={8} rx={2} fill="#B7834F" />
              ))}
              <Label x={680} y={208} text="المكتبة" show={showLabels} />
            </Building>,
          )}

          {/* الإدارة */}
          {area(
            'admin',
            <Building x={790} y={100} w={115} h={130} active={is('admin')}>
              <rect x={806} y={118} width={36} height={30} rx={3} fill="#EEDDBB" stroke="#D6BF92" />
              <rect x={852} y={118} width={36} height={30} rx={3} fill="#EEDDBB" stroke="#D6BF92" />
              <Label x={847} y={208} text="الإدارة" show={showLabels} />
            </Building>,
          )}

          {/* المصلى */}
          {area(
            'prayer',
            <Building x={100} y={310} w={200} h={170} active={is('prayer')}>
              <circle cx={200} cy={385} r={48} fill="#2A6B53" stroke={C.gold} strokeWidth={4} />
              <circle cx={200} cy={385} r={30} fill="#327C60" />
              <circle cx={200} cy={385} r={7} fill={C.gold} />
              <rect x={268} y={318} width={22} height={22} rx={11} fill={C.gold} />
              <Label x={200} y={462} text="المصلى" show={showLabels} />
            </Building>,
          )}

          {/* الوضوء */}
          {area(
            'wudu',
            <Building x={100} y={525} w={150} h={90} active={is('wudu')}>
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx={125 + i * 33} cy={552} r={8} fill={C.water} stroke="#7FB3CA" />
              ))}
              <Label x={175} y={598} text="الوضوء" show={showLabels} />
            </Building>,
          )}

          {/* قاعة الأنشطة */}
          {area(
            'activities',
            <Building x={705} y={290} w={200} h={150} active={is('activities')}>
              <rect x={725} y={308} width={160} height={30} rx={4} fill="#DCC69A" />
              {Array.from({ length: 4 }, (_, r) =>
                Array.from({ length: 6 }, (_, c) => (
                  <circle key={`${r}-${c}`} cx={740 + c * 26} cy={356 + r * 14} r={4} fill="#B89A66" />
                )),
              )}
              <Label x={805} y={428} text="قاعة الأنشطة" show={showLabels} />
            </Building>,
          )}

          {/* الحديقة */}
          {area(
            'garden',
            <g>
              <rect x={705} y={465} width={200} height={150} rx={16} fill={C.grass} stroke={is('garden') ? C.gold : C.grassDark} strokeWidth={is('garden') ? 5 : 2} />
              <path d="M720 600 C 760 540, 820 600, 890 480" stroke="#E8DCC0" strokeWidth={10} fill="none" strokeLinecap="round" />
              <Palm x={740} y={495} />
              <Palm x={870} y={585} />
              <Palm x={760} y={575} r={13} />
              <Palm x={880} y={500} r={13} />
              <Label x={815} y={548} text="الحديقة" show={showLabels} />
            </g>,
          )}

          {/* الاستقبال */}
          {area(
            'reception',
            <Building x={572} y={555} w={95} h={70} active={is('reception')}>
              <Label x={620} y={598} text="الاستقبال" show={showLabels} />
            </Building>,
          )}

          {/* البوابة */}
          {area(
            'entrance',
            <g>
              <rect x={466} y={624} width={68} height={32} fill={C.path} />
              <rect x={452} y={620} width={20} height={40} rx={4} fill={C.wall} stroke={is('entrance') ? C.gold : '#B89C66'} strokeWidth={is('entrance') ? 4 : 2} />
              <rect x={528} y={620} width={20} height={40} rx={4} fill={C.wall} stroke={is('entrance') ? C.gold : '#B89C66'} strokeWidth={is('entrance') ? 4 : 2} />
              <path d="M472 628 Q500 606 528 628" fill="none" stroke={C.green} strokeWidth={6} />
            </g>,
          )}

          {/* نخيل على امتداد السور */}
          {[
            [330, 90], [560, 88], [560, 270], [320, 560], [400, 590], [680, 260], [920, 260], [920, 440], [80, 290], [80, 500],
          ].map(([x, y]) => (
            <Palm key={`${x}-${y}`} x={x} y={y} r={14} />
          ))}
          {[[40, 700], [960, 700], [30, 120], [970, 140], [560, 720], [880, 715]].map(([x, y]) => (
            <Palm key={`o-${x}-${y}`} x={x} y={y} r={18} />
          ))}

          {/* أنت هنا */}
          <g transform="translate(500 724)">
            <circle r={16} fill="#3B82F6" opacity={0.2}>
              <animate attributeName="r" values="10;20;10" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r={8} fill="#3B82F6" stroke="#fff" strokeWidth={3} />
          </g>

          {/* الدبابيس */}
          {facilities.map((f) => (
            <Pin key={f.id} f={f} active={is(f.id)} scale={pinScale} onClick={() => pick(f.id)} />
          ))}
        </g>

        {/* البوصلة (ثابتة) */}
        <g transform="translate(948 52)" aria-hidden="true">
          <circle r={30} fill="rgba(255,255,255,0.92)" stroke="#D2B98A" strokeWidth={2} />
          <path d="M0 -20 L7 2 L0 -2 L-7 2 Z" fill="#B23B3B" />
          <path d="M0 20 L7 2 L0 6 L-7 2 Z" fill="#9AA5A0" />
          <text x={-44} y={6} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink} fontFamily="IBM Plex Sans Arabic, sans-serif">ش</text>
        </g>
      </svg>

      {/* أدوات التكبير */}
      <div className="absolute top-3 left-3 flex flex-col overflow-hidden rounded-xl border border-sand-200 bg-white/95 shadow-md">
        <button onClick={() => zoom(1.4)} disabled={view.s >= MAX} className="grid h-10 w-10 place-items-center text-brand-800 hover:bg-sand-50 disabled:opacity-35" aria-label="تكبير">
          <Plus className="h-5 w-5" />
        </button>
        <button onClick={() => zoom(1 / 1.4)} disabled={view.s <= MIN} className="grid h-10 w-10 place-items-center border-t border-sand-200 text-brand-800 hover:bg-sand-50 disabled:opacity-35" aria-label="تصغير">
          <Minus className="h-5 w-5" />
        </button>
        <button onClick={() => setView({ s: 1, x: 0, y: 0 })} disabled={view.s === 1} className="grid h-10 w-10 place-items-center border-t border-sand-200 text-brand-800 hover:bg-sand-50 disabled:opacity-35" aria-label="إعادة الضبط">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-brand-800 shadow">
        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
        أنت هنا
      </div>
    </div>
  )
}

function Pin({ f, active, scale, onClick }: { f: Facility; active: boolean; scale: number; onClick: () => void }) {
  const Icon = facilityIcons[f.id]
  const s = scale * (active ? 1.25 : 1)
  return (
    <g
      transform={`translate(${f.pin.x} ${f.pin.y}) scale(${s})`}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={f.name}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      style={{ transition: 'transform 0.25s' }}
    >
      {active && (
        <circle cy={0} r={14} fill={C.gold} opacity={0.35}>
          <animate attributeName="r" values="8;22;8" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      <path
        d="M0 0 C -6 -10 -20 -22 -20 -38 A 20 20 0 1 1 20 -38 C 20 -22 6 -10 0 0 Z"
        fill={active ? C.gold : C.green}
        stroke="#fff"
        strokeWidth={3}
        filter="url(#pinShadow)"
      />
      <circle cy={-38} r={14} fill="#fff" />
      <Icon x={-9} y={-47} width={18} height={18} color={active ? '#A88434' : C.green} strokeWidth={2.2} />
    </g>
  )
}
