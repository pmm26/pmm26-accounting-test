import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import CreateInvoiceFormConnected from "./CreateInvoiceFormConnected";
import { ChevronLeft } from "lucide-react";

interface CreateInvoicePageProps {
  className?: string;
}

const CreateInvoicePage = ({ className = "" }: CreateInvoicePageProps) => {
  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <Sidebar activePath="/invoices" />
      <main className="flex-1 overflow-auto">
        <Topbar />

        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Create New Invoice</h1>
          </div>

          <CreateInvoiceFormConnected />
        </div>
      </main>
    </div>
  );
};

export default CreateInvoicePage;
