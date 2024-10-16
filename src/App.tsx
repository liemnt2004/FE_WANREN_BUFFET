import React from 'react';
import logo from './logo.svg';
import './App.css';

import IndexCustomer from "./layouts/customer/indexCustomer";
import MenuCustomer from "./layouts/customer/menuCustomer";
import {getAll} from "./api/productApi";


function App() {
    getAll()
  return (
    <div className="App">
        <MenuCustomer/>
        <IndexCustomer></IndexCustomer>
    </div>
  );
}

export default App;
