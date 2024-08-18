import React, { useState, useEffect } from "react";
import { merchandiseApi } from '../services/api';

interface Merchandise {
  merchandiseId: number;
  merchandiseName: string;
  thumbnail: string;
  price: number;
}

const MerchandiseList: React.FC<{
  communityId: number;
  merchandiseCategoryId: number;
}> = ({ communityId, merchandiseCategoryId }) => {
  const [merchandises, setMerchandises] = useState<Merchandise[]>([]);

  useEffect(() => {
    merchandiseApi
      .fetchMerchandises(communityId, merchandiseCategoryId)
      .then((response) => {
        setMerchandises(response.data.data);
      })
      .catch((error) => console.error(error));
  }, [communityId, merchandiseCategoryId]);

  return (
    <div>
      <h2>Merchandises</h2>
      <ul>
        {merchandises.map((merchandise) => (
          <li key={merchandise.merchandiseId}>
            <img src={merchandise.thumbnail} alt={merchandise.merchandiseName} />
            <p>{merchandise.merchandiseName}</p>
            <p>Price: {merchandise.price} 원</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MerchandiseList;
