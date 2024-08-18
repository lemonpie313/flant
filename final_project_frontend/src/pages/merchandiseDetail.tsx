import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { merchandiseApi } from '../services/api';
import './merchandiseDetail.scss'; // CSS 파일 추가
import { authApi } from '../services/api'; // 로그아웃 API 가져오기

interface MerchandiseImage {
  merchandiseImageId: number;
  url: string;
}

interface MerchandiseOption {
  id: number;
  optionName: string;
}

interface MerchandiseDetail {
  merchandiseId: number;
  merchandiseName: string;
  thumbnail: string;
  price: number;
  content: string; // 상품 상세 설명
  merchandiseImage: MerchandiseImage[];
  merchandiseOption: MerchandiseOption[]; // 옵션 추가
}

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const MerchandiseDetail: React.FC = () => {
  const { merchandiseId } = useParams<{ merchandiseId: string }>();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [merchandise, setMerchandise] = useState<MerchandiseDetail | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token); // 로그인 여부 판단

    const fetchMerchandiseDetail = async () => {
      try {
        const response = await merchandiseApi.fetchMerchandiseDetail(Number(merchandiseId));
        setMerchandise(response.data.data);
      } catch (error) {
        console.error("상품 상세 정보 조회 실패:", error);
      }
    };

    if (merchandiseId) {
      fetchMerchandiseDetail();
    }
  }, [merchandiseId]);

  const handleAddToCart = async () => {
    if (!merchandise || selectedOption === null || quantity <= 0) {
      alert("옵션을 선택하고 수량을 올바르게 입력해 주세요.");
      return;
    }

    try {
      const response = await merchandiseApi.addToCart(
        merchandise.merchandiseId,
        selectedOption,
        quantity
      );
      console.log(response.data.data);
      alert(response.data.message); // API 응답 메시지 표시
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 추가에 실패했습니다.");
    }
  };

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

  return (
    <div className="merchandise-detail-page">
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
          <div className="header-box-blank">상품 상세 페이지</div>
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

      {/* Main Content */}
      <div className="merchandise-detail">
        <div className="thumbnail">
          <img src={merchandise?.thumbnail} alt={merchandise?.merchandiseName} />
        </div>
        <h2>{merchandise?.merchandiseName}</h2>
        <p className="price">Price: {merchandise?.price} 원</p>

        <div className="options">
          <label htmlFor="option">Option:</label>
          <select
            id="option"
            value={selectedOption ?? ""}
            onChange={(e) => setSelectedOption(Number(e.target.value))}
          >
            <option value="" disabled>Select an option</option>
            {merchandise?.merchandiseOption.map(option => (
              <option key={option.id} value={option.id}>
                {option.optionName}
              </option>
            ))}
          </select>
        </div>

        <div className="quantity">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <button onClick={handleAddToCart}>Add to Cart</button>

        <div className="content">
          { (
            merchandise?.merchandiseImage.map((image) => (
              <img 
                key={image.merchandiseImageId} 
                src={image.url} 
                alt={`Image ${image.merchandiseImageId}`} 
                className="detail-image" 
              />
            ))
          ) }
        </div>
      </div>
    </div>
  );
};

export default MerchandiseDetail;
