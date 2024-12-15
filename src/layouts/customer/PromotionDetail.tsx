import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PromotionModel from "../../models/PromotionModel";
import { GetPromotionById } from "../../api/apiCustommer/promotionApi";
import bannerHome from "./assets/img/Banner-Hompage-_1500W-x-700H_px.jpg";
import './assets/css/promotion_detail.css';
import { useTranslation } from 'react-i18next';
import { createVoucher } from "../../api/apiCustommer/voucherApi";
import { AuthContext } from "./component/AuthContext";
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const PromotionDetail = () => {
  const { userId } = useContext(AuthContext);
  const { t } = useTranslation();
  const { id: promotionId } = useParams();
  const [promotion, setPromotion] = useState<PromotionModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message: string, description: string, icon: React.ReactNode, pauseOnHover: boolean = true) => {
    api.open({
      message,
      description,
      showProgress: true,
      pauseOnHover,
      placement: 'topRight',
      duration: 3,
      icon,
    });
  };

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await GetPromotionById(Number(promotionId));
        setPromotion(response);
        setLoading(false);
      } catch (err) {
        setError(t('promotionDetail.errorFetch'));
        setLoading(false);
      }
    };

    if (promotionId) {
      fetchPromotion();
    }
  }, [promotionId, t]);

  const createV = async (customerId: number, promotionId: number) => {
    try {
      const reponse = await createVoucher(customerId, promotionId);
      console.log(reponse);

      openNotification(
        'Voucher',
        'Nhận Voucher thành công!',
        <CheckCircleOutlined style={{ color: '#52c41a' }} />
      );
    } catch (error) {

    }
  }



  const calculateDaysRemaining = (endDate: string | Date): number => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) return <div>{t('promotionDetail.loading')}</div>;
  if (error) return <div>{t('promotionDetail.error')}: {error}</div>;

  if (!promotion) {
    return <div className="container">{t('promotionDetail.noData')}</div>;
  }

  return (
    <>
    {contextHolder}
      <div className="p36231-promotion-details">
        <div className="container">
          <div className="inner-container">
            {/* Header Section */}
            <div className="row">
              {/* Image Section */}
              <div className="control-img col-12 fix-col-12 col-md-6">
                <div className="container-img">
                  <img
                    src={promotion.image || "https://via.placeholder.com/150"}
                    alt={promotion.promotionName || t('promotionDetail.defaultAlt')}
                    className="img-fluid"
                  />
                </div>
              </div>

              {/* Information and Time Section */}
              <div className="all-infor-time col-12 col-md-6 mt-32">
                <h1>{promotion.promotionName}</h1>
                <table className="w-100">
                  <tbody>
                    <tr>
                      <th>{t('promotionDetail.applyTime')}:</th>
                      <td>
                        {new Date(promotion.startDate).toLocaleDateString()} -{" "}
                        {new Date(promotion.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <th>{t('promotionDetail.expireIn')}:</th>
                      <td>{calculateDaysRemaining(promotion.endDate)} {t('promotionDetail.days')}</td>
                    </tr>
                  </tbody>
                </table>
                {
                  userId !== null && (
                    <button className="btn btn-danger my-3" onClick={() => createV(Number(userId), Number(promotionId))}>Nhận Voucher</button>
                  )
                }
              </div>
            </div>

            {/* Content Section */}
            <div className="row content">
              <h2 className="mb-2">{t('promotionDetail.programContent')}</h2>
              <div>
                <p>
                  <span dangerouslySetInnerHTML={{ __html: promotion.description }}></span>
                </p>
              </div>

              <h2 className="mt-2 mb-2">{t('promotionDetail.conditions')}</h2>
              <div>
                <p>
                  <span>{t('promotionDetail.conditionText', { foodType: promotion.type_food })}</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PromotionDetail;
