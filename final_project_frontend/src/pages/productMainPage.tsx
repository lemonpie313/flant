import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productApi } from "../services/api";  // 상품 API 호출용

// 상품 인터페이스 정의
interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

// 상품 카드 컴포넌트
const ProductCard: React.FC<Product> = ({ id, name, price, imageUrl }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/products/${id}`); // 상품 상세 페이지로 이동
  };

  return (
    <div className="product-card" style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "5px", width: "200px" }}>
      <img src={imageUrl} alt={name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
      <h3>{name}</h3>
      <p>{price}</p>
      <button
        onClick={handleViewDetails}
        style={{ padding: "5px 10px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "5px" }}
      >
        View Details
      </button>
    </div>
  );
};

// 메인 상품 페이지 컴포넌트
const ProductMainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [artist, setArtist] = useState<string>(""); // 아티스트 이름을 입력받기 위한 상태 추가

  // 상품 목록 불러오기 함수
  const fetchProducts = async () => {
    if (!artist) {
      alert("Please enter an artist name!"); // 아티스트 이름을 입력하지 않았을 때 경고 메시지
      return;
    }

    setIsLoading(true);

    try {
      const response = await productApi.getProducts(artist); // 아티스트 이름을 전달하여 상품 필터링
      setProducts(response);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h1>Product List</h1>
      {/* 아티스트 이름 입력 필드 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter artist name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={{ padding: "5px", width: "200px" }}
        />
        <button
          onClick={fetchProducts}
          style={{ padding: "5px 10px", marginLeft: "10px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "5px" }}
        >
          Search
        </button>
      </div>

      {/* 로딩 중일 때 표시 */}
      {isLoading && <div>Loading...</div>}

      {/* 상품 목록 */}
      {!isLoading && products.length > 0 && (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}

      {/* 상품이 없을 때 표시 */}
      {!isLoading && products.length === 0 && <div>No products found</div>}
    </div>
  );
};

export default ProductMainPage;
