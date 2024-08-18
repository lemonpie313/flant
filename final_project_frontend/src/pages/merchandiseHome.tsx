import React from "react";
import CategoryList from "../components/categoryList";
import MerchandiseList from "../components/merchandiseList";

const MerchandiseHome: React.FC = () => {
  const communityId = 1; // 예시로 커뮤니티 ID를 설정

  return (
    <div>
      <h1>Goods Shop</h1>
      <CategoryList communityId={communityId} />
      <MerchandiseList communityId={communityId} merchandiseCategoryId={1} />
    </div>
  );
};

export default MerchandiseHome;