import client from './client'

// 회원가입: 데이터를 보내고 응답을 기다림
export const register = (data) => client.post('/api/auth/register', data);

// 로그인: 데이터를 보내고 응답을 기다림
export const login = (data) => client.post('/api/auth/login', data);

// 소셜 로그인
export const socialLogin = (data) => client.post('/api/auth/social', data);