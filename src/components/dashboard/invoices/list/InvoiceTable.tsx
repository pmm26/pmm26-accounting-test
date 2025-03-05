import React from "react";

import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash,
  CheckCircle,
  Mail,
  Calendar,
  Badge,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
}

interface InvoiceTableProps {
  invoices?: Invoice[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkAsPaid?: (id: string) => void;
  onSendReminder?: (id: string) => void;
  isLoading?: boolean;
}

const InvoiceTable = ({
  invoices = [],
  onEdit = () => {},
  onDelete = () => {},
  onMarkAsPaid = () => {},
  onSendReminder = () => {},
  isLoading = false,
}: InvoiceTableProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "cancelled":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "pending":
        return "Pending";
      case "overdue":
        return "Overdue";
      case "draft":
        return "Draft";
      case "cancelled":
        return "Cancelled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm border">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Invoices</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[40px] py-4">
              <input type="checkbox" className="rounded border-gray-300" />
            </TableHead>
            <TableHead className="py-4">
              Date
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              No
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Status
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Due by
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Customer
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Net
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Gross
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4">
              Dispatch
              <Button variant="ghost" size="sm" className="ml-2 h-8 p-0">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="py-4 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-6 w-6 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="ml-2">Loading invoices...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No invoices found
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="py-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell className="py-4 font-normal">
                  {invoice.date}
                </TableCell>
                <TableCell className="py-4 font-normal">
                  {invoice.invoiceNumber}
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    className={`rounded-full px-4 py-1 font-normal border-0 ${getStatusBadgeColor(
                      invoice.status,
                    )}`}
                  >
                    {getStatusLabel(invoice.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 font-normal">2024-10-20</TableCell>
                <TableCell className="py-4 font-normal">
                  {invoice.customer.name}
                </TableCell>
                <TableCell className="py-4 font-normal">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell className="py-4 font-normal">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell className="py-4">
                  <Calendar className="h-5 w-5" />
                </TableCell>
                <TableCell className="py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-10 w-10 p-0 rounded-full"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(invoice.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(invoice.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      {invoice.status !== "paid" && (
                        <DropdownMenuItem
                          onClick={() => onMarkAsPaid(invoice.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {invoice.status !== "paid" && (
                        <DropdownMenuItem
                          onClick={() => onSendReminder(invoice.id)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Reminder
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
