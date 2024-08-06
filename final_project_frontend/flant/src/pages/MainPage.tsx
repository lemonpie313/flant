// src/pages/MainPage.tsx
import React from "react";
import "./MainPage.scss";
import { Link, useNavigate } from "react-router-dom";

interface MainPageProps {
  isLoggedIn: boolean;
}

const MainPage: React.FC<MainPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/main");
    window.location.reload(); // 상태 갱신을 위해 페이지 리로드
  };
  return (
    <div className="main-page">
      <header>
        <div className="header-box">
          <div className="header-box-logo">
            <img
              className="header-box-logo-image"
              src="/TGSrd-removebg-preview.png"
              alt="logo"
            />
          </div>
          <div className="header-box-blank">메인 페이지입니당</div>
          <div className="header-box-user">
            {isLoggedIn ? (
              <div className="header-box-user-info">
                <button>
                  <img
                    className="header-notification-icon"
                    src="/images/notification.png"
                    alt="notification"
                  ></img>
                </button>
                <Link to="/userinfo">
                  <img
                    className="header-user-icon"
                    src="/images/user.png"
                    alt="user"
                  ></img>
                </Link>
              </div>
            ) : (
              <div className="header-box-login">
                <div className="header-box-container">
                  <Link to="/login" className="header-box-btn btn-3">
                    Sign in
                  </Link>
                </div>
              </div>
            )}
            <div className="header-box-user-shop">
              <Link to="#">
                <img
                  style={{ marginLeft: "25px", marginTop: "6px" }}
                  className="header-box-shop-image"
                  src="/green-cart.png"
                  alt="green-cart"
                ></img>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main></main>
      <footer></footer>
    </div>
  );
};

export default MainPage;
