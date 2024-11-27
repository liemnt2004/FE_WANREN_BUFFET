import React, { useEffect, useState } from "react";
import CardTableCashier from "./component/cardTableCashier";
import styled from "styled-components";
import axios from "axios";
import { fetchTables, Table } from "../../api/apiCashier/tableApi";

const ManagementTableCashier: React.FC = () => {
  // Đưa `useState` vào trong component
  const [tables, setTables] = useState<Table[]>([]);

  const [foodTable, setFoodTable] = useState<Table | null>(null);

  const [swapTable, setSwapTable] = useState<Table | null>(null);

  const [splitTable, setSplitTable] = useState<Table | null>(null);

  const [combineTable, setCombineTable] = useState<Table | null>(null);

  useEffect(() => {
    const loadTables = async () => {
      const data = await fetchTables();
      setTables(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
    };

    loadTables();
  }, []);

  const openFoodTable = (table: Table) => {
    setFoodTable(table);
  };
  const closeFoodTable = () => {
    setFoodTable(null);
  };

  const openSwapTable = (table: Table) => {
    setSwapTable(table);
  };
  const closeSwapTable = () => {
    setSwapTable(null);
  };

  const openSplitTable = (table: Table) => {
    setSplitTable(table);
  };
  const closeSplitTable = () => {
    setSplitTable(null);
  };

  const openCombineTable = (table: Table) => {
    setSwapTable(table);
  };
  const closeCombineTable = () => {
    setCombineTable(null);
  };

  return (
    <div>
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
              location={table.location}
              foodTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openFoodTable(table)
                    : alert("Bàn này trống");
                }
              }}
              swapTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openSwapTable(table)
                    : alert("Bàn này trống");
                }
              }}
              splitTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openSplitTable(table)
                    : alert("Bàn này trống");
                }
              }}
              combineTable={() => {
                {
                  table.tableStatus === "OCCUPIED_TABLE"
                    ? openCombineTable(table)
                    : alert("Bàn này trống");
                }
              }}
            />
          </div>
        ))}
      </StyledWrapper>

      {foodTable && (
        <PopupOverlay onClick={closeFoodTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            this is popup food table
          </PopupCard>
        </PopupOverlay>
      )}

      {swapTable && (
        <PopupOverlay onClick={closeSwapTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            this is popup swap table
          </PopupCard>
        </PopupOverlay>
      )}

      {splitTable && (
        <PopupOverlay onClick={closeSplitTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            this is popup split table
          </PopupCard>
        </PopupOverlay>
      )}

      {combineTable && (
        <PopupOverlay onClick={closeCombineTable}>
          <PopupCard onClick={(e) => e.stopPropagation()}>
            this is popup combine table
          </PopupCard>
        </PopupOverlay>
      )}
    </div>
  );
};

const PopupCard = styled.div`
  background-color: #f7f7f1;
  padding: 20px;
  border-radius: 8px;
  width: 75%;
  height: 85vh;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
`;

export default ManagementTableCashier;
