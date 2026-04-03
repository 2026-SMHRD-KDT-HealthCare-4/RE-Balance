// src/ai/posestretch.js

/**
 * 거북목 측정을 위한 CVA(Craniovertebral Angle) 계산 함수
 * @param {Array} landmarks - MediaPipe에서 추출된 관절 좌표 배열
 */
export const analyzePosture = (landmarks) => {
  // 7번: 왼쪽 귀(Left Ear), 11번: 왼쪽 어깨(Left Shoulder)
  const leftEar = landmarks[7];
  const leftShoulder = landmarks[11];

  // 좌표가 감지되지 않으면 기본값 반환
  if (!leftEar || !leftShoulder) {
    return { angle: 0, shoulderDiff: 0, forwardRatio: 0, status: '감지불가' };
  }

  // 1. x, y 차이 계산
  const dx = Math.abs(leftEar.x - leftShoulder.x);
  const dy = Math.abs(leftEar.y - leftShoulder.y);

  // 2. 각도 계산 (라디안 -> 도 단위 변환)
  // Math.atan2(y, x)를 사용하여 어깨와 귀 사이의 수직/수평 비율로 각도 추출
  const radians = Math.atan2(dy, dx);
  const angle = Math.round(radians * (180 / Math.PI));

  // 3. 상태 판정 (일반적으로 CVA 50도 미만을 거북목 위험군으로 분류)
  let status = '정상';
  if (angle < 50) status = '거북목 위험';
  if (angle < 40) status = '주의 요망';

  return {
    angle: angle,           // 계산된 각도
    shoulderDiff: 0,        // (필요시 추가 구현)
    forwardRatio: dx,       // 목이 앞으로 나온 정도(참고용)
    status: status          // 현재 상태 메시지
  };
};