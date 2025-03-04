import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

const filterSchema = z.object({
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  type: z.enum(["all", "income", "expense"]).default("all"),
  category: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

interface TransactionFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  categories: { id: string; name: string; type: string }[];
}

const TransactionFilters = ({
  onFilterChange,
  categories = [],
}: TransactionFiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      dateFrom: "",
      dateTo: "",
      type: "all",
      category: "",
    },
  });

  const handleSubmit = (data: FilterValues) => {
    const newActiveFilters: string[] = [];

    if (data.search) newActiveFilters.push("search");
    if (data.dateFrom) newActiveFilters.push("dateFrom");
    if (data.dateTo) newActiveFilters.push("dateTo");
    if (data.type !== "all") newActiveFilters.push("type");
    if (data.category) newActiveFilters.push("category");

    setActiveFilters(newActiveFilters);
    onFilterChange(data);
  };

  const clearFilter = (filterName: string) => {
    form.setValue(filterName as any, filterName === "type" ? "all" : "");
    setActiveFilters(activeFilters.filter((f) => f !== filterName));

    const currentValues = form.getValues();
    onFilterChange({
      ...currentValues,
      [filterName]: filterName === "type" ? "all" : "",
    });
  };

  const clearAllFilters = () => {
    form.reset({
      search: "",
      dateFrom: "",
      dateTo: "",
      type: "all",
      category: "",
    });
    setActiveFilters([]);
    onFilterChange({
      search: "",
      dateFrom: "",
      dateTo: "",
      type: "all",
      category: "",
    });
  };

  return (
    <div className="w-full bg-white p-4 border-b border-gray-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input
                        placeholder="Search transactions..."
                        className="pl-9 py-2"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateFrom"
              render={({ field }) => (
                <FormItem className="w-[150px]">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="From"
                        className="pl-9 py-2"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateTo"
              render={({ field }) => (
                <FormItem className="w-[150px]">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="To"
                        className="pl-9 py-2"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-[150px]">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-[200px]">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </form>
      </Form>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className="flex items-center gap-1"
            >
              {filter === "search" && "Search"}
              {filter === "dateFrom" && "From Date"}
              {filter === "dateTo" && "To Date"}
              {filter === "type" && "Type"}
              {filter === "category" && "Category"}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => clearFilter(filter)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 h-6"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
