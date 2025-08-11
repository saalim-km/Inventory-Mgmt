import { Route, Routes } from "react-router-dom"
import { AuthRoute, NoAuthRoute } from "./protected/ProtectedRoutes"
import { Toaster } from 'sonner';
import { AuthPage } from "./pages/Auth";
import { CustomerManagement } from "./pages/Customers";
import { ItemManagement } from "./pages/Item";
import { SaleManagement } from "./pages/Sales";
import { ReportsPage } from "./pages/Report";
import { ExportPage } from "./pages/Export";

function App() {

  return (
    <>
      <Toaster richColors = {true} position={"top-right"}/>
      <Routes>
        <Route path="/login" element = {<NoAuthRoute element={<AuthPage/>}/>}/>
        <Route path="/" element = {<AuthRoute element={<CustomerManagement/>}/>}/>
        <Route path="/items" element = {<AuthRoute element={<ItemManagement/>}/>}/>
        <Route path="/sales" element = {<AuthRoute element={<SaleManagement/>}/>}/>
        <Route path="/report" element = {<AuthRoute element={<ReportsPage/>}/>}/>
        <Route path="/export" element = {<AuthRoute element={<ExportPage/>}/>}/>
      </Routes>
    </>
  )
}

export default App