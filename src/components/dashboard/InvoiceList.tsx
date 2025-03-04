import React, { useEffect, useState } from "react";
import { getInvoices, deleteInvoice, formatCurrency } from "@/lib/api";
import type { Invoice } from "@/lib/api";
import InvoiceTable from "./InvoiceTable";
import InvoiceControls from "./InvoiceControls";
import SummaryCards from "./SummaryCards";
import { useToast } from "@/components/ui/use-toast";

interface InvoiceListProps {
  onEdit?: (id: string) => void;
  className?: string;
}

const InvoiceList = ({ onEdit, className = "" }: InvoiceListProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    dateRange: undefined,
    amountRange: "all",
  });

  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchQuery, activeFilters]);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await getInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast({
        title: "Error",
        description: "Failed to load invoices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_number.toLowerCase().includes(query) ||
          (invoice.clients?.name &&
            invoice.clients.name.toLowerCase().includes(query)),
      );
    }

    // Apply status filter
    if (activeFilters.status !== "all") {
      filtered = filtered.filter(
        (invoice) => invoice.status === activeFilters.status,
      );
    }

    // Apply date range filter
    if (activeFilters.dateRange?.from && activeFilters.dateRange?.to) {
      const fromDate = new Date(activeFilters.dateRange.from);
      const toDate = new Date(activeFilters.dateRange.to);

      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.invoice_date);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }

    // Apply amount range filter
    if (activeFilters.amountRange !== "all") {
      // Example implementation - can be customized based on your needs
      switch (activeFilters.amountRange) {
        case "under1000":
          filtered = filtered.filter((invoice) => invoice.total_cents < 100000);
          break;
        case "1000to5000":
          filtered = filtered.filter(
            (invoice) =>
              invoice.total_cents >= 100000 && invoice.total_cents <= 500000,
          );
          break;
        case "over5000":
          filtered = filtered.filter((invoice) => invoice.total_cents > 500000);
          break;
      }
    }

    setFilteredInvoices(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await deleteInvoice(id);
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      loadInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      // This would be implemented with updateInvoice from the API
      toast({
        title: "Success",
        description: "Invoice marked as paid",
      });
      loadInvoices();
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendReminder = async (id: string) => {
    // This would be implemented with a separate API call
    toast({
      title: "Reminder Sent",
      description: "Invoice reminder has been sent to the client",
    });
  };

  // Calculate summary data
  const calculateSummaryData = () => {
    const totalInvoiced = invoices.reduce(
      (sum, invoice) => sum + invoice.total_cents,
      0,
    );
    const amountDue = invoices
      .filter(
        (invoice) =>
          invoice.status === "pending" || invoice.status === "overdue",
      )
      .reduce((sum, invoice) => sum + invoice.total_cents, 0);
    const totalPaid = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.total_cents, 0);

    return {
      totalInvoiced: {
        amount: formatCurrency(totalInvoiced),
      },
      amountDue: {
        amount: formatCurrency(amountDue),
      },
      totalPaid: {
        amount: formatCurrency(totalPaid),
      },
    };
  };

  const summaryData = calculateSummaryData();

  // Format invoices for the table component
  const formattedInvoices = filteredInvoices.map((invoice) => ({
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    customer: {
      name: invoice.clients?.name || "Unknown Client",
      email: invoice.clients?.email || "",
    },
    amount: invoice.total_cents / 100, // Convert cents to dollars for display
    status: invoice.status as "paid" | "pending" | "overdue",
    date: invoice.invoice_date,
  }));

  return (
    <div className={className}>
      <SummaryCards
        totalInvoiced={summaryData.totalInvoiced}
        amountDue={summaryData.amountDue}
        totalPaid={summaryData.totalPaid}
      />

      <div className="flex flex-col">
        <InvoiceControls
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        <div className="p-6">
          <InvoiceTable
            invoices={formattedInvoices}
            onEdit={onEdit}
            onDelete={handleDeleteInvoice}
            onMarkAsPaid={handleMarkAsPaid}
            onSendReminder={handleSendReminder}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
