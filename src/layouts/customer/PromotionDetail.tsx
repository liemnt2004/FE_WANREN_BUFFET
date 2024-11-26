import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PromotionModel from "../../models/PromotionModel";
import { GetPromotionById } from "../../api/apiCustommer/promotionApi";
import bannerHome from "./assets/img/Banner-Hompage-_1500W-x-700H_px.jpg";
import './assets/css/promotion_detail.css'

const PromotionDetail = () => {
  const { id: promotionId } = useParams(); // Destructure to get the ID directly
  const [promotion, setPromotion] = useState<PromotionModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await GetPromotionById(Number(promotionId));
        setPromotion(response);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch promotion details.");
        setLoading(false);
      }
    };

    if (promotionId) {
      fetchPromotion();
    }
  }, [promotionId]);

  const calculateDaysRemaining = (endDate: string | Date): number => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!promotion) {
    return <div className="container">No promotion data available.</div>;
  }

  return (
    <div className="ps36231-promotion-detail mt-5 mb-5">
      <div className="container">
        <div className="inner-container">
          {/* Header Section */}
          <div className="row">
            {/* Image Section */}
            <div className="control-img col-12 fix-col-12 col-md-6">
              <div className="container-img">
                <img
                  src={bannerHome || "https://via.placeholder.com/150"} // Replace with actual image property if available
                  alt={promotion.promotionName || "Promotion Image"}
                  className="img-fluid"
                />
              </div>
            </div>

            {/* Information and Time Section */}
            <div className="all-infor-time col-12 col-md-6 mt-32">
              <h1>{promotion.promotionName}</h1>
              <table className="w-100">
                <tbody>
                  <tr className="first-tr-in-table">
                    <th>Kết thúc sau:</th>
                    <td>
                      <div>22:11:00</div>{" "}
                      {/* You might want to dynamically calculate time left */}
                    </td>
                  </tr>
                  <tr>
                    <th>Thời gian áp dụng:</th>
                    <td>
                      {new Date(promotion.startDate).toLocaleDateString()} -{" "}
                      {new Date(promotion.endDate).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <th>Hết hạn sau:</th>
                    <td>{calculateDaysRemaining(promotion.endDate)} ngày</td>
                  </tr>
                </tbody>
              </table>
              <div className="btn-get-promotion">
                <button>Nhận mã ngay</button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="row content">
            <h2 className="mb-2">Nội dung chương trình</h2>
            <div>
              <p>
                <span>{promotion.description}</span>
              </p>
            </div>

            <h2 className="mt-2 mb-2">Điều kiện áp dụng</h2>
            <div>
              {/* Display other conditions if available */}
              <p>
                {/* Replace with actual terms/conditions if available */}
                <span>- Example condition here</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetail;
