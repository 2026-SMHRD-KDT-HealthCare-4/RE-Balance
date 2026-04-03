import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', color: '#2D2520' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 1.25rem',
        gap: '1.5rem'
      }}>
        <span style={{
          background: '#F0EBE3', border: '1px solid #DDD5C8',
          borderRadius: '999px', padding: '0.4rem 1rem',
          fontSize: '0.85rem', color: '#7C9E87'
        }}>
          거북목 예방 & 자세 교정 솔루션
        </span>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 800, lineHeight: 1.1,
          margin: 0, letterSpacing: '-2px'
        }}>
          당신의 목,<br />
          <span style={{ color: '#7C9E87' }}>균형을 되찾을 시간</span>
        </h1>

        <p style={{
          fontSize: '1.1rem', color: '#8C7B6E',
          maxWidth: '520px', lineHeight: 1.8, margin: 0
        }}>
          AI가 실시간으로 자세를 분석하고, 스트레칭을 안내합니다. <br />
          하루 한 번, 목 나이를 되돌리세요.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login?tab=signup')}
            style={{
              background: '#7C9E87', color: '#FAF8F5',
              border: 'none', borderRadius: '12px',
              padding: '0.9rem 2rem', fontSize: '1rem',
              fontWeight: 700, cursor: 'pointer'
            }}
          >
            무료로 시작하기 →
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent', color: '#2D2520',
              border: '1px solid #DDD5C8', borderRadius: '12px',
              padding: '0.9rem 2rem', fontSize: '1rem',
              fontWeight: 500, cursor: 'pointer'
            }}
          >
            로그인
          </button>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '3rem' }}>
          Re:balance가 하는 일
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: '#F0EBE3', borderRadius: '16px',
              padding: '1.75rem', border: '1px solid #DDD5C8'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.05rem' }}>{f.title}</h3>
              <p style={{ color: '#8C7B6E', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const features = [
  { icon: '📷', title: '자동 자세 감지', desc: '1시간마다 자동으로 자세를 분석해 목 상태를 기록합니다.' },
  { icon: '🧘', title: '스트레칭 가이드', desc: '2시간마다 맞춤 스트레칭을 추천하고 정확도를 확인합니다.' },
  { icon: '📊', title: '대시보드 기록', desc: '일별·월별 달력으로 운동 달성률과 변화를 한눈에 확인하세요.' },
  { icon: '🔒', title: '프라이버시 보호', desc: '영상은 즉시 삭제되고 좌표값만 저장됩니다.' },
]

export default Landing