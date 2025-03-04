import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import SummaryCards from "./dashboard/SummaryCards";
import InvoiceControls from "./dashboard/InvoiceControls";
import InvoiceTable from "./dashboard/InvoiceTable";
import CreateInvoiceDialog from "./dashboard/CreateInvoiceDialog";

interface HomeProps {
  className?: string;
}

const Home = ({ className = "" }: HomeProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  // Mock data for summary cards
  const summaryData = {
    totalInvoiced: {
      amount: "60",
    },
    amountDue: {
      amount: "$100",
    },
    totalPaid: {
      amount: "$4000",
    },
  };

  // Mock invoices data
  const invoices = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      customer: {
        name: "Acme Corp",
        email: "billing@acmecorp.com",
      },
      amount: 1250.0,
      status: "paid",
      date: "2023-05-15",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      customer: {
        name: "Globex Inc",
        email: "accounts@globex.com",
      },
      amount: 3450.75,
      status: "pending",
      date: "2023-05-20",
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      customer: {
        name: "Stark Industries",
        email: "finance@stark.com",
      },
      amount: 7890.5,
      status: "overdue",
      date: "2023-04-30",
    },
    {
      id: "4",
      invoiceNumber: "INV-004",
      customer: {
        name: "Wayne Enterprises",
        email: "payments@wayne.com",
      },
      amount: 5250.25,
      status: "pending",
      date: "2023-05-25",
    },
    {
      id: "5",
      invoiceNumber: "INV-005",
      customer: {
        name: "Oscorp",
        email: "billing@oscorp.com",
      },
      amount: 2100.0,
      status: "paid",
      date: "2023-05-10",
    },
  ];

  const handleCreateInvoice = () => {
    setIsCreateDialogOpen(true);
  };

  const handleInvoiceCreated = (data: any) => {
    // In a real app, this would add the invoice to the database
    console.log("New invoice created:", data);
    // Close the dialog
    setIsCreateDialogOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would filter the invoices based on the search query
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    // In a real app, this would filter the invoices based on the selected filters
  };

  const handleEditInvoice = (id: string) => {
    // In a real app, this would open an edit dialog for the selected invoice
    console.log("Edit invoice:", id);
  };

  const handleDeleteInvoice = (id: string) => {
    // In a real app, this would delete the invoice from the database
    console.log("Delete invoice:", id);
  };

  const handleMarkAsPaid = (id: string) => {
    // In a real app, this would update the invoice status to paid
    console.log("Mark invoice as paid:", id);
  };

  const handleSendReminder = (id: string) => {
    // In a real app, this would send a reminder email to the customer
    console.log("Send reminder for invoice:", id);
  };

  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <Sidebar activePath="/invoices" />

      <main className="flex-1 overflow-auto">
        <div className="flex flex-col">
          <InvoiceControls
            onCreateInvoice={handleCreateInvoice}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          <div className="p-6">
            <InvoiceTable
              invoices={invoices}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onMarkAsPaid={handleMarkAsPaid}
              onSendReminder={handleSendReminder}
            />
          </div>

          <div className="p-6">
            <div className="bg-white rounded-lg p-4 flex flex-row gap-4 justify-start items-center">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
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

              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
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
        </div>
      </main>

      <CreateInvoiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateInvoice={handleInvoiceCreated}
      />
    </div>
  );
};

export default Home;
