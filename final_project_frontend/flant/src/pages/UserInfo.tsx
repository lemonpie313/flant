// src/pages/MainPage.tsx
import React from "react";
import "./UserInfo.scss";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

const UserInfoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("isLoggedIn");
      await authApi.signOut();
      navigate("/main");
      //window.location.reload(); // 상태 갱신을 위해 페이지 리로드
    } catch (error) {
      alert("LogOut failed.");
    }
  };
  return (
    <div className="main-page">
      <header>
        <div className="header-box">
          <Link to="/main" className="header-box-logo">
            <img
              className="header-box-logo-image"
              src="/TGSrd-removebg-preview.png"
              alt="logo"
            />
          </Link>
          <div className="header-box-blank">유저 정보 페이지입니당</div>
          <div className="header-box-user">
            <div className="header-box-user-info">
              <button onClick={handleLogout} className="header-box-btn btn-3">
                Logout
              </button>
              <button>
                <img
                  className="header-notification-icon"
                  src="/images/notification.png"
                  alt="notification"
                ></img>
              </button>
              <button>
                <img
                  className="header-user-icon"
                  src="/images/user.png"
                  alt="user"
                ></img>
              </button>
            </div>

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

export default UserInfoPage;
