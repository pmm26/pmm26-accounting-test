import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateInvoicePageProps {
  className?: string;
}

const CreateInvoicePage = ({ className = "" }: CreateInvoicePageProps) => {
  // Sample data for dropdowns
  const typeOptions = ["Product", "Service", "Subscription", "Consultation"];
  const itemOptions = ["New", "Existing", "Custom"];
  const unitOptions = ["Hour", "Day", "Week", "Month", "Piece", "Project"];
  const taxRateOptions = [
    "UN81 - Revenue (NS)",
    "UN82 - Revenue (S)",
    "UN83 - Revenue (Z)",
    "UN84 - Revenue (E)",
  ];
  const statusOptions = ["Draft", "Pending", "Paid", "Overdue", "Cancelled"];

  const [formData, setFormData] = useState({
    type: "",
    item: "New",
    description: "UX/UI Design",
    quantity: "",
    unit: "New",
    discount: "UX/UI Desgn",
    account: "3200 - Gross proceeds credit s...",
    taxRate: "UN81 - Revenue (NS)",
    total: "3200 - Gross proceeds credit s...",
    status: "Pending",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <>
      {/* Page Content */}
      <div className="p-8">
        {/* Page Title and Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold font-['Poppins']">
            Create New Invoice
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full border border-orange-600/10 text-orange-600 font-['Poppins']"
            >
              Preview
            </Button>
            <Button
              variant="outline"
              className="rounded-full border border-orange-600/10 text-orange-600 font-['Poppins']"
            >
              Send Invoice
            </Button>
            <Button className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-['Poppins']">
              Save
            </Button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 */}
            <div className="flex gap-8">
              <div className="w-1/2 space-y-2">
                <label className="text-base font-normal font-['Poppins']">
                  Type
                </label>
                <div className="relative">
                  <select
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/20 text-base font-medium font-['Poppins'] appearance-none"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="" disabled>
                      Please enter a search term
                    </option>
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="#030229"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-1/2 space-y-2">
                <label className="text-base font-normal font-['Poppins']">
                  Item
                </label>
                <div className="relative">
                  <select
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins'] appearance-none"
                    value={formData.item}
                    onChange={(e) => handleChange("item", e.target.value)}
                  >
                    {itemOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="#030229"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                />
              </div>
              <div className="w-1/2 space-y-2">
                <label className="text-base font-normal font-['Poppins']">
                  Quantity *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="#030229"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
                  <select
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins'] appearance-none"
                    value={formData.unit}
                    onChange={(e) => handleChange("unit", e.target.value)}
                  >
                    {unitOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="#030229"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-1/2 space-y-2">
                <label className="text-base font-normal font-['Poppins']">
                  Discount in %
                </label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) => handleChange("discount", e.target.value)}
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
                  value={formData.account}
                  onChange={(e) => handleChange("account", e.target.value)}
                  className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                />
              </div>
              <div className="w-1/2 space-y-2">
                <label className="text-base font-normal font-['Poppins']">
                  Tax Rate *
                </label>
                <div className="relative">
                  <select
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins'] appearance-none"
                    value={formData.taxRate}
                    onChange={(e) => handleChange("taxRate", e.target.value)}
                  >
                    {taxRateOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="#030229"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
                  value={formData.total}
                  onChange={(e) => handleChange("total", e.target.value)}
                  className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins']"
                />
              </div>
              <div className="w-1/2 space-y-2">
                <label className="text-base font-normal font-['Poppins']">
                  Status
                </label>
                <div className="relative">
                  <select
                    className="w-full h-14 px-4 bg-[#f7f7f8] rounded-[10px] border text-[#030229]/70 text-base font-medium font-['Poppins'] appearance-none"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="#030229"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-center gap-8 mt-12">
              <Button
                type="button"
                variant="outline"
                className="w-full h-14 rounded-full border border-orange-600/10 text-orange-600 font-medium font-['Poppins']"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full h-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-medium font-['Poppins']"
              >
                Save
              </Button>
            </div>
          </form>
        </div>

        {/* Back Button - Moved to bottom as per design */}
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-black hover:text-gray-700"
          >
            <ChevronLeft className="h-6 w-6 rotate-180" />
            <span className="font-medium ml-2 font-['Manrope']">Back</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CreateInvoicePage;
