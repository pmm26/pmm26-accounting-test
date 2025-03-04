import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TransactionHeader from "@/components/transactions/TransactionHeader";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionList from "@/components/transactions/TransactionList";
import { useToast } from "@/components/ui/use-toast";

type Transaction = Tables<"transactions">;
type FilterValues = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  type: "all" | "income" | "expense";
  category?: string;
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; type: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    dateFrom: "",
    dateTo: "",
    type: "all",
    category: "",
  });
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const { toast } = useToast();

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" });

      if (error) throw error;
      setTransactions(data || []);
      applyFilters(data || [], filters);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      setError(error.message || "Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, type")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
    fetchCategories();

    // Set up realtime subscription for transactions
    const subscription = supabase
      .channel("transactions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          fetchTransactions();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [sortField, sortDirection]);

  // Apply filters to transactions
  const applyFilters = (data: Transaction[], currentFilters: FilterValues) => {
    let filtered = [...data];

    // Apply search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm) ||
          t.category.toLowerCase().includes(searchTerm),
      );
    }

    // Apply date range filter
    if (currentFilters.dateFrom) {
      filtered = filtered.filter(
        (t) => new Date(t.date) >= new Date(currentFilters.dateFrom!),
      );
    }

    if (currentFilters.dateTo) {
      filtered = filtered.filter(
        (t) => new Date(t.date) <= new Date(currentFilters.dateTo!),
      );
    }

    // Apply type filter
    if (currentFilters.type !== "all") {
      filtered = filtered.filter((t) => t.type === currentFilters.type);
    }

    // Apply category filter
    if (
      currentFilters.category &&
      currentFilters.category !== "all-categories"
    ) {
      filtered = filtered.filter((t) => t.category === currentFilters.category);
    }

    setFilteredTransactions(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    applyFilters(transactions, newFilters);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });

      // Optimistically update UI
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      setTransactions(updatedTransactions);
      applyFilters(updatedTransactions, filters);
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  // Handle transaction edit
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    // In a real implementation, you would open an edit dialog here
    console.log("Edit transaction:", transaction);
    toast({
      title: "Edit Transaction",
      description: "Edit functionality will be implemented in the next phase",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePath="/transactions" />
      <main className="flex-1 overflow-auto">
        <Topbar />
        <div className="container mx-auto py-6 space-y-6">
          <TransactionHeader
            title="Transactions"
            onTransactionAdded={fetchTransactions}
          />

          <TransactionFilters
            onFilterChange={handleFilterChange}
            categories={categories}
          />

          <TransactionList
            transactions={filteredTransactions}
            isLoading={isLoading}
            error={error}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </main>
    </div>
  );
};

export default TransactionsPage;
