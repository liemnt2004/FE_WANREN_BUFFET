import React, { useState, useEffect, useContext } from "react";

import client from "../../../api/apiCustommer/client";
import { EntrySkeletonType, Asset } from 'contentful';
import { title } from "process";
import { url } from "inspector";
// Cập nhật kiểu dữ liệu của banner
interface BannerFields {
    title: string;
    image?: Asset; // Asset chứa dữ liệu về hình ảnh
    link?: string; // Link có thể không tồn tại
  }
  
  interface BannerEntry extends EntrySkeletonType {
    fields: BannerFields;
    contentTypeId: 'banner'; // Xác định Content Type là "banner"
  }
  
  interface BannerData {
    title: string;
    image: string | null; // URL hình ảnh hoặc null
    link: string | null; // URL liên kết hoặc null
  }
const Banner: React.FC = ()=>{
    const [banners, setBanners] = useState<string[]>([]);

    useEffect(() => {
      client
        .getEntries<BannerEntry>({ content_type: 'banner' })
        .then((response) => {
          // Kiểm tra nếu có tài sản trong response.includes.Asset
          if (response.includes?.Asset) {
            const bannerUrls = response.includes.Asset
              .map((asset) => asset.fields.file?.url) // Lấy URL từ từng tài sản
              .filter((url): url is string => url !== undefined);  
            setBanners(bannerUrls); // Cập nhật state với danh sách các URL hợp lệ
            
          }
        })
        .catch((err) => {
          console.error('Error fetching banners:', err);
        });
    }, []);
    return(
        <section className="banner">
  <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-indicators">
      {banners.length > 0 &&
        banners.map((banner, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : 'false'}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
    </div>

    <div className="carousel-inner">
      {banners.length > 0 &&
        banners.map((banner, index) => (
          <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
            <img src={banner} className="d-block w-100 img-fluid" alt={`Banner ${index + 1}`} />
          </div>
        ))}
    </div>

    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleIndicators"
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>

    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleIndicators"
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
</section>
    )
}

export default Banner;