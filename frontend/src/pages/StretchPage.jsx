import React, { useState, useRef, useEffect } from 'react';

const STRETCH_STEPS = [
  { 
    id: 1, 
    name: "목 옆으로 당기기", 
    image: "/images/sideneck.jpg", 
    targetNoseY: 0.515,
    targetWidth: 0.450, 
    toleranceY: 0.08, 
    toleranceWidth: 0.1,
    condition: (data) => data.angle > 15.0 
  },
  { 
    id: 2, 
    name: "목 앞으로 숙이기", 
    image: "/images/frontneck.jpg",
    targetNoseY: 0.585,
    targetWidth: 0.460, 
    toleranceY: 0.08, 
    toleranceWidth: 0.1,
    condition: (data) => data.angle < 10.0 
  },
  {
    id: 3,
    name: "어깨 으쓱하기", 
    image: "/images/shoulder.jpg",
    targetNoseY: 0.565,
    targetWidth: 0.510,
    toleranceY: 0.08,
    toleranceWidth: 0.1,
    condition: (data) => data.angle < 10.0 
  }
];

const StretchPage = ({ landmarks, currentData, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [holdTime, setHoldTime] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [statusMessage, setStatusMessage] = useState("준비 중...");
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const requestRef = useRef(null); 
  const prevLandmarksRef = useRef(null);

  const HOLD_TARGET = 8000;

  // 1. 카메라 초기화 (MonitorPage에서 넘어올 때 충돌 방지를 위해 지연 실행 고려)
  useEffect(() => {
    let stream = null;
    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera Error:", err);
      }
    };
    
    startVideo();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 2. 실시간 드로잉 루프
  const draw = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!landmarks || !canvas || !video || video.videoWidth === 0) {
      requestRef.current = requestAnimationFrame(draw);
      return;
    }

    const ctx = canvas.getContext('2d');
    
    // ⭐ [수정] 비디오의 실제 contain 비율 영역 계산 (좌표 오차 해결 핵심)
    const videoRatio = video.videoWidth / video.videoHeight;
    const containerWidth = video.clientWidth;
    const containerHeight = video.clientHeight;
    const containerRatio = containerWidth / containerHeight;

    let actualWidth, actualHeight;
    if (containerRatio > videoRatio) {
      actualHeight = containerHeight;
      actualWidth = containerHeight * videoRatio;
    } else {
      actualWidth = containerWidth;
      actualHeight = containerWidth / videoRatio;
    }

    // 캔버스 크기를 비디오의 실제 '그림 영역'에 맞춤
    if (canvas.width !== actualWidth || canvas.height !== actualHeight) {
      canvas.width = actualWidth;
      canvas.height = actualHeight;
    }

    // 부드러운 움직임 (보간)
    let smoothLandmarks = landmarks;
    if (prevLandmarksRef.current) {
      smoothLandmarks = landmarks.map((lm, i) => ({
        x: prevLandmarksRef.current[i].x * 0.6 + lm.x * 0.4,
        y: prevLandmarksRef.current[i].y * 0.6 + lm.y * 0.4,
      }));
    }
    prevLandmarksRef.current = smoothLandmarks;

    // 자세 판정
    const stepGoal = STRETCH_STEPS[currentStep];
    const noseMatch = currentData ? Math.abs(currentData.avgNoseY - stepGoal.targetNoseY) < stepGoal.toleranceY : false;
    const customMatch = currentData ? stepGoal.condition(currentData) : false;
    const correct = noseMatch && customMatch;

    if (isHolding !== correct) setIsHolding(correct);
    setStatusMessage(correct ? "유지하세요!" : `${stepGoal.name} 자세를 취해주세요.`);

    // 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = correct ? "#22c55e" : "#ef4444";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    const connections = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
      [11, 23], [12, 24], [23, 24], [0, 11], [0, 12]
    ];

    connections.forEach(([i, j]) => {
      if (smoothLandmarks[i] && smoothLandmarks[j]) {
        ctx.beginPath();
        // (1 - x) 보정 및 캔버스 크기 곱하기
        ctx.moveTo((1 - smoothLandmarks[i].x) * canvas.width, smoothLandmarks[i].y * canvas.height);
        ctx.lineTo((1 - smoothLandmarks[j].x) * canvas.width, smoothLandmarks[j].y * canvas.height);
        ctx.stroke();
      }
    });

    // 주요 관절 포인트
    ctx.fillStyle = correct ? "#4ade80" : "#ffffff";
    [0, 11, 12, 13, 14, 15, 16].forEach(idx => {
      const p = smoothLandmarks[idx];
      if (p) {
        ctx.beginPath();
        ctx.arc((1 - p.x) * canvas.width, p.y * canvas.height, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(requestRef.current);
  }, [landmarks, currentStep, currentData, isHolding]);

  // 3. 타이머 로직
  useEffect(() => {
    if (isHolding) {
      timerRef.current = setInterval(() => {
        setHoldTime(prev => Math.min(prev + 100, HOLD_TARGET));
      }, 100);
    } else {
      clearInterval(timerRef.current);
      setHoldTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isHolding]);

  // 4. 단계 전환 로직
  useEffect(() => {
    if (holdTime >= HOLD_TARGET) {
      if (currentStep < STRETCH_STEPS.length - 1) {
        setStatusMessage("잘하셨어요! 다음 동작 준비!");
        const nextTimer = setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setHoldTime(0);
          setIsHolding(false);
        }, 1500);
        return () => clearTimeout(nextTimer);
      } else {
        setStatusMessage("모든 스트레칭 완료!");
        const finishTimer = setTimeout(() => onFinish && onFinish(), 1500);
        return () => clearTimeout(finishTimer);
      }
    }
  }, [holdTime, currentStep, onFinish]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', background: '#020617', zIndex: 9999 }}>
      {/* 가이드 패널 */}
      <div style={{ width: '380px', background: '#0f172a', padding: '40px 25px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#38bdf8', marginBottom: '20px' }}>{STRETCH_STEPS[currentStep].name}</h2>
        <div style={{ width: '100%', height: '250px', background: '#1e293b', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px' }}>
          <img src={STRETCH_STEPS[currentStep].image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="guide" />
        </div>
        <p style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '30px' }}>{statusMessage}</p>
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '8px' }}>
            <span>진행도</span>
            <span>{Math.floor((holdTime / HOLD_TARGET) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: '#334155', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${(holdTime / HOLD_TARGET) * 100}%`, height: '100%', background: '#22c55e', transition: 'width 0.1s linear' }} />
          </div>
        </div>
      </div>

      {/* 영상 영역 */}
      <div style={{ flex: 1, position: 'relative', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <video 
          ref={videoRef} 
          autoPlay playsInline muted 
          style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scaleX(-1)' }} 
        />
        <canvas 
          ref={canvasRef} 
          style={{ 
            position: 'absolute', 
            pointerEvents: 'none',
            zIndex: 10
          }} 
        />
        {isHolding && holdTime < HOLD_TARGET && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '12rem', fontWeight: 'bold', textShadow: '0 0 20px rgba(0,0,0,0.5)', zIndex: 20 }}>
            {Math.ceil((HOLD_TARGET - holdTime) / 1000)}
          </div>
        )}
      </div>
    </div>
  );
};

export default StretchPage;