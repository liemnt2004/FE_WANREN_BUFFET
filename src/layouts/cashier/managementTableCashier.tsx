import React, { useEffect, useState } from "react";
import CardTableCashier from "./component/cardTableCashier";
import styled from "styled-components";
import axios from "axios";

type Table = {
  createdDate: string;
  updatedDate: string | null;
  tableId: number;
  tableNumber: number;
  tableStatus: string;
  location: string;
};

const ManagementTableCashier: React.FC = () => {
  // Đưa `useState` vào trong component
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Table');
        setTables(response.data._embedded.tablees); // Đảm bảo đúng đường dẫn `_embedded.tables`
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchTables();
  }, []);

  return (
    <StyledWrapper>
      {tables.map((table) => (
        <CardTableCashier
          key={table.tableId}
          tableNumber={table.tableNumber}
          status={
            table.tableStatus === "EMPTY_TABLE" ? "Trống" :
            table.tableStatus === "OCCUPIED_TABLE" ? "Có Khách" :
            table.tableStatus === "RESERVED_TABLE" ? "Đặt Trước" : "Không xác định"
        }
          style={table.location}
        />
      ))}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 thẻ trên mỗi hàng */
  gap: 20px; /* Khoảng cách giữa các thẻ */
  margin: 20px; /* Khoảng cách từ viền ngoài */

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Khi màn hình nhỏ, mỗi hàng chỉ có 1 thẻ */
  }
`;

export default ManagementTableCashier;
