import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
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

export const ExportPage = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

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
    if (!fromDate || !toDate) return toast.error("Select date range");
    if (!selectedCustomer) return toast.error("Select a customer");

    const from = fromDate.toISOString();
    const to = toDate.toISOString();
    const customer = selectedCustomer || undefined;
    console.log(from,to,customer);
    try {
      if (type === "excel") {
        await exportSalesToExcel(from, to, customer);
      } else if (type === "pdf") {
        await exportSalesToPDF(from, to, customer);
      } else if (type === "print") {
        await getPrintableSalesReport(from, to, customer);
      }
    } catch (error) {
      console.log(error);
      toast.error("Export failed");
    }
  };

  return (
    <DashboardLayout>
      <Card className="w-full">
        <div className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <DatePicker
              selected={fromDate ?? null}
              onChange={(date) => setFromDate(date ?? null)}
            />

            <DatePicker
              selected={toDate ?? null}
              onChange={(date) => setToDate(date ?? null)}
            />
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">All Customers</option>
              {customers.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-4 mt-4 flex-wrap">
            <Button onClick={() => handleExport("excel")}>
              Export as Excel
            </Button>
            <Button onClick={() => handleExport("pdf")}>Export as PDF</Button>
            <Button onClick={() => handleExport("print")}>Print</Button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};
