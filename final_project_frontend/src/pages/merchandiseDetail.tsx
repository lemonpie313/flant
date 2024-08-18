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
  content: string;
  merchandiseImage: MerchandiseImage[];
  merchandiseOption: MerchandiseOption[];
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

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(Number(event.target.value));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  if (!merchandise) {
    return <p>Loading...</p>;
  }

  return (
    <div className="merchandise-detail">
      <div className="product-info">
        <div className="thumbnail">
          <img src={merchandise.thumbnail} alt={merchandise.merchandiseName} />
        </div>
        <h2>{merchandise.merchandiseName}</h2>
        <p className="price">Price: {merchandise.price} 원</p>
        <div className="options-quantity">
          {merchandise.merchandiseOption.length > 0 && (
            <>
              <label htmlFor="option-select">Option:</label>
              <select
                id="option-select"
                value={selectedOption ?? ""}
                onChange={handleOptionChange}
              >
                <option value="">Select an option</option>
                {merchandise.merchandiseOption.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.optionName}
                  </option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="quantity-input">Quantity:</label>
          <input
            id="quantity-input"
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />

          <div className="buttons">
            <button className="add-to-cart">Add to Cart</button>
            <button className="checkout">Checkout</button>
          </div>
        </div>
      </div>

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
