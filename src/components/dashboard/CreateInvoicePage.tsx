import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Calendar } from "lucide-react";

interface CreateInvoicePageProps {
  className?: string;
}

const CreateInvoicePage = ({ className = "" }: CreateInvoicePageProps) => {
  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <Sidebar activePath="/invoices" />
      <main className="flex-1 overflow-auto">
        <Topbar />

        <div className="p-6">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Create New Invoice</h1>
            <div className="flex space-x-2">
              <Button variant="outline" className="rounded-full">
                Recurring Invoices
              </Button>
              <Button variant="outline" className="rounded-full">
                Preview
              </Button>
              <Button variant="outline" className="rounded-full">
                Send Invoice
              </Button>
              <Button className="rounded-full bg-orange-600 hover:bg-orange-700 text-white">
                Save
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="contact">Contact *</Label>
                <Select defaultValue="">
                  <SelectTrigger id="contact" className="mt-2 h-12">
                    <SelectValue placeholder="Please enter a search term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact1">Contact 1</SelectItem>
                    <SelectItem value="contact2">Contact 2</SelectItem>
                    <SelectItem value="contact3">Contact 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Select defaultValue="">
                  <SelectTrigger id="contactPerson" className="mt-2 h-12">
                    <SelectValue placeholder="Client's name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="person1">Person 1</SelectItem>
                    <SelectItem value="person2">Person 2</SelectItem>
                    <SelectItem value="person3">Person 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="project">Project</Label>
                <Select defaultValue="">
                  <SelectTrigger id="project" className="mt-2 h-12">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project1">Project 1</SelectItem>
                    <SelectItem value="project2">Project 2</SelectItem>
                    <SelectItem value="project3">Project 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  className="mt-2 h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="invoiceId">Invoice ID</Label>
                <Input
                  id="invoiceId"
                  placeholder="3213456"
                  className="mt-2 h-12"
                  defaultValue="3213456"
                />
              </div>
              <div>
                <Label htmlFor="customerType">Customer Type</Label>
                <Select defaultValue="company">
                  <SelectTrigger id="customerType" className="mt-2 h-12">
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Date</Label>
                <div className="relative mt-2">
                  <Input
                    id="date"
                    placeholder="dd/mm/yy"
                    className="h-12 pr-10"
                    type="text"
                  />
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="chf">
                  <SelectTrigger id="currency" className="mt-2 h-12">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chf">CHF</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 h-auto mr-8"
            >
              Cancel
            </Button>
            <Button className="rounded-full bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 h-auto">
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateInvoicePage;
