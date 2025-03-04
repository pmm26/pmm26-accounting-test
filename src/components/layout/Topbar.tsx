import React from "react";
import { Search, Bell, ChevronDown, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopbarProps {
  className?: string;
}

const Topbar = ({ className = "" }: TopbarProps) => {
  return (
    <div className={`w-full bg-white border-b border-gray-200 ${className}`}>
      <div className="flex justify-between items-center px-8 py-6">
        <div className="relative w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search..."
            className="pl-10 py-2 rounded-full border-gray-300 w-full"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              10
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
