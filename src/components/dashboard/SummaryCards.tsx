import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

interface SummaryCardProps {
  title: string;
  amount: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const SummaryCard = ({
  title = "Card Title",
  amount = "$0.00",
  trend = { value: "0%", isPositive: true },
  icon = <DollarSign className="h-5 w-5" />,
  className = "",
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-500",
}: SummaryCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className={`p-2 rounded-full ${iconBgColor} mr-2`}>{icon}</div>
          <span className="text-lg font-normal">{title}</span>
        </div>
        <span className="text-3xl font-bold">{amount}</span>
      </div>
    </div>
  );
};

interface SummaryCardsProps {
  totalInvoiced?: {
    amount: string;
    trend?: { value: string; isPositive: boolean };
  };
  amountDue?: {
    amount: string;
    trend?: { value: string; isPositive: boolean };
  };
  totalPaid?: {
    amount: string;
    trend?: { value: string; isPositive: boolean };
  };
}

const SummaryCards = ({
  totalInvoiced = {
    amount: "60",
  },
  amountDue = {
    amount: "$100",
  },
  totalPaid = {
    amount: "$4000",
  },
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50">
      <SummaryCard
        title="Total invoiced"
        amount={totalInvoiced.amount}
        icon={
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
        }
        iconBgColor="bg-blue-100"
        iconColor="text-blue-500"
      />
      <SummaryCard
        title="Amount due"
        amount={amountDue.amount}
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
              stroke="#F97316"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        iconBgColor="bg-orange-100"
        iconColor="text-orange-500"
      />
      <SummaryCard
        title="Total Paid"
        amount={totalPaid.amount}
        icon={
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
        }
        iconBgColor="bg-green-100"
        iconColor="text-green-500"
      />
    </div>
  );
};

export default SummaryCards;
