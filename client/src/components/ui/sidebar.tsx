import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Users, Package, DollarSign, FileText, Download , Store, ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { Separator } from "@radix-ui/react-dropdown-menu";

type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
};

// Sidebar items configuration
const sidebarItems: SidebarItem[] = [
  {
    id: "customers",
    label: "Customer Management",
    icon: <Users className="w-5 h-5" />,
    path: "/",
  },
  {
    id: "items",
    label: "Item Management",
    icon: <Package className="w-5 h-5" />,
    path: "/items",
  },
  {
    id: "sales",
    label: "Sales",
    icon: <DollarSign className="w-5 h-5" />,
    path: "/sales",
  },
  {
    id: "report",
    label: "Report",
    icon: <FileText className="w-5 h-5" />,
    path: "/report",
  },
  {
    id: "export",
    label: "Export",
    icon: <Download className="w-5 h-5" />,
    path: "/export",
  },
];

export const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white dark:bg-gray-800 shadow-md transition-all duration-300 flex flex-col h-screen border-r border-gray-200`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className={`flex items-center ${!isSidebarOpen && "hidden"}`}>
          <Store className="w-8 h-8 text-blue-600 mr-2" />
          <h2 className="text-xl font-medium text-gray-800">
            Inventory Manager
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className={`w-5 h-5 text-gray-600 transition-transform ${!isSidebarOpen && "rotate-180"}`} />
        </Button>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`${isActive ? "text-blue-600" : "text-gray-500"}`}>
                      {item.icon}
                    </div>
                    {isSidebarOpen && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer with version info */}
      {isSidebarOpen && (
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
          v1.0.0
        </div>
      )}
    </aside>
  );
};
