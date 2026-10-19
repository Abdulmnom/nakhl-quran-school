import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpDown, Briefcase, Coffee, DoorClosed, DoorOpen, Droplets, Mic, Minus, Plus, Presentation,
  RotateCcw, School, Sun, type LucideIcon,
} from 'lucide-react'
import { facilities, floors, type Facility, type FacilityKind, type FloorId } from '../data/facilities'
import { dome, floorPlans, PLAN_H, PLAN_W, type Room, type RoomKind } from '../data/floorplan'

export const facilityIcons: Record<FacilityKind, LucideIcon> = {
  entrance: DoorOpen,
  classes: School,
  hall: Presentation,
  admin: Briefcase,
  wudu: Droplets,
  rooms: DoorClosed,
  courtyard: Sun,
  canteen: Coffee,
  studio: Mic,
  services: ArrowUpDown,
}

/** وحدات الرسم لكل متر */
const S = 20
const OX = 40
const OY = 40
const FRONT = 7 // مساحة أمام المبنى بالمتر
const VW = PLAN_W * S + OX * 2
const VH = (PLAN_H + FRONT) * S + OY
const MIN = 1
const MAX = 4

const px = (m: number) => OX + m * S
const py = (m: number) => OY + m * S

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
/* ألوان وأنماط الرسم                                                   */
/* ------------------------------------------------------------------ */

const C = {
  outside: '#E6D7B5',
  wall: '#7D6A4F',
  green: '#1F5A45',
  gold: '#C9A24A',
  ink: '#10322A',
}

const fills: Record<RoomKind, string> = {
  classroom: '#E2EEE6',
  hall: '#F3E5C1',
  office: '#ECE2CF',
  wet: '#DAEBF3',
  room: '#EFE5D3',
  circulation: '#FBF8F1',
  service: '#E9E3D6',
  outdoor: 'url(#tiles)',
  roof: 'url(#roof)',
  entry: '#F6E8C8',
  food: '#F4DFC4',
  ramp: 'url(#ramp)',
  stairs: 'url(#stairs)',
  lift: '#DED7C8',
}

const thinWall = new Set<RoomKind>(['circulation', 'outdoor', 'ramp'])

function Palm({ x, y, r = 16 }: { x: number; y: number; r?: number }) {
  const fronds = Array.from({ length: 7 }, (_, i) => (i * 360) / 7)
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
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

function labelSize(room: Room) {
  if (room.kind === 'hall') return 26
  const w = (room.vertical ? room.y2 - room.y1 : room.x2 - room.x1) * S
  const h = (room.vertical ? room.x2 - room.x1 : room.y2 - room.y1) * S
  return Math.max(9, Math.min(16, h * 0.42, (w * 1.6) / Math.max(3, room.label!.length)))
}

/* ------------------------------------------------------------------ */

type Props = {
  floor: FloorId
  onFloorChange: (f: FloorId) => void
  selected: FacilityKind | null
  onSelect: (id: FacilityKind) => void
}

export default function SchoolMap({ floor, onFloorChange, selected, onSelect }: Props) {
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
    const pin = facilities.find((x) => x.id === selected)?.pins[floor]
    if (!pin) return
    setView((v) => {
      const s = widthRef.current < 640 ? Math.max(v.s, 2.2) : v.s
      if (s === 1) return v
      return clampView({ s, x: VW / 2 - s * px(pin.x), y: VH / 2 - s * py(pin.y) })
    })
  }, [selected, floor])

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

  const rooms = floorPlans[floor]
  const k = (width / VW) * view.s
  const pinScale = Math.max(0.55, Math.min(1.5, (width < 640 ? 40 : 52) / (60 * k)))
  const showLabel = (fs: number) => fs * k >= 8.5
  const solid = rooms.filter((rm) => rm.kind !== 'outdoor' && rm.kind !== 'ramp')

  return (
    <div ref={wrapRef} className="relative overflow-hidden rounded-3xl border border-sand-200 bg-[#E6D7B5] shadow-lg shadow-brand-900/10">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className={`block h-auto w-full select-none ${view.s > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
        style={{ touchAction: view.s > 1 ? 'none' : 'pan-y' }}
        onPointerDown={onPointerDown}
        role="img"
        aria-label={`مخطط ${floors.find((f) => f.id === floor)?.label} — مدرسة نخل الوقفية للقرآن الكريم`}
      >
        <defs>
          <pattern id="tiles" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="#EADFC6" />
            <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="none" stroke="#D9C8A2" strokeWidth="1.3" />
          </pattern>
          <pattern id="roof" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill="#E4DCCB" />
            <line x1="0" y1="0" x2="0" y2="14" stroke="#D3C8B0" strokeWidth="3" />
          </pattern>
          <pattern id="stairs" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#EFE9DD" />
            <line x1="0" y1="0" x2="0" y2="10" stroke="#B9AC92" strokeWidth="1.5" />
          </pattern>
          <pattern id="ramp" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#E9E1CF" />
            <path d="M0 10 L5 4 L10 10" fill="none" stroke="#B9AC92" strokeWidth="1.2" />
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
          {/* الأرض والساحة الأمامية */}
          <rect width={VW} height={VH} fill="url(#sand)" />
          <rect x={px(14)} y={py(PLAN_H) - 4} width={16 * S} height={FRONT * S + 4} fill="#EFE6D2" />
          <rect x={px(20.6)} y={py(PLAN_H) - 4} width={2.8 * S} height={FRONT * S + 4} fill="#FAF4E6" />
          {[1, 6, 34, 39.5, 43].map((x) => (
            <Palm key={`f-${x}`} x={px(x)} y={py(PLAN_H + 3.2)} r={16} />
          ))}
          {[8, 18, 28, 38].map((y) => (
            <g key={`s-${y}`}>
              <Palm x={px(-1.2)} y={py(y)} r={13} />
              <Palm x={px(PLAN_W + 1.2)} y={py(y)} r={13} />
            </g>
          ))}

          {/* ظل المبنى */}
          <g fill="rgba(70,50,20,0.16)" aria-hidden="true">
            {solid.map((rm) => (
              <rect key={`sh-${rm.key}`} x={px(rm.x1) + 6} y={py(rm.y1) + 8} width={(rm.x2 - rm.x1) * S} height={(rm.y2 - rm.y1) * S} />
            ))}
          </g>

          {/* الغرف */}
          {rooms.map((rm) => {
            const x = px(rm.x1)
            const y = py(rm.y1)
            const w = (rm.x2 - rm.x1) * S
            const h = (rm.y2 - rm.y1) * S
            const fac = rm.facility
            return (
              <rect
                key={rm.key}
                x={x}
                y={y}
                width={w}
                height={h}
                fill={fills[rm.kind]}
                stroke={thinWall.has(rm.kind) ? '#D8CCB2' : C.wall}
                strokeWidth={thinWall.has(rm.kind) ? 1 : 3}
                className={fac ? 'cursor-pointer' : undefined}
                onClick={fac ? () => pick(fac) : undefined}
              />
            )
          })}

          {/* القبة فوق المدخل */}
          {floor === 'first' && (
            <g onClick={() => pick('entrance')} className="cursor-pointer">
              <circle cx={px(dome.cx)} cy={py(dome.cy)} r={dome.r * S} fill="#FBF6EA" stroke={C.wall} strokeWidth={3} />
              {Array.from({ length: 12 }, (_, i) => (
                <line
                  key={i}
                  x1={px(dome.cx)}
                  y1={py(dome.cy)}
                  x2={px(dome.cx) + Math.cos((i * Math.PI) / 6) * dome.r * S}
                  y2={py(dome.cy) + Math.sin((i * Math.PI) / 6) * dome.r * S}
                  stroke="#CDBE9F"
                  strokeWidth={1.2}
                />
              ))}
              <circle cx={px(dome.cx)} cy={py(dome.cy)} r={5} fill={C.gold} />
            </g>
          )}

          {/* تمييز المرفق المختار */}
          {selected && (
            <g pointerEvents="none">
              {rooms
                .filter((rm) => rm.facility === selected)
                .map((rm) => (
                  <rect
                    key={`hl-${rm.key}`}
                    x={px(rm.x1)}
                    y={py(rm.y1)}
                    width={(rm.x2 - rm.x1) * S}
                    height={(rm.y2 - rm.y1) * S}
                    fill="rgba(201,162,74,0.28)"
                    stroke={C.gold}
                    strokeWidth={5}
                  />
                ))}
            </g>
          )}

          {/* أسماء الغرف */}
          <g pointerEvents="none">
            {rooms.map((rm) => {
              if (!rm.label) return null
              const fs = labelSize(rm)
              if (!showLabel(fs)) return null
              const cx = px((rm.x1 + rm.x2) / 2)
              const cy = py((rm.y1 + rm.y2) / 2)
              return (
                <text
                  key={`t-${rm.key}`}
                  x={cx}
                  y={cy}
                  dy="0.35em"
                  textAnchor="middle"
                  fontSize={fs}
                  fontWeight={700}
                  fill={rm.kind === 'circulation' || rm.kind === 'roof' ? '#8A7B60' : C.ink}
                  fontFamily="IBM Plex Sans Arabic, sans-serif"
                  transform={rm.vertical ? `rotate(-90 ${cx} ${cy})` : undefined}
                  style={{ paintOrder: 'stroke', stroke: 'rgba(255,250,240,0.85)', strokeWidth: 3 }}
                >
                  {rm.label}
                </text>
              )
            })}
          </g>

          {/* أنت هنا */}
          {floor === 'ground' && (
            <g transform={`translate(${px(22)} ${py(PLAN_H + 4.2)})`}>
              <circle r={16} fill="#3B82F6" opacity={0.2}>
                <animate attributeName="r" values="10;20;10" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle r={8} fill="#3B82F6" stroke="#fff" strokeWidth={3} />
            </g>
          )}

          {/* الدبابيس */}
          {facilities.map((f) =>
            f.pins[floor] ? (
              <Pin key={f.id} f={f} at={f.pins[floor]!} active={selected === f.id} scale={pinScale} onClick={() => pick(f.id)} />
            ) : null,
          )}
        </g>
      </svg>

      {/* اختيار الطابق */}
      <div className="absolute bottom-3 left-3 flex overflow-hidden rounded-xl border border-sand-200 bg-white/95 p-1 shadow-md" role="tablist" aria-label="الطابق">
        {floors.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={floor === f.id}
            onClick={() => onFloorChange(f.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              floor === f.id ? 'bg-brand-700 text-white' : 'text-brand-800 hover:bg-sand-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

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

      {floor === 'ground' && (
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-800 shadow">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
          أنت هنا
        </div>
      )}
    </div>
  )
}

function Pin({
  f, at, active, scale, onClick,
}: { f: Facility; at: { x: number; y: number }; active: boolean; scale: number; onClick: () => void }) {
  const Icon = facilityIcons[f.id]
  const s = scale * (active ? 1.25 : 1)
  return (
    <g
      transform={`translate(${px(at.x)} ${py(at.y)}) scale(${s})`}
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
