import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Login() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login')
  const [scrollDone, setScrollDone] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  // 스크롤 끝까지 읽었는지 감지 (원래 로직 그대로)
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setScrollDone(true)
    }
  }

  useEffect(() => {
    setScrollDone(false)
    setAgreed(false)
  }, [tab])

  // 엔터 키 처리를 위한 로그인 함수
  const handleLoginSubmit = (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    // 실제 서비스 시 여기서 아이디/비번 검증 로직 추가
    navigate('/home');
  };

  // 엔터 키 처리를 위한 회원가입 함수
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return; // 동의 안 했으면 실행 안 됨
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#FAF8F5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: '#F0EBE3', borderRadius: '20px',
        border: '1px solid #DDD5C8', padding: '2.5rem',
        width: '100%', maxWidth: '420px' // 가독성을 위해 maxWidth 살짝 고정
      }}>
        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7C9E87' }}>Re:balance</span>
        </div>

        {/* 탭 */}
        <div style={{
          display: 'flex', background: '#FAF8F5',
          borderRadius: '10px', padding: '4px', marginBottom: '2rem'
        }}>
          {['login', 'signup'].map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{
              flex: 1, padding: '0.6rem',
              background: tab === t ? '#7C9E87' : 'transparent',
              color: tab === t ? '#FAF8F5' : '#8C7B6E',
              border: 'none', borderRadius: '8px',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              {t === 'login' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
            /* --- 로그인 폼 (form 태그로 엔터 지원) --- */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input placeholder="아이디" type="text" style={inputStyle} required />
                <input placeholder="비밀번호" type="password" style={inputStyle} required />
                <button type="submit" style={primaryBtn}>
                로그인
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#DDD5C8' }} />
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>또는</span>
                  <div style={{ flex: 1, height: '1px', background: '#DDD5C8' }} />
                </div>

                <button type="button" style={googleBtnStyle}>
                  <GoogleIcon /> Google로 계속하기
                </button>
                <button type="button" style={kakaoBtnStyle}>
                  <KakaoIcon /> 카카오로 계속하기
                </button>
            </form>
            )  : (
          /* --- 회원가입 폼 (기존 스크롤 로직 유지) --- */
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input placeholder="이름" style={inputStyle} required />
            <input placeholder="아이디" type="text" style={inputStyle} required />
            <input placeholder="비밀번호" type="password" style={inputStyle} required />
            <input placeholder="비밀번호 확인" type="password" style={inputStyle} required />
            <input placeholder="이메일" type="email" style={inputStyle} required />

            {/* 개인정보 동의 - 스크롤 필독 (기존 유지) */}
            <div>
              <p style={{ fontSize: '0.85rem', color: '#8C7B6E', marginBottom: '0.5rem' }}>
                개인정보 처리방침 <span style={{ color: '#f87171' }}>(끝까지 읽어야 동의 가능)</span>
              </p>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{
                  height: '160px', overflowY: 'scroll',
                  background: '#FAF8F5', borderRadius: '10px',
                  border: '1px solid #DDD5C8', padding: '1rem',
                  fontSize: '0.82rem', lineHeight: 1.8, color: '#8C7B6E'
                }}
              >
                <strong style={{ color: '#2D2520' }}>개인정보 수집 및 이용 동의</strong>
                <br /><br />
                Re:balance는 거북목 예방 및 자세 교정 서비스를 제공하기 위해 다음과 같이 개인정보를 수집·이용합니다.
                <br /><br />
                <strong style={{ color: '#2D2520' }}>1. 영상 처리 방식</strong><br />
                본 서비스는 자세 분석을 위해 카메라를 사용합니다. 촬영된 영상은 서버에 저장되지 않으며, 자세 분석에 필요한 신체 좌표값(키포인트)만 추출하여 저장합니다. 원본 영상은 분석 즉시 삭제됩니다.
                <br /><br />
                <strong style={{ color: '#2D2520' }}>2. 수집 항목</strong><br />
                - 신체 좌표값 (목, 어깨, 척추 등 주요 관절 위치)<br />
                - 자세 측정 시각 및 측정 횟수<br />
                - 스트레칭 달성 기록
                <br /><br />
                <strong style={{ color: '#2D2520' }}>3. 보유 및 이용 기간</strong><br />
                회원 탈퇴 시 즉시 삭제됩니다.
                <br /><br />
                위 내용을 모두 확인하였습니다.
              </div>

              {/* 체크박스 */}
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: '0.75rem', cursor: scrollDone ? 'pointer' : 'not-allowed',
                opacity: scrollDone ? 1 : 0.4, fontSize: '0.9rem', color: '#2D2520'
              }}>
                <input
                  type="checkbox"
                  disabled={!scrollDone}
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                개인정보 수집 및 이용에 동의합니다
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreed}
              style={{
                ...primaryBtn,
                opacity: agreed ? 1 : 0.4,
                cursor: agreed ? 'pointer' : 'not-allowed'
              }}
            >
              회원가입 완료
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* --- 버튼 및 아이콘 스타일 (기존 유지) --- */
const googleBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
  background: '#ffffff', color: '#2D2520',
  border: '1px solid #e2e8f0', borderRadius: '10px',
  padding: '0.75rem', fontSize: '0.9rem',
  fontWeight: 600, cursor: 'pointer', width: '100%'
}

const kakaoBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
  background: '#FEE500', color: '#191919',
  border: 'none', borderRadius: '10px',
  padding: '0.75rem', fontSize: '0.9rem',
  fontWeight: 600, cursor: 'pointer', width: '100%'
}

function GoogleIcon() { return <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>; }
function KakaoIcon() { return <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.6 5.1 4 6.6l-1 3.7 4.3-2.8c.9.2 1.8.3 2.7.3 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/></svg>; }

const inputStyle = {
  background: '#FAF8F5', border: '1px solid #DDD5C8',
  borderRadius: '10px', padding: '0.75rem 1rem',
  color: '#2D2520', fontSize: '0.95rem', outline: 'none',
  width: '100%', boxSizing: 'border-box'
}

const primaryBtn = {
  background: '#7C9E87', color: '#FAF8F5',
  border: 'none', borderRadius: '10px',
  padding: '0.85rem', fontSize: '1rem',
  fontWeight: 700, cursor: 'pointer', width: '100%'
}

export default Login