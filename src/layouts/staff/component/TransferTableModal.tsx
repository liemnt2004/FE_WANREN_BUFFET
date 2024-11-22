import React, { useState, useEffect } from 'react';
import { Tables } from '../../../models/StaffModels/Tables';
import { fetchOrderIdByTableId } from '../../../api/apiStaff/orderForStaffApi';

const TransferTableModal: React.FC<{
    currentTableId: number | null;  // Thay currentTable thành currentTableId
    onClose: () => void;
    onTransfer: (orderId: number, newTableId: number) => void;
}> = ({ currentTableId, onClose, onTransfer }) => {
    const [tables, setTables] = useState<Tables[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [orderId, setOrderId] = useState<number>();
    const [selectedFloor, setSelectedFloor] = useState<'floor1' | 'floor2'>('floor1'); // Trạng thái để chọn khu vực
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleOpenModal = () => {
        if (!selectedTableId) {
            alert('Vui lòng chọn bàn mới để chuyển!');
            return;
        }
        setIsModalOpen(true);
    };

    const handleExitModal = async () => {
        setIsModalOpen(false);
    };

    const filterTablesByFloor = (floor: 'floor1' | 'floor2') => {
        if (floor === 'floor1') {
            return tables.filter((table) => table.tableNumber <= 25);
        } else {
            return tables.filter((table) => table.tableNumber > 25 && table.tableNumber <= 50);
        }
    };

    const filteredTables = filterTablesByFloor(selectedFloor);

    useEffect(() => {
        const fetchAvailableTables = async () => {
            try {
                const response = await fetch('http://localhost:8080/Table?page=0&size=50');
                const data = await response.json();
                if (data && data._embedded && data._embedded.tablees) {
                    setTables(data._embedded.tablees.filter((table: { tableStatus: string; }) => table.tableStatus === 'EMPTY_TABLE'));
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailableTables();
    }, []);

    useEffect(() => {
        const fetchOrderId = async () => {
            try {
                const orderId = await fetchOrderIdByTableId(Number(currentTableId));
                if (orderId) {
                    setOrderId(orderId);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrderId();
    }, []);

    const handleSaveChanges = () => {
        const currentPassword = '123';

        if (passwordInput === currentPassword) {
            handleTransfer();
            setIsModalOpen(false);
            setErrorMessage('');
        } else {
            setErrorMessage('Mật khẩu không chính xác');
        }
    };

    const handleTransfer = async () => {
        if (currentTableId && selectedTableId !== null && currentTableId !== selectedTableId) {
            try {
                const response = await fetch(`http://localhost:8080/api/order_staff/${orderId}/transfer`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        newTableId: selectedTableId,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Error transferring table');
                }

                onTransfer(Number(orderId), selectedTableId);
                onClose();
            } catch (error) {
                console.error('Error transferring table:', error);
                alert('Có lỗi xảy ra khi chuyển bàn!');
            }
        } else {
            alert('Vui lòng chọn bàn mới để chuyển!');
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
            {isModalOpen && (
                <div className="ps36231 modal fade show d-block" id="modalPin" tabIndex={-1} role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-4 text-center">
                            <h5>Nhập mật khẩu nhân viên để tiếp tục</h5>
                            <div className="input-field">
                                <input
                                    type="password"
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Mật khẩu"
                                />
                                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </div>
                            <div className='d-flex justify-content-center align-items-center mt-2'>
                                <button className="btn btn-secondary mt-2 me-4" onClick={handleExitModal}>Hủy</button>
                                <button onClick={handleSaveChanges} className="btn btn-primary mt-2">Xác nhận</button>
                            </div>

                        </div>
                    </div>
                    <div className="modal-backdrop fade show" onClick={onClose}></div>
                </div>
            )}
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">Chuyển Bàn</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span className="fs-3">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Bàn hiện tại: <span className='fw-bold'> Bàn {currentTableId}</span></p>
                        <h6>Chọn khu vực để chuyển tới:</h6>
                        <div className="d-flex">
                            <div className="form-check me-2">
                                <input
                                    type="radio"
                                    id="floor1"
                                    name="floor"
                                    value="floor1"
                                    checked={selectedFloor === 'floor1'}
                                    onChange={() => setSelectedFloor('floor1')}
                                    className="form-check-input"
                                />
                                <label htmlFor="floor1" className="form-check-label">Tầng 1</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="floor2"
                                    name="floor"
                                    value="floor2"
                                    checked={selectedFloor === 'floor2'}
                                    onChange={() => setSelectedFloor('floor2')}
                                    className="form-check-input"
                                />
                                <label htmlFor="floor2" className="form-check-label">Tầng 2</label>
                            </div>
                        </div>
                        <h6 className='mt-3'>Chọn bàn cần chuyển tới:</h6>
                        <select
                            className="form-select"
                            aria-label="Select a table"
                            value={selectedTableId || ''}
                            onChange={(e) => setSelectedTableId(Number(e.target.value))}
                        >
                            <option value="">Chọn bàn</option>
                            {filteredTables.map((table) => (
                                <option key={table.tableId} value={table.tableId}>
                                    Bàn {table.tableNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleOpenModal}>
                            Chuyển bàn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferTableModal;