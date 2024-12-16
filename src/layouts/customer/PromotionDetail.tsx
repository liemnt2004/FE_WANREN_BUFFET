import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PromotionModel from "../../models/PromotionModel";
import { GetPromotionById } from "../../api/apiCustommer/promotionApi";
import bannerHome from "./assets/img/Banner-Hompage-_1500W-x-700H_px.jpg";
import './assets/css/promotion_detail.css';
import { useTranslation } from 'react-i18next';
import { createVoucher } from "../../api/apiCustommer/voucherApi";
import { AuthContext, DecodedToken } from "./component/AuthContext";
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const PromotionDetail = () => {
  const token = localStorage.getItem('token');
  let decoded: DecodedToken | null = null;
  if (token) {
    decoded = jwtDecode<DecodedToken>(token);
  }

  console.log(Number(decoded?.userId));
  const { t } = useTranslation();
  const { id: promotionId } = useParams();
  const [promotion, setPromotion] = useState<PromotionModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [api, contextHolder] = notification.useNotification();
  const [isHasVoucher, setIsHasVoucher] = useState<boolean>(false);
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
    const fetchPromotionVouchers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:8080/api/vouchers/voucherInfo/${Number(decoded?.userId)}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const vouchers = response.data; // Mảng dữ liệu từ API
        const hasVoucher = vouchers.some(
          (voucher: { promotionId: number; customerId: number }) =>
            voucher.promotionId === Number(promotionId) &&
            voucher.customerId === Number(decoded?.userId)
        );

        console.log(vouchers)

        if (hasVoucher) {
          setIsHasVoucher(true);
        }
      } catch (err) {
      }
    };
    fetchPromotionVouchers();
  }, [decoded?.userId, token]);

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
      setIsHasVoucher(true);
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
      <div className="ps36231-promotion-detail mt-5 mb-5" style={{ padding: '0 200px' }}>
        <div className="container">
          <div className="inner-container">
            <div className="row">
              <div className="control-img col-12 col-md-6">
                <div className="container-img">
                  <img
                    src={promotion.image || "https://via.placeholder.com/150"}
                    alt={promotion.promotionName || t('promotionDetail.defaultAlt')}
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="all-infor-time col-12 col-md-6">
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
                <div className="btn-get-promotion text-center">
                  {
                    !Number.isNaN(Number(decoded?.userId)) && (
                      <button disabled={isHasVoucher} onClick={() => createV(Number(decoded?.userId), Number(promotionId))}>Nhận Voucher Ngay</button>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="row content">
              <div dangerouslySetInnerHTML={{ __html: promotion.description }}></div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromotionDetail;
