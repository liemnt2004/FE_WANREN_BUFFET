import React, { ReactNode } from "react";
interface AdminLayoutProps {
  children: ReactNode;
}
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="container-fluid">{children}</div>;
}
