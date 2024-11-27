import React, { useEffect, useState } from "react";
import CardTableCashier from "./component/cardTableCashier";
import styled from "styled-components";
import axios from "axios";
import { fetchTables, Table } from "../../api/apiCashier/tableApi";
import {
  Reservation,
  fetchReservations,
} from "../../api/apiCashier/reservationApi";
import CardReservationCashier from "./component/cardReservationCashier";

const ManagementReservationCashier: React.FC = () => {
  // Đưa `useState` vào trong component
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const loadReservations = async () => {
      const data = await fetchReservations();
      setReservations(data); // Đảm bảo đúng đường dẫn `_embedded.tables`
    };

    loadReservations();
  }, []);

  return (
    <StyledWrapper>
      {reservations.map((reservation) => (
        <div
          className="d-flex justify-content-center"
          key={reservation.reservationId}
        >
          <CardReservationCashier
            key={reservation.reservationId}
            reservationId={reservation.reservationId}
            status={"Trống"}
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

export default ManagementReservationCashier;
