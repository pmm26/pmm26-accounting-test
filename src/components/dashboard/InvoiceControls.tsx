import React, { useState } from "react";
import {
  PlusCircle,
  Search,
  Filter,
  Calendar,
  ChevronDown,
} from "lucide-react";
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
      <div className="p-6">
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
              <ChevronDown className="h-5 w-5 text-gray-600" />
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

          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-6 px-4">
            Go
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceControls;
