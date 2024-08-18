import React, { useState, useEffect } from "react";
import { merchandiseApi } from '../../services/api';

interface Category {
  categoryId: number;
  categoryName: string;
}

const CategoryList: React.FC<{ communityId: number }> = ({ communityId }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    merchandiseApi
      .fetchCategories(communityId)
      .then((response) => {
        setCategories(response.data.data.categories);
      })
      .catch((error) => console.error(error));
  }, [communityId]);

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.categoryId}>{category.categoryName}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
