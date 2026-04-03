// src/hooks/usePoseDetection.js

import { useEffect, useRef, useState } from 'react';
import { initializePose, sendToPose } from '../ai/mediapipe';
import { analyzePosture } from '../ai/posestretch'; // 🎯 바뀐 파일명으로 연결!
import { savePoseLog } from '../api/poseApi';

export const usePoseDetection = (videoRef) => {
  const [postureData, setPostureData] = useState({ 
    angle: 0, shoulderDiff: 0, forwardRatio: 0, status: '대기' 
  });
  
  const requestRef = useRef();
  const lastSentTime = useRef(0); // 마지막 API 전송 시간 기록

  const onResults = async (results) => {
    if (results.poseLandmarks) {
      // 1. 사용자님만의 전용 로직(posestretch)으로 자세 분석
      const analysis = analyzePosture(results.poseLandmarks);
      
      // UI 업데이트를 위해 상태 저장
      setPostureData({
        ...analysis,
        landmarks: results.poseLandmarks // 스트레칭 페이지 전달용 데이터 포함
      });

      // 2. 서버 전송 제어 (정확히 30초 간격)
      const now = Date.now();
      
      if (now - lastSentTime.current > 30000) { // 30,000ms = 30초
        try {
          // 서버에 분석 데이터 저장
          await savePoseLog(analysis);
          
          lastSentTime.current = now; // 전송 시점 업데이트
          console.log("✅ [정기 알림] 30초 간격 자세 데이터가 서버에 저장되었습니다.");
        } catch (err) {
          console.warn("⚠️ 데이터 전송 실패: 네트워크나 서버 설정을 확인하세요.");
        }
      }
    }
  };

  // 실시간 루프 함수
  const detect = async () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      await sendToPose(videoRef.current);
    }
    requestRef.current = requestAnimationFrame(detect);
  };

  useEffect(() => {
    // MediaPipe 초기화 및 콜백 연결
    const poseInstance = initializePose(onResults);
    detect();

    // 컴포넌트 언마운트 시 자원 해제
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      poseInstance.close();
    };
  }, []);

  return postureData;
};