// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./SignUpPage.scss";
import { Link } from "react-router-dom";
const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(email, password, passwordConfirm, name)
      await authApi.signUp(email, password, passwordConfirm, name); // axios를 사용하여 로그인 요청을 보냄
      alert("회원가입이 정상적으로 완료되었습니다.");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/main");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("Sign UP failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <header>
          <img
            className="main-box-logo"
            src="/TGSrd-removebg-preview.png"
            alt="logo"
          ></img>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <div className="main-email ">
              <input
                className="main-email-input"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <label className="main-email-label">이름</label>
              <span className="main-email-span "></span>
            </div>
            <div className="main-email sign-up-topmargin">
              <input
                className="main-email-input"
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <label className="main-email-label">이메일</label>
              <span className="main-email-span"></span>
            </div>
            <div className="main-email sign-up-topmargin">
              <input
                className="main-email-input"
                type="password"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <label className="main-email-label">비밀번호</label>
              <span className="main-email-span"></span>
            </div>
            <div className="main-email sign-up-topmargin">
              <input
                className="main-email-input"
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              ></input>
              <label className="main-email-label">비밀번호 확인</label>
              <span className="main-email-span"></span>
            </div>

            <div className="main-login-button">
              <button type="submit" className="main-login-btn login-btn-3">
                회원가입
              </button>
            </div>
            <div className="signup-goto-main">
              <Link to="/main" className="main-signup-b">
                메인으로 돌아가기
              </Link>
            </div>
          </form>

          <div className="main-login-forget"></div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};

export default SignUpPage;
