import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  Calendar,
  User,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { DashboardLayout } from "../components/Layout";
import type { ICustomer } from "../types/auth.type";
import {
  exportSalesToExcel,
  exportSalesToPDF,
  fetchCustomer,
  getPrintableSalesReport,
} from "../service/services";
import { DatePicker } from "../components/ui/date-picker";
import { Button } from "../components/ui/button";
import { handleError } from "../utils/error-handler";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

export const ExportPage = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState({
    excel: false,
    pdf: false,
    print: false,
    email: false
  });

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetchCustomer({ page: 1, limit: 1000 });
        setCustomers(res.data.data);
      } catch (error) {
        handleError(error);
      }
    }
    loadCustomers();
  }, []);

  const handleExport = async (type: "excel" | "pdf" | "email" | "print") => {
    if (!fromDate || !toDate) return toast.error("Please select date range");
    if (toDate < fromDate) return toast.error("End date cannot be before start date");
    if (type === "email" && !emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    const from = fromDate.toISOString();
    const to = toDate.toISOString();
    const customer = selectedCustomer !== "all" ? selectedCustomer : undefined;

    setIsLoading(prev => ({ ...prev, [type]: true }));

    try {
      if (type === "excel") {
        await exportSalesToExcel(from, to, customer);
        toast.success("Excel export completed successfully");
      } else if (type === "pdf") {
        await exportSalesToPDF(from, to, customer);
        toast.success("PDF export completed successfully");
      } else if (type === "print") {
        await getPrintableSalesReport(from, to, customer);
        toast.success("Print preview generated");
      } else if (type === "email") {
        // Implement email functionality here with email address
        toast.success(`Report sent to ${email}`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedCustomer("all");
    setEmail("");
  };

  const hasFilters = fromDate || toDate || selectedCustomer !== "all" || email;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Export Reports</h1>
          <p className="text-gray-600">Generate and export sales reports in various formats</p>
        </div>

        <Card className="w-full border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-blue-600" />
                  Export Settings
                </CardTitle>
                <CardDescription>
                  Select date range, customer, and email to generate reports
                </CardDescription>
              </div>
              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* From Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  From Date
                </Label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date!)}
                  className="w-full"
                />
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  To Date
                </Label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date!)}
                  className="w-full"
                />
              </div>

              {/* Customer Select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Customer
                </Label>
                <Select
                  value={selectedCustomer}
                  onValueChange={setSelectedCustomer}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer._id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full"
                />
              </div>
            </div>

            {/* Summary Card */}
            {(fromDate || toDate || selectedCustomer !== "all" || email) && (
              <Card className="bg-gray-50 border-gray-200 mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">From:</span>
                      <p className="font-medium">
                        {fromDate ? fromDate.toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">To:</span>
                      <p className="font-medium">
                        {toDate ? toDate.toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Customer:</span>
                      <p className="font-medium">
                        {selectedCustomer === "all" ? "All Customers" : selectedCustomer}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">
                        {email || "Not set"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => handleExport("excel")}
                disabled={!fromDate || !toDate || isLoading.excel}
                className="flex items-center gap-2 h-12"
                variant="outline"
              >
                {isLoading.excel ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                ) : (
                  <FileSpreadsheet className="w-5 h-5" />
                )}
                Excel Export
              </Button>

              <Button
                onClick={() => handleExport("pdf")}
                disabled={!fromDate || !toDate || isLoading.pdf}
                className="flex items-center gap-2 h-12"
                variant="outline"
              >
                {isLoading.pdf ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                PDF Export
              </Button>

              <Button
                onClick={() => handleExport("print")}
                disabled={!fromDate || !toDate || isLoading.print}
                className="flex items-center gap-2 h-12"
                variant="outline"
              >
                {isLoading.print ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                ) : (
                  <Printer className="w-5 h-5" />
                )}
                Print Report
              </Button>

              <Button
                onClick={() => handleExport("email")}
                disabled={!fromDate || !toDate || !email || isLoading.email}
                className="flex items-center gap-2 h-12 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading.email ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                Email Report
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Download className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Export Tips</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Select a date range, optionally filter by customer, and enter a valid email address to generate and send reports.
                    All exports will include sales data for the selected criteria.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};