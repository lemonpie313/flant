import React from "react";
import { useParams } from "react-router-dom";
import MerchandiseDetail from "../components/merchandiseDetail";

const MerchandiseDetailPage: React.FC = () => {
  const { merchandiseId } = useParams<{ merchandiseId: string }>();

  return (
    <div>
      <h1>Merchandise Detail</h1>
      <MerchandiseDetail merchandiseId={parseInt(merchandiseId || "0", 10)} />
    </div>
  );
};

export default MerchandiseDetailPage;