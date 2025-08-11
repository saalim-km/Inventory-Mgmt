import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Users, Package, DollarSign, FileText, Download } from "lucide-react";
import { Button } from "./button";
import { Separator } from "@radix-ui/react-dropdown-menu";

// Define types for sidebar items
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
    icon: <Users className="w-5 h-5 mr-2" />,
    path: "/",
  },
  {
    id: "items",
    label: "Item Management",
    icon: <Package className="w-5 h-5 mr-2" />,
    path: "/items",
  },
  {
    id: "sales",
    label: "Sales",
    icon: <DollarSign className="w-5 h-5 mr-2" />,
    path: "/sales",
  },
  {
    id: "report",
    label: "Report",
    icon: <FileText className="w-5 h-5 mr-2" />,
    path: "/report",
  },
  {
    id: "export",
    label: "Export",
    icon: <Download className="w-5 h-5 mr-2" />,
    path: "/export",
  },
];

export const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-16"
      } bg-gray-800 dark:bg-gray-800 shadow-md transition-all duration-300 flex flex-col h-screen`}
    >
      <div className="p-4 flex items-center justify-between">
        <h2
          className={`text-xl font-bold text-gray-800 dark:text-white ${
            !isSidebarOpen && "hidden"
          }`}
        >
          Dashboard
        </h2>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-white" />
        </Button>
      </div>
      <Separator />
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start text-white"
                  >
                    {item.icon}
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Button>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};