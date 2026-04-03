import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import StretchPage from './StretchPage'; // 우리가 만든 스트레칭 페이지

// ❌ 의성씨의 훅은 더 이상 사용하지 않습니다.
// import { useUnifiedPose } from '../hooks/useUnifiedPose'; 

const MonitorPage = () => {
  const [landmarks, setLandmarks] = useState(null); // 실시간 관절 좌표 상태
  const [isStretchMode, setIsStretchMode] = useState(false); // 스트레칭 모드 전환 여부
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // --- [핵심] MediaPipe 설정 (의성씨 로직 없이 순수하게 좌표만 추출) ---
  useEffect(() => {
    // 여기에 기존에 작성되어 있던 MediaPipe 설정(Pose 객체 생성 등)이 있을 것입니다.
    // 핵심은 onResults 함수 내부입니다!
    
    const onResults = (results) => {
      if (results.poseLandmarks) {
        // 1. 순수 좌표 데이터를 상태에 저장합니다.
        setLandmarks(results.poseLandmarks);

        // 2. 만약 거북목이 심해서 스트레칭이 필요하다고 판단되면 (기존 로직 활용)
        // setIsStretchMode(true); 
      }
    };

    // ... (MediaPipe Camera 설정 로직들) ...
  }, []);

  // 스트레칭이 끝났을 때 다시 모니터링으로 돌아오는 함수
  const handleStretchFinish = () => {
    setIsStretchMode(false);
    // 필요시 점수 초기화 등의 로직 추가
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {/* 1. 평소에는 웹캠 화면(모니터링)을 보여줌 */}
      <video ref={videoRef} style={{ display: isStretchMode ? 'none' : 'block', width: '100%' }} />

      {/* 2. 스트레칭 모드가 활성화되면, 우리가 만든 StretchPage를 띄움 */}
      {isStretchMode && (
        <StretchPage 
          landmarks={landmarks} // 🎯 의성씨 훅 거치지 않은 순수 좌표 전달!
          onFinish={handleStretchFinish} 
        />
      )}
    </div>
  );
};

export default MonitorPage;