// src/services/auth.service.js
const { User } = require('../models'); 

// 1. 회원가입 함수 수정
const register = async (userData) => {
  // 프론트에서 넘겨준 userData 안에 login_id가 들어있어야 합니다.
  const newUser = await User.create({
    name: userData.name,
    login_id: userData.login_id, //  이제 진짜 아이디가 DB의 login_id 칸으로 들어갑니다!
    email: userData.email,      // 진짜 이메일 주소 저장
    password: userData.password,
    provider: 'local',
    provider_id: null 
  });
  
  return { message: "회원가입 성공", user: newUser };
};

// 2. 로그인 함수 수정
const login = async ({ login_id, password }) => { // 매개변수를 email에서 login_id로 변경
  // DB에서 이제 email이 아닌 login_id로 유저를 찾습니다.
  const user = await User.findOne({ 
    where: { 
      login_id: login_id, // 👈 email 대신 login_id로 조회!
      password: password 
    } 
  });
  
  if (!user) {
    throw { status: 401, message: "아이디 또는 비밀번호가 일치하지 않습니다." };
  }
  
  // 로그인 성공 시 응답
  return { 
    message: "로그인 성공", 
    user: { id: user.user_id, login_id: user.login_id } 
  };
};

// 3. 소셜 로그인 함수
const socialLogin = async ({ email, name, provider, provider_id }) => {
  let user = await User.findOne({ where: { provider, provider_id } });
  if (!user) {
    user = await User.create({
      name, 
      login_id: email, // 소셜 로그인은 이메일을 아이디 대용으로 쓰도록 설정
      email, 
      provider, 
      provider_id, 
      password: null
    });
  }
  // sign 함수 정의 확인 필요
  const token = sign({ user_id: user.user_id, login_id: user.login_id });
  return { token, user: { user_id: user.user_id, login_id: user.login_id, name: user.name } };
};

module.exports = { register, login, socialLogin };