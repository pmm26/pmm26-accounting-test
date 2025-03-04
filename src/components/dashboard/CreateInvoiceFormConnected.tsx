import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import InvoiceForm from "./InvoiceForm";
import { createInvoice, getClients, dollarsToCents } from "@/lib/api";
import type { Client, InvoiceInsert, LineItemInsert } from "@/lib/api";

interface CreateInvoiceFormConnectedProps {
  className?: string;
}

const CreateInvoiceFormConnected = ({
  className = "",
}: CreateInvoiceFormConnectedProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Convert dollar amounts to cents for storage
      const subtotalCents = dollarsToCents(data.subtotal);
      const taxAmountCents = dollarsToCents(data.taxAmount);
      const discountCents = dollarsToCents(data.discount);
      const totalCents = dollarsToCents(data.total);

      // Prepare invoice data
      const invoiceData: InvoiceInsert = {
        invoice_number:
          data.invoiceNumber ||
          `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        client_id: data.clientId,
        amount_cents: subtotalCents,
        tax_amount_cents: taxAmountCents,
        discount_cents: discountCents,
        total_cents: totalCents,
        status: data.status || "draft",
        invoice_date:
          data.invoiceDate || new Date().toISOString().split("T")[0],
        due_date: data.dueDate,
        payment_terms: data.paymentTerms,
        notes: data.notes,
        additional_info: data.additionalInfo,
        currency: data.currency || "USD",
      };

      // Prepare line items data
      const lineItemsData: LineItemInsert[] = data.lineItems.map(
        (item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price_cents: dollarsToCents(item.unitPrice),
          tax_percent: item.tax,
          total_cents: dollarsToCents(item.total),
        }),
      );

      // Create invoice with line items
      await createInvoice(invoiceData, lineItemsData);

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      // Navigate back to invoices list
      navigate("/");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <InvoiceForm
      initialData={{
        // Default values
        invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        currency: "USD",
        // Add other default values as needed
      }}
      clients={clients}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={isLoading}
      className={className}
    />
  );
};

export default CreateInvoiceFormConnected;
