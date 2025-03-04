import React, { useState } from "react";
import { PlusCircle, Search, Filter, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface InvoiceControlsProps {
  onCreateInvoice?: () => void;
  onFilterChange?: (filters: FilterOptions) => void;
  onSearch?: (query: string) => void;
}

interface FilterOptions {
  status: string;
  client: string;
  dateRange: DateRange | undefined;
  amountRange: string;
}

const InvoiceControls = ({
  onCreateInvoice = () => {},
  onFilterChange = () => {},
  onSearch = () => {},
}: InvoiceControlsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    client: "all",
    dateRange: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
    amountRange: "all",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full bg-white">
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-semibold">Invoices List</h1>

        <Button
          onClick={onCreateInvoice}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-auto"
        >
          Create new Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50">
        <div className="bg-white rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-full bg-blue-100 mr-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7Z"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 15H17M7 11H17M7 7H17"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg">Total invoiced</span>
          </div>
          <span className="text-3xl font-bold">60</span>
        </div>

        <div className="bg-white rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-full bg-amber-100 mr-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                  stroke="#D97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg">Amount due</span>
          </div>
          <span className="text-3xl font-bold">$100</span>
        </div>

        <div className="bg-white rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-full bg-green-100 mr-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg">Total Paid</span>
          </div>
          <span className="text-3xl font-bold">$4000</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative w-full md:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 py-6 rounded-lg text-base font-medium border-gray-300"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Filter by client name"
            className="py-6 rounded-lg text-base font-medium border-gray-300 w-full md:w-[200px]"
          />

          <div className="relative w-full md:w-[200px]">
            <Input
              placeholder="Filter by status"
              className="py-6 rounded-lg text-base font-medium border-gray-300 pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="relative w-full md:w-[200px]">
            <Input
              placeholder="Filter by amount"
              className="py-6 rounded-lg text-base font-medium border-gray-300 pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7H21M7 12H17M11 17H13"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="relative w-full md:w-[200px]">
            <Input
              placeholder="dd/mm/yy"
              className="py-6 rounded-lg text-base font-medium border-gray-300 pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="relative w-full md:w-[200px]">
            <Input
              placeholder="dd/mm/yy"
              className="py-6 rounded-lg text-base font-medium border-gray-300 pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-6 px-4">
            Go
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceControls;
