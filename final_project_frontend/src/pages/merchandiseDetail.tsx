import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { merchandiseApi } from '../services/api';
import './merchandiseDetail.scss'; // CSS 파일 추가

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

const MerchandiseDetail: React.FC = () => {
  const { merchandiseId } = useParams<{ merchandiseId: string }>();
  const [merchandise, setMerchandise] = useState<MerchandiseDetail | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
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

  if (!merchandise) {
    return <p>Loading...</p>;
  }

  return (
    <div className="merchandise-detail">
      <div className="thumbnail">
        <img src={merchandise.thumbnail} alt={merchandise.merchandiseName} />
      </div>
      <h2>{merchandise.merchandiseName}</h2>
      <p className="price">Price: {merchandise.price} 원</p>

      <div className="options">
        <label htmlFor="option">Option:</label>
        <select
          id="option"
          value={selectedOption ?? ""}
          onChange={(e) => setSelectedOption(Number(e.target.value))}
        >
          <option value="" disabled>Select an option</option>
          {merchandise.merchandiseOption.map(option => (
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
        {merchandise.merchandiseImage.length > 0 ? (
          merchandise.merchandiseImage.map((image) => (
            <img 
              key={image.merchandiseImageId} 
              src={image.url} 
              alt={`Image ${image.merchandiseImageId}`} 
              className="detail-image" 
            />
          ))
        ) : (
          <p>No additional images available.</p>
        )}
      </div>
    </div>
  );
};

export default MerchandiseDetail;
