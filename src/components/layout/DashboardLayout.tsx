import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

interface DashboardLayoutProps {
  activePath?: string;
  className?: string;
}

const DashboardLayout = ({ 
  activePath = "/", 
  className = "" 
}: DashboardLayoutProps) => {
  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <Sidebar activePath={activePath} />
      <main className="flex-1 overflow-auto">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 