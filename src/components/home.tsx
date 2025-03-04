import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import InvoiceList from "./dashboard/InvoiceList";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeProps {
  className?: string;
}

const Home = ({ className = "" }: HomeProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const handleCreateInvoice = () => {
    setIsCreateDialogOpen(true);
  };

  const handleInvoiceCreated = (data: any) => {
    // In a real app, this would add the invoice to the database
    console.log("New invoice created:", data);
    // Close the dialog
    setIsCreateDialogOpen(false);
  };

  const handleEditInvoice = (id: string) => {
    // Navigate to edit invoice page
    console.log("Edit invoice:", id);
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <Sidebar activePath="/invoices" />
      <main className="flex-1 overflow-auto">
        <Topbar />

        <div className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-semibold">Invoices List</h1>

          <Button
            onClick={handleCreateInvoice}
            className="rounded-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 h-auto"
            asChild
          >
            <Link to="/create-invoice">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create new Invoice
            </Link>
          </Button>
        </div>

        <InvoiceList onEdit={handleEditInvoice} />

        <div className="p-6">
          <div className="bg-white rounded-lg p-4 flex flex-row gap-4 justify-start items-center">
            <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 16V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V16M16 12L12 16M12 16L8 12M12 16V4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Download</span>
            </button>

            <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 8L17.4392 9.97822C15.454 11.0811 14.4614 11.6326 13.4102 11.8488C12.4798 12.0401 11.5202 12.0401 10.5898 11.8488C9.53864 11.6326 8.54603 11.0811 6.5608 9.97822L3 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Email list document</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
