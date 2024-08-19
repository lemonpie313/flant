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
  const { communityId } = useParams<{ communityId: string }>();  
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchandises, setMerchandises] = useState<{ [key: number]: Merchandise[] }>({});
  const [currentPage, setCurrentPage] = useState<{ [key: number]: number }>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await merchandiseApi.fetchCategories(Number(communityId));
        setCategories(categoryResponse.data.data.categories);
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
      }
    };

    if (communityId) {
      fetchCategories();
    }
  }, [communityId]);

  useEffect(() => {
    const fetchMerchandisesByCategory = async () => {
      try {
        const merchandiseData: { [key: number]: Merchandise[] } = {};

        for (const category of categories) {
          const response = await merchandiseApi.fetchMerchandises(Number(communityId), category.merchandiseCategoryId);
          merchandiseData[category.merchandiseCategoryId] = response.data.data;
        }

        setMerchandises(merchandiseData);

        // 각 카테고리마다 현재 페이지를 초기화
        const initialPage: { [key: number]: number } = {};
        categories.forEach((category) => {
          initialPage[category.merchandiseCategoryId] = 0;
        });
        setCurrentPage(initialPage);

      } catch (error) {
        console.error("상품 조회 실패:", error);
      }
    };

    if (categories.length > 0) {
      fetchMerchandisesByCategory();
    }
  }, [categories, communityId]);

  const handleMerchandiseClick = (merchandiseId: number) => {
    navigate(`/communities/${communityId}/merchandise/${merchandiseId}`);
  };

  // 이전 페이지로 이동
  const handlePrevPage = (categoryId: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [categoryId]: Math.max(prev[categoryId] - 1, 0)
    }));
  };

  // 다음 페이지로 이동
  const handleNextPage = (categoryId: number, totalItems: number) => {
    const maxPage = Math.ceil(totalItems / 4) - 1;
    setCurrentPage((prev) => ({
      ...prev,
      [categoryId]: Math.min(prev[categoryId] + 1, maxPage)
    }));
  };

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
      alert("로그아웃 실패.");
    }
  };

  return (
    <div className="merchandise-list-page">
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

      <CommunityNavigationHeader />

      <div className="merchandise-list">
        {categories.map((category) => {
          const items = merchandises[category.merchandiseCategoryId] || [];
          const currentPageIndex = currentPage[category.merchandiseCategoryId] || 0;
          const startIndex = currentPageIndex * 4;
          const visibleItems = items.slice(startIndex, startIndex + 4);

          return (
            <div key={category.merchandiseCategoryId} className="category-section">
              <h2>{category.categoryName}</h2>
              <div className="merchandise-slider">
                {/* 왼쪽 화살표 */}
                {currentPageIndex > 0 && (
                  <button className="slider-button prev-button" onClick={() => handlePrevPage(category.merchandiseCategoryId)}>
                    ◀
                  </button>
                )}

                {/* 상품 리스트 */}
                <ul className="merchandise-items">
                  {visibleItems.map((merchandise) => (
                    <li 
                      key={merchandise.merchandiseId}
                      onClick={() => handleMerchandiseClick(merchandise.merchandiseId)}
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
                  ))}
                </ul>

                {/* 오른쪽 화살표 */}
                {startIndex + 4 < items.length && (
                  <button className="slider-button next-button" onClick={() => handleNextPage(category.merchandiseCategoryId, items.length)}>
                    ▶
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MerchandiseList;
