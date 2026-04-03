import { useNavigate } from 'react-router-dom'

const greetings = [
  '안녕하세요! 오늘도 바른 자세로 시작해봐요 😊',
  '좋은 하루 되세요! 목 건강 챙기는 거 잊지 마요 💪',
  '오늘도 화이팅! 스트레칭 잊지 말아요 🧘',
  '반가워요! 오늘 자세는 어떤가요? 👀',
  '오늘도 열심히! 목이 고마워할 거예요 🐢',
]

const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
const STATUS = 'caution'

const statusConfig = {
  good: { label: '좋음', color: '#22c55e', bgColor: '#052e16', cva: 52, neckAge: 22, desc: '자세가 매우 좋아요!' },
  caution: { label: '주의', color: '#f59e0b', bgColor: '#2d1a00', cva: 38, neckAge: 35, desc: '자세에 조금 신경 써보세요' },
  danger: { label: '위험', color: '#ef4444', bgColor: '#2d0a0a', cva: 22, neckAge: 52, desc: '지금 바로 스트레칭 해주세요!' },
}

function Character({ status }) {
  const cfg = statusConfig[status]
  const faces = {
    good: (
      <>
        <path d="M14 20 Q16 17 18 20" stroke={cfg.color} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M26 20 Q28 17 30 20" stroke={cfg.color} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M16 28 Q22 34 28 28" stroke={cfg.color} strokeWidth="2" fill="none" strokeLinecap="round"/>
      </>
    ),
    caution: (
      <>
        <line x1="14" y1="20" x2="18" y2="20" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="26" y1="20" x2="30" y2="20" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="17" y1="30" x2="27" y2="30" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"/>
      </>
    ),
    danger: (
      <>
        <path d="M13 18 L17 22 M17 18 L13 22" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M25 18 L29 22 M29 18 L25 22" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 32 Q22 27 28 32" stroke={cfg.color} strokeWidth="2" fill="none" strokeLinecap="round"/>
      </>
    ),
  }
  const neckAngles = { good: 0, caution: -12, danger: -25 }
  const angle = neckAngles[status]

  return (
    <svg width="160" height="220" viewBox="0 0 44 80" style={{ filter: `drop-shadow(0 0 20px ${cfg.color}44)` }}>
      <rect x="12" y="52" width="20" height="22" rx="4" fill="#DDD5C8"/>
      <g transform={`rotate(${angle}, 22, 52)`}>
        <rect x="19" y="42" width="6" height="14" rx="3" fill="#475569"/>
      </g>
      <g transform={`translate(${angle * 0.3}, 0)`}>
        <circle cx="22" cy="32" r="14" fill="#F0EBE3" stroke={cfg.color} strokeWidth="1.5"/>
        {faces[status]}
      </g>
      <circle cx="22" cy="32" r="16" fill="none" stroke={cfg.color} strokeWidth="0.5" opacity="0.4"/>
    </svg>
  )
}

function DonutChart({ done, total, color }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const progress = (done / total) * circ
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#F0EBE3" strokeWidth="10"/>
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${progress} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 40 40)" style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="40" y="44" textAnchor="middle" fill="#2D2520" fontSize="14" fontWeight="700">
        {done}/{total}
      </text>
    </svg>
  )
}

function CVABar({ value, color }) {
  const pct = Math.min(Math.max(value, 0), 60)
  const barWidth = (pct / 60) * 100
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.75rem', color: '#8C7B6E' }}>CVA 각도</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{value}°</span>
      </div>
      <div style={{ background: '#FAF8F5', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
        <div style={{ width: `${barWidth}%`, height: '100%', background: color, borderRadius: '999px', transition: 'width 0.8s ease' }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '0.7rem', color: '#475569' }}>0° 위험</span>
        <span style={{ fontSize: '0.7rem', color: '#475569' }}>60° 정상</span>
      </div>
    </div>
  )
}

export default function MyPage() {
  const navigate = useNavigate()
  const cfg = statusConfig[STATUS]
  const stretchingDone = 2
  const stretchingTotal = 4

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', color: '#2D2520', paddingBottom: '5rem' }}>

      {/* 상단 헤더 */}
      <div style={{
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #F0EBE3'
      }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7C9E87' }}>Re:balance</span>
        <span style={{
          background: cfg.bgColor, color: cfg.color,
          border: `1px solid ${cfg.color}44`,
          borderRadius: '999px', padding: '0.3rem 0.8rem',
          fontSize: '0.75rem', fontWeight: 700
        }}>
          {cfg.label}
        </span>
      </div>

      {/* 캐릭터 영역 */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', paddingTop: '2rem', gap: '1rem',
      }}>

        {/* 인사말 */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '2rem', color: '#8C7B6E' }}>{randomGreeting}</span>
        </div>

        {/* 말풍선 두 개 가로 배치 */}
        <div style={{
        display: 'flex', gap: '1rem',
        width: '90%', maxWidth: '400px',
        justifyContent: 'space-between'
        }}>

        {/* 말풍선 1 - 목나이 (왼쪽) */}
        <div style={{
            background: '#F0EBE3', border: `1px solid ${cfg.color}66`,
            borderRadius: '16px', padding: '0.6rem 1rem',
            position: 'relative', animation: 'float 3s ease-in-out infinite',
            boxShadow: `0 0 20px ${cfg.color}22`, textAlign: 'center', flex: 1
        }}>
            <div style={{ fontSize: '0.75rem', color: '#8C7B6E' }}>오늘의 목 나이</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: cfg.color }}>{cfg.neckAge}살</div>
            <div style={{
            position: 'absolute', bottom: '-8px', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `8px solid ${cfg.color}66`,
            }}/>
        </div>

        {/* 말풍선 2 - 스트레칭 (오른쪽) */}
        <div style={{
            background: '#F0EBE3', border: `1px solid ${cfg.color}66`,
            borderRadius: '16px', padding: '0.6rem 1rem',
            position: 'relative', animation: 'float 3.5s ease-in-out infinite',
            boxShadow: `0 0 20px ${cfg.color}22`, textAlign: 'center', flex: 1
        }}>
            <div style={{ fontSize: '0.75rem', color: '#8C7B6E' }}>오늘의 스트레칭</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: cfg.color }}>{stretchingDone}/{stretchingTotal}회</div>
            <div style={{
            position: 'absolute', bottom: '-8px', left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `8px solid ${cfg.color}66`,
            }}/>
        </div>

        </div>
        {/* 캐릭터 */}
        <Character status={STATUS} />

        {/* CVA 카드 */}
        <div style={{
          width: '90%', maxWidth: '400px',
          background: '#F0EBE3', borderRadius: '16px',
          border: '1px solid #DDD5C8', padding: '1.25rem',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#8C7B6E', marginBottom: '1rem' }}>
            📐 출근 후 
            
            
            측정값
          </div>
          <CVABar value={cfg.cva} color={cfg.color} />
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#A89890', textAlign: 'center' }}>
            CVA 정상 범위: 50° 이상
          </div>
        </div>

      </div>

      {/* 하단 버튼 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: '520px',
        background: '#FAF8F5', borderTop: '1px solid #F0EBE3',
        padding: '1rem 1.5rem',
        display: 'flex', gap: '0.75rem'
      }}>
        <button style={{
          flex: 1, background: '#7C9E87', color: '#FAF8F5',
          border: 'none', borderRadius: '12px',
          padding: '0.85rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer'
        }}>
          📷 거북목 측정하기
        </button>
        <button onClick={() => navigate('/dashboard')} style={{
          flex: 1, background: '#F0EBE3', color: '#2D2520',
          border: '1px solid #DDD5C8', borderRadius: '12px',
          padding: '0.85rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'
        }}>
          📊 대시보드
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}