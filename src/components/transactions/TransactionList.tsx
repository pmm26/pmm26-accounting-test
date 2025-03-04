import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Tag,
  Trash2,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tables } from "@/types/supabase";

type Transaction = Tables<"transactions">;

type TransactionListProps = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
};

const TransactionList = ({
  transactions = [],
  isLoading = false,
  error = null,
  onSort,
  sortField = "date",
  sortDirection = "desc",
  onEdit,
  onDelete,
}: TransactionListProps) => {
  const [transactionToDelete, setTransactionToDelete] = React.useState<
    string | null
  >(null);

  const handleSort = (field: string) => {
    onSort(field);
  };

  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      onDelete(transactionToDelete);
      setTransactionToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <Skeleton className="h-6 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold">
              Error loading transactions
            </h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No transactions found</h3>
            <p className="text-muted-foreground mt-2">
              You haven't added any transactions yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <ArrowUpDown className="ml-2 h-3 w-3 rotate-180" />
      ) : (
        <ArrowUpDown className="ml-2 h-3 w-3" />
      );
    }
    return <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />;
  };

  return (
    <>
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`font-medium flex items-center ${sortField === "date" ? "text-primary" : ""}`}
                      onClick={() => handleSort("date")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Date
                      {getSortIcon("date")}
                    </Button>
                  </th>
                  <th className="text-left p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`font-medium flex items-center ${sortField === "description" ? "text-primary" : ""}`}
                      onClick={() => handleSort("description")}
                    >
                      Description
                      {getSortIcon("description")}
                    </Button>
                  </th>
                  <th className="text-left p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`font-medium flex items-center ${sortField === "category" ? "text-primary" : ""}`}
                      onClick={() => handleSort("category")}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      Category
                      {getSortIcon("category")}
                    </Button>
                  </th>
                  <th className="text-right p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`font-medium flex items-center justify-end ${sortField === "amount" ? "text-primary" : ""}`}
                      onClick={() => handleSort("amount")}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Amount
                      {getSortIcon("amount")}
                    </Button>
                  </th>
                  <th className="text-right p-3 w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="p-3">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{transaction.description}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                        {transaction.category}
                      </span>
                    </td>
                    <td
                      className={`p-3 text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {(Math.abs(Number(transaction.amount)) / 100).toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                            >
                              <path
                                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEdit(transaction)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(transaction.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!transactionToDelete}
        onOpenChange={() => setTransactionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionList;
