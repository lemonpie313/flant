import React, { useState, useEffect } from "react";
import { merchandiseApi } from '../services/api';

interface MerchandiseDetailProps {
  merchandiseId: number;
}

const MerchandiseDetail: React.FC<MerchandiseDetailProps> = ({ merchandiseId }) => {
  const [merchandise, setMerchandise] = useState<any>(null);

  useEffect(() => {
    merchandiseApi
      .fetchMerchandiseDetail(merchandiseId)
      .then((response) => setMerchandise(response.data.data))
      .catch((error) => console.error(error));
  }, [merchandiseId]);

  if (!merchandise) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{merchandise.merchandiseName}</h2>
      <img src={merchandise.thumbnail} alt={merchandise.merchandiseName} />
      <p>{merchandise.content}</p>
      <p>Price: {merchandise.price} 원</p>
    </div>
  );
};

export default MerchandiseDetail;
