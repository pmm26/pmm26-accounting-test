import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";

export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type LineItem = Database["public"]["Tables"]["line_items"]["Row"];

export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"];
export type LineItemInsert =
  Database["public"]["Tables"]["line_items"]["Insert"];

// Client API
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  if (error) throw error;
  return data || [];
};

export const getClient = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createClient = async (client: ClientInsert): Promise<Client> => {
  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateClient = async (
  id: string,
  client: Partial<ClientInsert>,
): Promise<Client> => {
  const { data, error } = await supabase
    .from("clients")
    .update(client)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw error;
};

// Invoice API
export const getInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(id, name, email)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getInvoice = async (id: string): Promise<Invoice | null> => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(id, name, email)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createInvoice = async (
  invoice: InvoiceInsert,
  lineItems: LineItemInsert[],
): Promise<{ invoice: Invoice; lineItems: LineItem[] }> => {
  // Start a transaction
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .insert(invoice)
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Add the invoice_id to each line item
  const lineItemsWithInvoiceId = lineItems.map((item) => ({
    ...item,
    invoice_id: invoiceData.id,
  }));

  const { data: lineItemsData, error: lineItemsError } = await supabase
    .from("line_items")
    .insert(lineItemsWithInvoiceId)
    .select();

  if (lineItemsError) throw lineItemsError;

  return {
    invoice: invoiceData,
    lineItems: lineItemsData || [],
  };
};

export const updateInvoice = async (
  id: string,
  invoice: Partial<InvoiceInsert>,
  lineItems?: LineItemInsert[],
): Promise<{ invoice: Invoice; lineItems?: LineItem[] }> => {
  // Update invoice
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .update(invoice)
    .eq("id", id)
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // If line items are provided, delete existing ones and insert new ones
  if (lineItems) {
    // Delete existing line items
    const { error: deleteError } = await supabase
      .from("line_items")
      .delete()
      .eq("invoice_id", id);

    if (deleteError) throw deleteError;

    // Add the invoice_id to each line item
    const lineItemsWithInvoiceId = lineItems.map((item) => ({
      ...item,
      invoice_id: id,
    }));

    // Insert new line items
    const { data: lineItemsData, error: lineItemsError } = await supabase
      .from("line_items")
      .insert(lineItemsWithInvoiceId)
      .select();

    if (lineItemsError) throw lineItemsError;

    return {
      invoice: invoiceData,
      lineItems: lineItemsData || [],
    };
  }

  return { invoice: invoiceData };
};

export const deleteInvoice = async (id: string): Promise<void> => {
  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) throw error;
};

// Line Items API
export const getLineItems = async (invoiceId: string): Promise<LineItem[]> => {
  const { data, error } = await supabase
    .from("line_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at");

  if (error) throw error;
  return data || [];
};

// Utility functions
export const formatCurrency = (cents: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

export const centsToDollars = (cents: number): number => {
  return cents / 100;
};

export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};
