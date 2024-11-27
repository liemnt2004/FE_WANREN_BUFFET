import React from "react";
import { Outlet } from "react-router-dom";
import MenuAdmin from "./menuAdmin";

const StaffLayout: React.FC = () => {
  return (
    <>
      <MenuAdmin />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default StaffLayout;
