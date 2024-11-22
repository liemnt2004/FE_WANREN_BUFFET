import React, { useEffect, useState } from "react";
import CardTableCashier from "./component/cardTableCashier";
import styled from "styled-components";
import axios from "axios";
import { fetchTables, Table } from "../../api/apiCashier/tableApi";

const ManagementTableCashier: React.FC = () => {
  // Đưa `useState` vào trong component
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const loadTables = async () => {
      const data = await fetchTables();
      setTables(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
    };

    loadTables();
  }, []);

  return (
    <StyledWrapper>
      {tables.map((table) => (
        <div className="d-flex justify-content-center" key={table.tableId}>
          <CardTableCashier
            key={table.tableId}
            tableNumber={table.tableNumber}
            status={
              table.tableStatus === "EMPTY_TABLE"
                ? "Trống"
                : table.tableStatus === "OCCUPIED_TABLE"
                ? "Có Khách"
                : table.tableStatus === "RESERVED_TABLE"
                ? "Đặt Trước"
                : "Không xác định"
            }
            style={table.location}
          />
        </div>
      ))}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

export default ManagementTableCashier;
