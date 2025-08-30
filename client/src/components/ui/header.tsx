import { useNavigate } from "react-router-dom";
import { LogOut , User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../store/userSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./button";
import type { Rootstate } from "../../store/store";

export const Header = () => {
  const user = useSelector((state : Rootstate)=>state.user.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center">
        <h1 className="text-xl font-medium text-gray-800">Inventory Management System</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 rounded-full py-1 px-3 hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-gray-700">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="bg-white rounded-md shadow-lg p-2 min-w-[180px] border border-gray-200"
        >
          <DropdownMenuItem 
            onClick={handleLogout} 
            className="flex items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
