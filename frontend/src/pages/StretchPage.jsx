import React, { useState, useRef, useEffect } from 'react';
import { PERFECT_POSE_DATA, getSimilarity } from '../utils/appUtils';

const STRETCH_STEPS = [
  { id: 1, name: "목 옆으로 당기기", image: "/images/stretch_neck.png" },
];

const StretchPage = ({ landmarks, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [holdTime, setHoldTime] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [statusMessage, setStatusMessage] = useState("준비하세요!");
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const prevLandmarksRef = useRef(null); // 관절 떨림 방지용(Smoothing)

  // 1. 5초 유지 타이머 로직
  useEffect(() => {
    if (isHolding) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setHoldTime(prev => (prev >= 5000 ? 5000 : prev + 100));
        }, 100);
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setHoldTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isHolding]);

  // 2. 성공 판정 및 종료
  useEffect(() => {
    if (holdTime >= 5000) {
      setStatusMessage("참 잘했어요! 완료되었습니다.");
      setTimeout(() => onFinish(), 1500);
    }
  }, [holdTime, onFinish]);

  // 3. 🚀 핵심: 데이터 기반 판정 및 스켈레톤 시각화
  useEffect(() => {
    if (!landmarks || !canvasRef.current || !containerRef.current) return;

    // --- A. Smoothing 로직 (관절 떨림 방지) ---
    let smoothLandmarks = landmarks;
    if (prevLandmarksRef.current) {
      smoothLandmarks = landmarks.map((lm, i) => ({
        x: prevLandmarksRef.current[i].x * 0.7 + lm.x * 0.3,
        y: prevLandmarksRef.current[i].y * 0.7 + lm.y * 0.3,
        z: lm.z
      }));
    }
    prevLandmarksRef.current = smoothLandmarks;

    // --- B. 캔버스 설정 ---
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- C. 데이터 유사도 판정 ---
    const target = PERFECT_POSE_DATA.neck_stretch;
    const currentNose = smoothLandmarks[0]; // 코 위치
    const diff = getSimilarity(currentNose, target.nose); // 학습 데이터와 비교
    
    const correct = diff < target.threshold; // 오차 범위 내면 성공
    setIsHolding(correct);
    setStatusMessage(correct ? "잘하고 있어요! 유지하세요!" : "정석 자세 가이드를 따라해주세요.");

    // --- D. 스켈레톤 그리기 ---
    const drawPos = (p) => ({ 
      x: (1 - p.x) * canvas.width, // 좌우 반전
      y: p.y * canvas.height 
    });

    ctx.strokeStyle = correct ? "#22c55e" : "#ef4444"; // 성공 시 초록, 아니면 빨강
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    // 주요 관절 연결 쌍 (코-어깨-팔꿈치-손목 등)
    const connections = [
      [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6],
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24]
    ];

    connections.forEach(([i, j]) => {
      if (smoothLandmarks[i] && smoothLandmarks[j]) {
        const p1 = drawPos(smoothLandmarks[i]);
        const p2 = drawPos(smoothLandmarks[j]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
  }, [landmarks, currentStep]);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0f172a', overflow: 'hidden' }}>
       {/* 캔버스 (스켈레톤 표시) */}
       <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
       
       {/* 가이드 UI 박스 */}
       <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 10, color: 'white', background: 'rgba(30, 41, 59, 0.8)', padding: '25px', borderRadius: '20px', backdropFilter: 'blur(10px)', width: '350px' }}>
         <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#38bdf8' }}>{STRETCH_STEPS[currentStep].name}</h2>
         <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{statusMessage}</p>
         
         {/* 진행도 표시 바 */}
         <div style={{ width: '100%', height: '12px', background: '#475569', borderRadius: '6px', overflow: 'hidden' }}>
           <div style={{ width: `${(holdTime / 5000) * 100}%`, height: '100%', background: '#22c55e', transition: 'width 0.2s' }} />
         </div>
       </div>

       {/* 중앙 카운트다운 (유지 중일 때만 표시) */}
       {isHolding && (
         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: '12rem', fontWeight: 'bold', zIndex: 5, textShadow: '0 0 40px rgba(34, 197, 94, 0.6)' }}>
           {Math.ceil((5000 - holdTime) / 1000)}
         </div>
       )}
    </div>
  );
};

export default StretchPage;