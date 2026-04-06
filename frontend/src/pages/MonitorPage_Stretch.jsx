import React, { useState, useRef, useEffect } from 'react';
import { usePoseDetection } from '../hooks/usePoseDetection'; 
import StretchPage from './StretchPage';

const MonitorPage = () => {
  const videoRef = useRef(null);
  const [isStretchMode, setIsStretchMode] = useState(false);
  const detectCountRef = useRef(0); // 연속 감지 카운트

  // 1. 커스텀 훅을 통해 AI 포즈 감지 데이터 수신
  // 스트레칭 모드가 아닐 때만 감지를 활성화하도록 로직이 훅 내부에 있으면 더 좋지만,
  // 현재는 videoRef를 통해 제어합니다.
  const postureData = usePoseDetection(videoRef);

  useEffect(() => {
    // 스트레칭 모드일 때는 감지 로직을 수행하지 않음
    if (isStretchMode) return;

    // 거북목 감지 (예: 각도가 0~45도 사이일 때)
    if (postureData.angle > 0 && postureData.angle < 45) {
      detectCountRef.current += 1;
      
      // 연속으로 3번 이상 감지되어야 확실히 전환 (노이즈 방지)
      if (detectCountRef.current >= 3) {
        handleStartStretch();
      }
    } else {
      detectCountRef.current = 0; // 정상 자세면 카운트 초기화
    }
  }, [postureData.angle, isStretchMode]);

  // 스트레칭 모드 시작 시 카메라 정리
  const handleStartStretch = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop(); // 하드웨어 카메라 끄기
      });
      videoRef.current.srcObject = null; // 비디오 객체 연결 해제
    }
    setIsStretchMode(true);
  };

  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      backgroundColor: '#020617', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      
      {/* 1. 감시 모드 UI: 스트레칭 모드가 아닐 때만 표시 */}
      {!isStretchMode && (
        <div style={{ 
          position: 'relative', width: '90%', height: '90%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* 상단 상태 바 */}
          <div style={{ 
            position: 'absolute', top: '20px', left: '20px', 
            color: 'white', background: 'rgba(15, 23, 42, 0.9)', 
            padding: '15px 25px', borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)', zIndex: 20
          }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
              상태: <span style={{ color: postureData.status === '정상' ? '#10b981' : '#f43f5e' }}>{postureData.status}</span>
            </p>
            <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>목 각도: {postureData.angle}°</p>
          </div>

          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <video
              ref={videoRef}
              autoPlay playsInline muted
              style={{
                width: 'auto', maxWidth: '100%', height: 'auto', maxHeight: '100vh',
                objectFit: 'contain', transform: 'scaleX(-1)',
                borderRadius: '30px', border: '2px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 0 50px rgba(0,0,0,0.5)', backgroundColor: '#000'
              }}
            />

            <div style={{
              position: 'absolute', bottom: '30px', background: 'rgba(0, 0, 0, 0.7)',
              color: '#fbbf24', padding: '10px 20px', borderRadius: '50px',
              fontSize: '1rem', fontWeight: '600', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(251, 191, 36, 0.4)', zIndex: 10
            }}>
              ⚠️ 어깨가 보이도록 뒤로 조금 물러나 주세요
            </div>
          </div>
        </div>
      )}

      {/* 2. 스트레칭 모드 UI: key를 부여하여 컴포넌트가 확실히 새로 렌더링되게 함 */}
      {isStretchMode && (
        <StretchPage 
          key="stretch-page-session" 
          // usePoseDetection 훅에서 오는 랜드마크를 StretchPage로 전달
          landmarks={postureData.landmarks} 
          currentData={postureData}
          onFinish={() => {
            detectCountRef.current = 0; 
            setIsStretchMode(false);
          }} 
        />
      )}
    </div>
  );
};

export default MonitorPage;