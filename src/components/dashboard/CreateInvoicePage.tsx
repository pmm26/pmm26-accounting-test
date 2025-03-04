import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateInvoicePageProps {
  className?: string;
}

const CreateInvoicePage = ({ className = "" }: CreateInvoicePageProps) => {
  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <Sidebar activePath="/invoices" />
      <main className="flex-1 overflow-auto">
        <Topbar />

        {/* Page Content */}
        <div className="p-8">
          {/* Back Button */}
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-black hover:text-gray-700"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="font-medium ml-2 font-['Manrope']">Back</span>
            </Link>
          </div>

          {/* Page Title and Actions */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold font-['Poppins']">
              Create New Invoice
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-full border border-orange-600/10 text-orange-600"
              >
                Preview
              </Button>
              <Button
                variant="outline"
                className="rounded-full border border-orange-600/10 text-orange-600"
              >
                Send Invoice
              </Button>
              <Button className="rounded-full bg-orange-600 hover:bg-orange-700 text-white">
                Save
              </Button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl p-8 mb-6">
            <div className="space-y-5">
              {/* Row 1 */}
              <div className="flex gap-8">
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Type
                  </label>
                  <input
                    type="text"
                    placeholder="Please enter a search term"
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/20 text-base font-medium font-['Poppins']"
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Item
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value="New"
                      className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <ChevronLeft className="h-6 w-6 rotate-270" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex gap-8">
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Description
                  </label>
                  <input
                    type="text"
                    defaultValue="UX/UI Design"
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Quantity *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <ChevronLeft className="h-6 w-6 rotate-270" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex gap-8">
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Unit
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="New"
                      className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <ChevronLeft className="h-6 w-6 rotate-270" />
                    </div>
                  </div>
                </div>
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Discount in %
                  </label>
                  <input
                    type="text"
                    defaultValue="UX/UI Desgn"
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex gap-8">
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Account
                  </label>
                  <input
                    type="text"
                    defaultValue="3200 - Gross proceeds credit s..."
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Tax Rate *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="UN81 - Revenue (NS)"
                      className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <ChevronLeft className="h-6 w-6 rotate-270" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex gap-8">
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Total
                  </label>
                  <input
                    type="text"
                    defaultValue="3200 - Gross proceeds credit s..."
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <label className="text-base font-normal font-['Poppins']">
                    Status
                  </label>
                  <input
                    type="text"
                    defaultValue="Pending"
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-center gap-8 mt-12">
              <Button
                variant="outline"
                className="w-full h-14 rounded-full border border-orange-600/10 text-orange-600 font-medium"
              >
                Cancel
              </Button>
              <Button className="w-full h-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-medium">
                Save
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateInvoicePage;
