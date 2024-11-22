import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import banerPrice from '../assets/img/cothaygia_t11.png';
import { Tables } from '../../../models/StaffModels/Tables';

const TableModal: React.FC<{
  table: Tables | null;
  onClose: () => void;
  onConfirm: (tableId: number, tableNumber: number, adults: number, children: number) => void;
}> = ({ table, onClose, onConfirm }) => {
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  const handleConfirm = () => {
    if (table) {
      onConfirm(table.tableId, table.tableNumber, adults, children);
    }
    onClose();
  };

  if (!table) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between">
            <h5 className="modal-title">Thông tin khách hàng</h5>
            <button type="button" className="close" onClick={onClose}>
              <span className="fs-3">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <label>Số lượng người lớn:</label>
                <input
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="form-control"
                  min="1"
                />
              </div>
              <div className="col-md-6">
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
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button type="button" className="btn btn-danger" onClick={handleConfirm}>
              Xác nhận
            </button>
          </div>
          <div className="modal-banner">
            <img src={banerPrice} alt="" style={{ borderRadius: '10px' }} />
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:8080/Table?page=0&size=50');
        const data = await response.json();
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

    fetchTables();
  }, []);

  const filteredTables = tables.filter((table) => {
    // Lọc bàn theo location
    if (table.location === 'GDeli') {
      return area === 'gdeli';
    } else if (table.location === 'Table') {
      // Chia bàn số theo tầng
      if (area === 'home') return table.tableNumber <= 25;
      if (area === '2nd_floor') return table.tableNumber > 25 && table.tableNumber <= 50;
    }
    return false; // Không hiển thị bàn ngoài điều kiện
  });

  const handleCheckout = async (tableId: number) => {
    try {
      const responseOrderId = await fetch(`http://localhost:8080/api/order_staff/findOrderIdByTableId/${tableId}`);
      if (!responseOrderId.ok) throw new Error('Error fetching orderId');

      const orderIdText = await responseOrderId.text();
      const orderId = orderIdText ? Number(orderIdText) : null;

      if (orderId !== null) {
        // Navigate to checkout page with the fetched orderId
        navigate(`/checkout/order/${orderId}/step1`);
      } else {
        console.error('No orderId found for this table');
      }
    } catch (error) {
      console.error('Error fetching orderId:', error);
    }
  };

  const handleTableClick = (table: Tables) => {
    if (table.tableStatus === 'EMPTY_TABLE') {
      setSelectedTable(table);
      setShowModal(true);
    } else {
      // Directly navigate to the order page for non-empty tables
      navigate(`/orderOnTable/${table.tableId}`, { state: { adults: 2, children: 0, tableLocation: table.location } });
    }
  };

  const handleTransferTable = (orderId: number, newTableId: number) => {
    // Gọi API chuyển bàn và cập nhật thông tin
    console.log(`Chuyển đơn hàng ${orderId} sang bàn ${newTableId}`);
    // Sau khi chuyển bàn, cập nhật trạng thái bàn hoặc điều hướng
  };

  const handleConfirm = (tableId: number, tableNumber: number, adults: number, children: number) => {
    if (tableNumber > 0 && adults > 0) { // Ensure at least one adult is selected
      console.log(`TableNumber: ${tableNumber}, Adults: ${adults}, Children: ${children}`);

      // Navigate to the menu selection page with the table number and location in the URL path
      navigate(`/orderOnTable/${tableId}`, { state: { adults, children, tableLocation: selectedTable?.location } });
    } else {
      alert("Please enter valid numbers for adults and children.");
    }
  };

  if (loading) {
    return <div style={{ paddingLeft: '20px' }}>Loading...</div>;
  }

  return (
    <div className="row" style={{ paddingLeft: '20px', width: '100%' }}>
      {filteredTables.length > 0 ? (
        filteredTables.map((table) => (
          <div className="col-md-3" key={table.tableId} onClick={() => handleTableClick(table)}>
            <div className={`card table-card ${table.tableStatus === 'EMPTY_TABLE' ? '' : 'table-card-active'}`}>
              <div className="card-body">
                <h5 className="card-title text-center">Bàn {table.tableNumber} <span style={{ fontWeight: 'bold' }}>{table.location === 'GDeli' ? '(Deli)' : ''}</span> </h5>
                {table.tableStatus !== 'EMPTY_TABLE' && (
                  <>
                    <p className="table-status">2h14'</p>
                    <p key={table.tableId} onClick={() => handleCheckout(table.tableId)} className="btn btn-danger rounder-0 mt-4">Thanh toán</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No tables available</div>
      )}
      {showModal && (
        <TableModal
          table={selectedTable}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default TableList;
