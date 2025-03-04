import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  CreditCard,
  BarChart3,
  LogOut,
  ChevronRight,
  GraduationCap,
  UserCircle,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  activePath?: string;
}

const Sidebar = ({ className = "", activePath = "/" }: SidebarProps) => {
  const mainNavItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/",
    },
  ];

  const financeNavItems = [
    {
      title: "Finance Management",
      icon: <CreditCard className="w-5 h-5" />,
      path: "/finance",
      subItems: [
        { title: "All Invoices", path: "/invoices" },
        { title: "Transactions", path: "/transactions", active: true },
        { title: "Recurring Invoices", path: "/recurring-invoices" },
        { title: "Expense Tracking", path: "/expense-tracking" },
        { title: "Recurring Expense", path: "/recurring-expense" },
        { title: "Bank Integration", path: "/bank-integration" },
      ],
    },
  ];

  const otherNavItems = [
    {
      title: "Compliance Payroll",
      icon: <FileText className="w-5 h-5" />,
      path: "/payroll",
    },
    {
      title: "Client Management",
      icon: <Users className="w-5 h-5" />,
      path: "/clients",
    },
    {
      title: "Task Automation",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/automation",
    },
    {
      title: "Reports",
      icon: <BarChart3 className="w-5 h-5" />,
      path: "/reports",
    },
    {
      title: "Support Knowledge",
      icon: <HelpCircle className="w-5 h-5" />,
      path: "/support",
    },
    {
      title: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  const renderNavItem = (item: any) => (
    <li key={item.path}>
      <Link to={item.path}>
        <Button
          variant={item.path === activePath ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start text-left font-medium py-3 px-4",
            item.path === activePath
              ? "bg-slate-200 hover:bg-slate-300"
              : "hover:bg-slate-100",
          )}
        >
          <span className="mr-3">{item.icon}</span>
          {item.title}
          {item.path === activePath && (
            <ChevronRight className="w-4 h-4 ml-auto" />
          )}
        </Button>
      </Link>
      {item.subItems && item.subItems.length > 0 && (
        <ul className="ml-4 mt-1 space-y-1">
          {item.subItems.map((subItem: any) => (
            <li key={subItem.path}>
              <Link to={subItem.path}>
                <Button
                  variant={
                    subItem.active || subItem.path === activePath
                      ? "secondary"
                      : "ghost"
                  }
                  className={cn(
                    "w-full justify-start text-left font-normal py-2 px-4 pl-10",
                    subItem.active || subItem.path === activePath
                      ? "bg-slate-200 hover:bg-slate-300"
                      : "hover:bg-slate-100",
                  )}
                >
                  {subItem.title}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-[250px] bg-slate-50 border-r border-slate-200",
        className,
      )}
    >
      <div className="flex items-center p-6">
        <h1 className="text-2xl font-semibold">Logo</h1>
      </div>

      <nav className="flex-1">
        <div className="px-4 py-2">
          <ul className="space-y-1">{mainNavItems.map(renderNavItem)}</ul>
        </div>

        <div className="px-4 py-2">
          <ul className="space-y-1">{financeNavItems.map(renderNavItem)}</ul>
        </div>

        <div className="px-4 py-2">
          <ul className="space-y-1">{otherNavItems.map(renderNavItem)}</ul>
        </div>
      </nav>

      <div className="mt-auto p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
