import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authApi, merchandiseApi } from '../services/api';
import './merchandiseList.scss';
import CommunityNavigationHeader from "../components/communityBoard/CommunityNavigationHeader";

interface Merchandise {
  merchandiseId: number;
  merchandiseName: string;
  thumbnail: string;
  price: number;
  merchandiseCategoryId: number;
}

interface Category {
  merchandiseCategoryId: number;
  categoryName: string;
}

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const MerchandiseList: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();  // useParams를 이용해 communityId 가져오기
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchandises, setMerchandises] = useState<{ [key: number]: Merchandise[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // 로그인 상태 확인
  const navigate = useNavigate();

  // 로그인 상태 체크
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
  }, []);

  // 카테고리 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await merchandiseApi.fetchCategories(Number(communityId));  // communityId는 문자열이므로 숫자로 변환
        setCategories(categoryResponse.data.data.categories);
      } catch (error) {
        setError("카테고리 조회에 실패했습니다.");
        console.error("카테고리 조회 실패:", error);
      }
    };

    if (communityId) {
      fetchCategories();
    }
  }, [communityId]);

  // 각 카테고리별 상품 조회
  useEffect(() => {
    const fetchMerchandisesByCategory = async () => {
      try {
        const merchandiseData: { [key: number]: Merchandise[] } = {};

        for (const category of categories) {
          const response = await merchandiseApi.fetchMerchandises(Number(communityId), category.merchandiseCategoryId);
          merchandiseData[category.merchandiseCategoryId] = response.data.data;
        }

        setMerchandises(merchandiseData);
        setLoading(false);
      } catch (error) {
        setError("상품 조회에 실패했습니다.");
        console.error("상품 조회 실패:", error);
      }
    };

    if (categories.length > 0) {
      fetchMerchandisesByCategory();
    }
  }, [categories, communityId]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await authApi.signOut();
      localStorage.clear();
      alert("로그아웃 성공");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 실패");
    }
  };

  // 상품 클릭 시 상세 페이지로 이동
  const handleMerchandiseClick = (merchandiseId: number) => {
    navigate(`/merchandise/${merchandiseId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="merchandise-list-page">
      {/* Header Section */}
      <header>
        <div className="header-box">
          <Link to="/main" className="header-box-logo">
            <img
              className="header-box-logo-image"
              src="/TGSrd-removebg-preview.png"
              alt="logo"
            />
          </Link>
          <div className="header-box-blank">상품 리스트 페이지</div>
          <div className="header-box-user">
            {isLoggedIn ? (
              <div className="header-box-user-info">
                <button>
                  <img
                    className="header-notification-icon"
                    src="/images/notification.png"
                    alt="notification"
                  />
                </button>
                <button>
                  <img
                    className="header-user-icon"
                    src="/images/user.png"
                    alt="user"
                  />
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
              <Link to="/cart">
                <img
                  style={{ marginLeft: "25px", marginTop: "6px" }}
                  className="header-box-shop-image"
                  src="/green-cart.png"
                  alt="green-cart"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar Section */}
      <CommunityNavigationHeader />

      {/* Merchandise List Section */}
      <div className="merchandise-list">
        {categories.map((category) => (
          <div key={category.merchandiseCategoryId} className="category-section">
            <h2>{category.categoryName}</h2>
            <ul>
              {merchandises[category.merchandiseCategoryId]?.length > 0 ? (
                merchandises[category.merchandiseCategoryId].map((merchandise) => (
                  <li 
                    key={merchandise.merchandiseId}
                    onClick={() => handleMerchandiseClick(merchandise.merchandiseId)}  // 클릭 시 상세 페이지로 이동
                  >
                    <div className="image-container">
                      <img
                        src={merchandise.thumbnail}
                        alt={merchandise.merchandiseName}
                      />
                    </div>
                    <p>{merchandise.merchandiseName}</p>
                    <p>Price: {merchandise.price} 원</p>
                  </li>
                ))
              ) : (
                <p>No merchandise available for this category.</p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchandiseList;
