// src/pages/MainPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.scss";
import { Row, Col } from "react-bootstrap";
import { communityApi } from "../services/api";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../services/api";
import CommunityList from "../components/CommunityList";
interface MainPageProps {
  isLoggedIn: boolean;
}

interface Community {
  communityId: number;
  communityName: string;
  communityLogoImage: string | null;
  communityCoverImage: string | null;
}
const getToken = () => {
  return localStorage.getItem("accessToken");
};
const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded: any = jwtDecode(token);
    console.log(decoded);
    return decoded.id;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
const MainPage: React.FC<MainPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [mycommunities, setMyCommunities] = useState<Community[]>([]);
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("isLoggedIn");
      await authApi.signOut();
      localStorage.clear();
      alert("로그아웃이 성공적으로 되었습니다.");
      navigate("/main");
      window.location.reload(); // 상태 갱신을 위해 페이지 리로드
    } catch (error) {
      alert("LogOut failed.");
    }
  };
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = getToken();
        if (!token) {
          const response = await communityApi.findAll();
          setCommunities(response.data.data);
        } else {
          const response = await communityApi.findAll();
          const myresponse = await communityApi.findMy();
          setCommunities(response.data.data);
          setMyCommunities(myresponse.data.data);
        }
      } catch (error) {
        console.log(error)
        alert("Failed to fetch communities");
      }
      
    };
    fetchCommunities();
  }, []);

  const handleCommunityClick = async (communityId: number) => {
    try {
      const response = await communityApi.findById(communityId);
      navigate(`/communities/${communityId}`, { state: { community: response.data.data } });
    } catch (error) {
      console.log(error);
      alert("Failed to fetch community details");
    }
  };


  return (
    <div className="main-page">
      <header>
        <div className="header-box">
          <Link to="/main" className="header-box-logo">
            <img
              className="header-box-logo-image"
              src="/favicon.ico"
              alt="logo"
            />
          </Link>
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
                <button>
                  <img
                    className="header-user-icon"
                    src="/images/user.png"
                    alt="user"
                  ></img>
                  <div className="header-user-dropdown">
                    <Link to="/userinfo">내 정보</Link>
                    <Link to="/membership">멤버십</Link>
                    <Link to="/payment-history">결제내역</Link>
                    <button onClick={handleLogout}>로그아웃</button>
                  </div>
                </button>
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
      <div className="mainPage-main">
        {isLoggedIn && (
          <div className="mainPage-main-my">
               <CommunityList
            title="나의 커뮤니티"
            communities={mycommunities}
            onCommunityClick={handleCommunityClick}
          />
          </div>
        )}
        <div className="mainPage-main-all">
            <CommunityList
          title="모든 커뮤니티"
          communities={communities}
          onCommunityClick={handleCommunityClick}
        />  
        </div>
      </div>
      <footer></footer>
    </div>
  );
};

export default MainPage;
