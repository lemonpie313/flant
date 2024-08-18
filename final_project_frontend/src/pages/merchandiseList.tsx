import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { merchandiseApi } from '../services/api';
import './merchandiseList.scss';

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

const MerchandiseList: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();  // useParams를 이용해 communityId 가져오기
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchandises, setMerchandises] = useState<{ [key: number]: Merchandise[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가
  const navigate = useNavigate();

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

  // 상품 클릭 시 상세 페이지로 이동
  const handleMerchandiseClick = (merchandiseId: number) => {
    // communityId와 merchandiseId를 함께 사용해 URL을 구성
    navigate(`/merchandise/${merchandiseId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
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
  );
};

export default MerchandiseList;
