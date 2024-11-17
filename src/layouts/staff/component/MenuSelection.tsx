import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

const menuItems: MenuItem[] = [
  { id: 1, name: 'Dish 1', price: 50000 },
  { id: 2, name: 'Dish 2', price: 75000 },
  { id: 3, name: 'Dish 3', price: 60000 },
  // Add more items as needed
];

const MenuSelection: React.FC = () => {
  const location = useLocation();
  const { tableNumber, adults, children } = location.state || {};
  const [selectedItems, setSelectedItems] = useState<{ [key: number]: number }>({});

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleConfirmSelection = () => {
    console.log('Selected Items:', selectedItems);
    // Navigate to next page or handle order confirmation here
  };

  return (
    <div className="container mt-4">
      <h3>Menu Selection for Table {tableNumber}</h3>
      <p>Adults: {adults} | Children: {children}</p>

      <div className="row">
        {menuItems.map((item) => (
          <div className="col-md-4 mb-3" key={item.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Price: {item.price.toLocaleString()}đ</p>
                <input
                  type="number"
                  min="0"
                  placeholder="Quantity"
                  value={selectedItems[item.id] || 0}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary mt-4" onClick={handleConfirmSelection}>
        Confirm Selection
      </button>
    </div>
  );
};

export default MenuSelection;
