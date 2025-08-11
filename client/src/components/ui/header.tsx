import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { userLogout } from "../../store/userSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./button";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow bg-white">
      <h1 className="text-lg font-semibold">Inventory Management</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            Account ▾
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};