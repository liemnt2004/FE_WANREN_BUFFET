import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tables } from '../../../models/StaffModels/Tables';
import { fetchOrderIdByTableId, fetchReservations, fetchTables, updateReservationStatus } from '../../../api/apiStaff/orderForStaffApi';
import { notification } from 'antd';
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
interface Reservation {
  reservationId: number;
  userId: number;
  customerId: number;
  numberPeople: number;
  dateToCome: string;
  timeToCome: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  note: string;
  status: string;
}

const TableModal: React.FC<{
  table: Tables | null;
  onClose: () => void;
  onConfirm: (tableId: number, tableNumber: number, adults: number, children: number, tableLocation: string) => void;
}> = ({ table, onClose, onConfirm }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [reID, setReID] = useState<number | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const data = await fetchReservations();

        // Lọc các đặt chỗ có trạng thái "APPROVED"
        const approvedReservations = data.filter(
          (reservation: { status: string }) => reservation.status === "APPROVED"
        );

        // Sắp xếp theo thời gian đến
        const sortedReservations = approvedReservations.sort(
          (a: { timeToCome: string }, b: { timeToCome: string }) => {
            // Chuyển đổi "HH:mm:ss" thành số mili giây kể từ đầu ngày
            const timeA = convertTimeToMilliseconds(a.timeToCome);
            const timeB = convertTimeToMilliseconds(b.timeToCome);
            return timeA - timeB;
          }
        );

        setReservations(sortedReservations);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, []);

  // Hàm chuyển đổi "HH:mm:ss" thành mili giây
  const convertTimeToMilliseconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600000 + minutes * 60000 + seconds * 1000; // Tổng số mili giây
  };



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleRowClick = async (reservation: Reservation, index: number) => {
    setAdults(reservation.numberPeople || 1);
    setChildren(0);
    if (selectedRowIndex === index) {
      setSelectedRowIndex(null);
      setReID(null);
    } else {
      setSelectedRowIndex(index);
      setReID(reservation.reservationId);
    }
  };

  const handleConfirm = (reservationId: number) => {
    if (table) {
      onConfirm(table.tableId, table.tableNumber, adults, children, table.location);
      if (reservationId) {
        updateReservationStatus(reservationId, "SEATED");
      }
    }
    onClose();
  };



  if (!table) return null;

  return (
    <div className="modal modal-lg fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" style={{ maxWidth: '800px' }}>
          {/* Modal Header */}
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title">Thông tin khách hàng</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {/* Section: Thông tin */}
            <h6 className="mb-3">Thông tin đặt bàn</h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Số lượng người lớn:</label>
                <input
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="form-control"
                  min="1"
                  autoFocus
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Số lượng trẻ em:</label>
                <input
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="form-control"
                  min="0"
                />
              </div>
            </div>

            {/* Section: Danh sách đặt bàn */}
            <h6 className="mb-3">
              Danh sách đặt bàn ngày:{" "}
              <span>
                {new Intl.DateTimeFormat("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date())}
              </span>
            </h6>
            <div style={{ overflowY: 'auto', maxHeight: '250px' }}>
              <table className="table">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                  <tr>
                    <th>Họ Tên</th>
                    <th>SĐT</th>
                    <th>Thời Gian</th>
                    <th>Số Người</th>
                    <th>Ghi Chú</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length > 0 ? (
                    reservations.map((reservation, index) => (
                      <tr
                        key={index}
                        onClick={() => handleRowClick(reservation, index)}
                        className={index === selectedRowIndex ? "table-danger" : ""}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ width: "30%" }}>{reservation.fullName}</td>
                        <td>{reservation.phoneNumber}</td>
                        <td>{reservation.timeToCome}</td>
                        <td>{reservation.numberPeople}</td>
                        <td style={{ width: '200px', whiteSpace: "normal", wordWrap: "break-word" }}>
                          {reservation.note}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="modal-footer text-end">
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Đóng
            </button>
            <button type="button" className="btn btn-danger btn-danger-active" onClick={() => handleConfirm(Number(reID))}>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

interface TableListProps {
  area: 'home' | '2nd_floor' | 'gdeli';
}

const TableList: React.FC<TableListProps> = ({ area }) => {
  const [tables, setTables] = useState<Tables[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTable, setSelectedTable] = useState<Tables | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<number>();
  const navigate = useNavigate();
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
    const fetchTable = async () => {
      try {
        const data = await fetchTables();
        if (data && data._embedded && data._embedded.tablees) {
          setTables(data._embedded.tablees);
        } else {
          console.error('Unexpected response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, []);


  const filteredTables = tables.filter((table) => {
    if (table.location === 'GDeli') {
      return area === 'gdeli';
    } else if (table.location === 'Table') {
      if (area === 'home') return table.tableNumber <= 25;
      if (area === '2nd_floor') return table.tableNumber > 25 && table.tableNumber <= 50;
    }
    return false;
  });

  const handleCheckoutStep = async (tableId: number, step: number, tableNumber: number) => {
    try {

      const orderId = await fetchOrderIdByTableId(tableId);

      if (orderId !== null) {
        navigate(`/staff/checkout/step${step}`, { state: { tableId: tableId, orderId: orderId, orderTableNum: tableNumber} });
      } else {
      }
    } catch (error) {
    }
  };

  const handleTableClick = (table: Tables) => {
    if (table.tableStatus === 'EMPTY_TABLE') {
      setSelectedTable(table);
      setShowModal(true);
    } else if (table.tableStatus === 'PAYING_TABLE') {
      handleCheckoutStep(table.tableId, 3, table.tableNumber);
    } else if (table.tableStatus === 'LOCKED_TABLE') {
      openNotification(
        'Bàn khóa',
        'Bàn đang khóa bởi nhân viên!',
        <InfoCircleOutlined style={{ color: '#1890ff' }} />
      );
    } else {
      navigate(`/orderOnTable`, { state: { tableId: table.tableId, tableNumber: table.tableNumber, adults: 2, children: 0, tableLocation: table.location } });
    }
  };

  const handleConfirm = (tableId: number, tableNumber: number, adults: number, children: number) => {
    if (!selectedTable) {
      alert("No table selected.");
      return;
    }

    if (tableNumber > 0 && adults > 0) {
      console.log(`TableNumber: ${tableId}, Adults: ${adults}, Children: ${children}`);
      navigate(`/orderOnTable`, {
        state: { tableId: tableId, tableNumber, adults, children, tableLocation: selectedTable.location },
      });
    } else {
    }
  };

  if (loading) {
    return <div style={{ paddingLeft: '20px' }}>Loading...</div>;
  }

  return (
    <>
      {contextHolder}
      <div className="row" style={{ paddingLeft: '20px', width: '100%' }}>
        {filteredTables.length > 0 ? (
          filteredTables.map((table) => (
            <div className="col-6 col-md-3" key={table.tableId} onClick={() => handleTableClick(table)}>
              <div className={`card table-card position-relative ${table.tableStatus === 'EMPTY_TABLE' ? '' : 'table-card-active'}`}>
                {table.tableStatus === 'LOCKED_TABLE' && (
                  <>
                    <p className="position-absolute translate-middle" style={{ top: '10px', right: '-25px' }}>
                      <i className="bi bi-shield-lock-fill fs-3 text-danger"></i>
                    </p>
                  </>)
                }
                {table.tableStatus === 'PAYING_TABLE' && (
                  <>
                    <p className="position-absolute translate-middle" style={{ top: '10px', right: '-25px' }}>
                      <i className="bi bi-credit-card-2-front-fill fs-3 text-danger"></i>
                    </p>
                  </>)
                }
                <div className="card-body">
                  <h5 className="card-title text-center">Bàn {table.tableNumber} <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>{table.location === 'GDeli' ? '(Deli)' : ''}</span> </h5>
                  {table.tableStatus !== 'EMPTY_TABLE' && table.tableStatus !== 'LOCKED_TABLE' && table.tableStatus !== 'PAYING_TABLE' && (
                    <>
                      <p className="table-status">{table.tableStatus === 'OCCUPIED_TABLE' && ('2h05')}</p>
                      <p key={table.tableId} onClick={() => handleCheckoutStep(table.tableId, 1, table.tableNumber)} className="btn btn-danger rounder-0 mt-4">Thanh toán</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{color: 'var(--text-color)'}}>Không có dữ liệu</div>
        )}
        {showModal && (
          <TableModal
            table={selectedTable}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </>
  );
};

export default TableList;
