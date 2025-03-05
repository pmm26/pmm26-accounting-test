import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import InvoiceForm from "./InvoiceForm";
import { createInvoice, dollarsToCents } from "@/lib/api";
import type { InvoiceInsert, LineItemInsert } from "@/lib/api";

interface CreateInvoiceFormConnectedProps {
  className?: string;
}

const CreateInvoiceFormConnected = ({
  className = "",
}: CreateInvoiceFormConnectedProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);

    if (!data.clientId) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert dollar amounts to cents for storage
      const subtotalCents = dollarsToCents(data.subtotal);
      const taxAmountCents = dollarsToCents(data.taxAmount);
      const discountCents = dollarsToCents(data.discount);
      const totalCents = dollarsToCents(data.total);

      console.log("Converted amounts:", {
        subtotalCents,
        taxAmountCents,
        discountCents,
        totalCents,
      });

      // Prepare invoice data
      const invoiceData: InvoiceInsert = {
        invoice_number: data.invoiceNumber,
        client_id: data.clientId,
        amount_cents: subtotalCents,
        tax_amount_cents: taxAmountCents,
        discount_cents: discountCents,
        total_cents: totalCents,
        status: data.status,
        invoice_date: data.invoiceDate,
        due_date: data.dueDate,
        payment_terms: data.paymentTerms,
        notes: data.notes,
        additional_info: data.additionalInfo,
        currency: data.currency,
      };

      console.log("Invoice data to be sent:", invoiceData);

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

      console.log("Line items data to be sent:", lineItemsData);

      // Create invoice with line items
      const result = await createInvoice(invoiceData, lineItemsData);
      console.log("Create invoice result:", result);

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      // Navigate back to invoices list
      console.log("Attempting to navigate to /");
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
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isPending={isLoading}
      className={className}
    />
  );
};

export default CreateInvoiceFormConnected;
