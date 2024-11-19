import React from 'react';

const TableModal: React.FC = () => {
  return (
    <div
      className="modal fade"
      id="tableModal"
      tabIndex={-1}
      aria-labelledby="tableModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="tableModalLabel">Thông tin khách hàng</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="guestForm">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="adultCount" className="form-label">Người lớn</label>
                    <input
                      type="number"
                      defaultValue={1}
                      className="form-control"
                      id="adultCount"
                      placeholder="Nhập số lượng người lớn"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="childCount" className="form-label">Trẻ em</label>
                    <input
                      type="number"
                      className="form-control"
                      id="childCount"
                      placeholder="Nhập số lượng trẻ em"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <a href="order.html" type="submit" className="btn btn-danger">Xác nhận</a>
          </div>
          <div className="modal-banner"></div>
          <img src="assets/img/cothaygia_t11.png" alt="" style={{ borderRadius: '10px' }} />
        </div>
      </div>
    </div>
  );
};

export default TableModal;
